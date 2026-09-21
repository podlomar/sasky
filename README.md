# Šášky Chess Application

A chess game tracker with ELO ratings. The app is an [Astro](https://astro.build) site rendered on
demand by the Node adapter, storing games and players in SQLite. It is deployed as a container to a
single-machine [Uncloud](https://uncloud.run) cluster and served at
[sasky.podlomar.me](https://sasky.podlomar.me).

## Local development

```bash
npm install
npm run dev         # dev server on http://localhost:5000
npm run check       # type check
npm run build       # production build into dist/
npm start           # run the production build

npm run db:generate # regenerate SQL migrations after editing src/lib/schema.ts
npm run db:import   # (re)build the local database from data/*.json
npm run db:studio   # browse the database
```

Data lives in a SQLite database at `SASKY_DB_PATH`, which defaults to `sasky.db` inside
`SASKY_DATA_DIR` (itself defaulting to `./data`). The schema is defined in `src/lib/schema.ts`;
generated migrations live in `drizzle/` and are committed to the repository.

Pending migrations are applied automatically when the server opens the database, so a fresh install
needs no migration step of its own.

## Deployment

### How it fits together

| Piece | Where it lives |
| --- | --- |
| Container image | Built locally from `Dockerfile`, pushed straight to the cluster machine |
| Service definition | `compose.yaml` |
| HTTPS + certificates | Cluster-wide Caddy service, configured automatically from `x-ports` |
| Database | Docker volume `sasky-data`, mounted at `/app/data` |

The cluster was created with `--no-dns`, so Uncloud does **not** manage any DNS records. The
`sasky.podlomar.me` A record is maintained by hand and must point at the cluster machine's public IP
before the first deploy — Caddy proves domain ownership over HTTP to issue the Let's Encrypt
certificate, and that fails if the record is missing or stale.

Verify it at any time with:

```bash
dig +short sasky.podlomar.me      # must equal the machine's PUBLIC IP column below
uc machine ls
```

### Prerequisites

- The `uc` CLI installed locally, with a context pointing at the cluster (`uc ctx ls`)
- A local Docker daemon — images are built on your machine, not on the server
- The local machine's CPU architecture matching the server's (both `amd64` here)

### Deploy

```bash
npm run deploy      # == uc deploy
```

`uc deploy` reads `compose.yaml` and then:

1. builds the image from the `Dockerfile`, tagging it with a git-based version such as
   `sasky/sasky:2026-09-18-101500.00728c9`;
2. pushes it to the cluster machine, transferring only the layers it doesn't already have;
3. creates the `sasky-data` volume if it is missing;
4. shows a deployment plan for confirmation, then performs a rolling update, waiting for the
   container's health check to pass before sending traffic to it.

Add `-y` to skip the confirmation prompt in non-interactive contexts such as CI.

Because the image is built from a clean checkout context (see `.dockerignore`), your local `data/`
directory, `node_modules/` and `dist/` never end up inside it.

### Seeding the database

Players can only be created by importing them — there is no UI for it — so a brand-new deployment
needs one seeding pass before the app is usable. Prepare the database locally, then stream it into
the volume:

```bash
npm run db:import

# Fold the write-ahead log into the main file so a single file is self-contained.
node -e "const D=require('better-sqlite3');const db=new D('data/sasky.db');db.pragma('wal_checkpoint(TRUNCATE)');db.close()"

# Replace the database with the service stopped, and delete the stale WAL alongside it.
uc stop sasky
cat data/sasky.db | ssh root@<machine-ip> 'D=/var/lib/docker/volumes/sasky-data/_data
  cat > "$D/sasky.db"
  rm -f "$D/sasky.db-wal" "$D/sasky.db-shm"
  chown 1000:1000 "$D/sasky.db"'
uc start sasky
```

**Do not seed by piping into a running container.** The database runs in WAL mode, so the first
boot leaves a `sasky.db-wal` next to it holding the empty schema. Overwriting only `sasky.db` while
that WAL survives makes SQLite replay the old, empty pages over the new file — the app then reports
an empty database even though `sasky.db` is byte-for-byte correct. The WAL and `-shm` files must be
deleted together with the swap, which is why this is done on the host with the service stopped.

Verify afterwards:

```bash
uc exec -T sasky node -e "const D=require('/app/node_modules/better-sqlite3');const db=new D('/app/data/sasky.db',{readonly:true});console.log(db.prepare('select count(*) c from games').get().c)"
```

### Operating the service

```bash
uc ls                     # services in the cluster and their endpoints
uc inspect sasky          # containers, image version, machine placement
uc logs -f sasky          # follow application logs
uc exec sasky sh          # shell inside the running container
uc caddy config           # generated Caddyfile, to confirm the route exists
```

To back the database up, stream it out of the container:

```bash
uc exec -T sasky sh -c 'cat /app/data/sasky.db' > sasky-backup-$(date +%F).db
```

The volume survives redeploys and `uc rm sasky`; delete it deliberately with
`uc volume rm sasky-data` if you ever want to start from an empty database.

### Configuration

The container is configured entirely through environment variables set in `compose.yaml`:

| Variable | Value | Purpose |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | Astro's Node server binds to localhost otherwise, making it unreachable from Caddy |
| `PORT` | `3000` | Must match the container port in `x-ports` |
| `SASKY_DATA_DIR` | `/app/data` | The mounted volume |
| `SASKY_MIGRATIONS_DIR` | `/app/drizzle` | Migrations applied at startup |

To serve a different hostname, change it in `x-ports` and point that DNS record at the machine.

### CSRF origin check

`astro.config.mjs` sets `security: { checkOrigin: false }`. This is required behind the cluster's
Caddy and must stay off as long as TLS is terminated at the proxy.

Astro's origin check compares the browser's `Origin` header against the URL the server builds for
the request. In standalone mode that URL's protocol comes from `req.socket.encrypted` alone — see
`createRequestFromNodeRequest` in `astro/dist/core/app/node.js` — and `X-Forwarded-Proto` is never
consulted, even though Caddy sends it. Caddy terminates TLS and proxies plain HTTP to `:3000`, so
the server computes `http://sasky.podlomar.me` while the browser sends `https://sasky.podlomar.me`.
Every form POST then fails with `403 Cross-site POST form submissions are forbidden`, which in
practice means the "enter a game" form is unusable in production while GET pages work fine.

Neither Astro 7 nor `@astrojs/node` offers a trust-proxy option, and `security.allowedDomains` only
gates `X-Forwarded-Host`, not the protocol. Turning the check off costs nothing here: the app has no
authentication and no sessions (`session: false`), so anyone who can reach `/enter` can already
submit a game. If authentication is ever added, replace this with an equivalent check in
`src/middleware.ts` that derives the expected origin from `X-Forwarded-Proto` and `Host`.

Note that `Astro.url` is likewise `http://` rather than `https://` in production for the same
reason. Nothing currently depends on it, but keep it in mind before building absolute URLs from it.
