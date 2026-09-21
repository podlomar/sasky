import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: 5000 },
  session: false,

  // Astro's CSRF origin check compares the browser's `Origin` header against the
  // URL the server builds for the request. In standalone mode that URL's protocol
  // comes from `req.socket.encrypted` alone (see `createRequestFromNodeRequest` in
  // astro/dist/core/app/node.js) — `X-Forwarded-Proto` is ignored. Behind the
  // cluster's Caddy, which terminates TLS and proxies plain HTTP to :3000, the
  // server computes `http://sasky.podlomar.me` while the browser sends
  // `https://sasky.podlomar.me`, so every form POST is rejected with 403
  // "Cross-site POST form submissions are forbidden". There is no trust-proxy
  // option in Astro 7 or the adapter, and `security.allowedDomains` only gates
  // `X-Forwarded-Host`, not the protocol. Losing the check costs nothing here:
  // the app has no auth and no sessions, so a game can be submitted by anyone.
  security: { checkOrigin: false },
});
