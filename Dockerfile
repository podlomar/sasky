# syntax=docker/dockerfile:1

# Astro requires Node >=22.12.
ARG NODE_VERSION=22

# better-sqlite3 ships a binding.gyp, so npm would auto-run `node-gyp rebuild` and
# fail on this image for lack of a C toolchain. It also ships prebuilt binaries
# (prebuilds/linux-x64.node), which are what the package loads at require time, so
# --ignore-scripts skips the pointless rebuild instead of installing python3/make/g++.
# This keeps the base glibc (never alpine) so the linux-x64 prebuild matches.

FROM node:${NODE_VERSION}-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Production dependencies only, resolved separately so they can be copied clean.
FROM node:${NODE_VERSION}-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    SASKY_DATA_DIR=/app/data \
    SASKY_MIGRATIONS_DIR=/app/drizzle

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Pending migrations are applied at startup, so the SQL files ship with the image.
COPY drizzle ./drizzle
COPY package.json ./

# Owned by node:node so the named volume mounted here inherits writable ownership.
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
