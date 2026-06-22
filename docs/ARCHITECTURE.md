# Architecture Overview

## System Diagram

```
Browser
  │
  ▼
Cloudflare CDN / Pages
  │  Static assets (JS, CSS, icons sprite) served from edge cache
  │
  ▼
Cloudflare Workers (SSR)
  │  React Router v7 request handler — renders HTML on the edge
  │
  ├──▶ D1 (SQLite on Cloudflare)
  │       Contact form submissions via Prisma + @prisma/adapter-d1
  │
  └──▶ MDX content (bundled at build time)
          Blog posts and project pages compiled from content/**/*.mdx
```

## Request Lifecycle

1. **Request arrives** at the nearest Cloudflare edge node.
2. For static assets (`/icons/sprite.svg`, JS chunks, CSS) — served directly from the edge cache. No Worker invoked.
3. For HTML pages — the **Cloudflare Worker** (`workers/app.ts`) receives the request.
4. The Worker calls `createRequestHandler` from `@react-router/cloudflare`, passing the built React Router server bundle.
5. React Router matches the URL to a route file in `app/routes/`. It calls the route's `loader` (for GET) or `action` (for POST).
6. Loaders and actions that need database access call `getPrisma(env.DB)` from `app/db.server.ts`, which creates a Prisma client backed by the D1 binding.
7. React Router renders the matched route to a `ReadableStream` via `renderToReadableStream` in `app/entry.server.tsx`.
8. The streamed HTML response is sent to the client.
9. On the client, `entry.client.tsx` hydrates the React tree into the existing DOM.

## Content Pipeline (MDX)

```
content/blog/*.mdx           content/projects/*.mdx
        │                             │
        └──────────┬──────────────────┘
                   │ @mdx-js/rollup transforms at build time
                   ▼
          Compiled JS modules
          exports: { default: Component, frontmatter: {...} }
                   │
         import.meta.glob() in route loaders
                   │
        ┌──────────┴────────────────┐
        │                           │
   List routes                 Slug routes
   (eager glob,               (lazy glob,
   frontmatter only)          full module)
```

- **List pages** (`blog._index`, `projects._index`) use `eager: true` to import only frontmatter metadata — no full MDX render tree loaded.
- **Detail pages** (`blog.$slug`, `projects.$slug`) lazy-import the full module on demand.

## Icon Pipeline

```
icons/svg-icons/*.svg
        │
        │ vite-plugin-icons-spritesheet (at build time)
        ▼
public/icons/sprite.svg   ← single SVG sprite with all icons as <symbol> elements
        │
        │ served as a static asset from Cloudflare edge
        ▼
<Icon name="arrow-right" />
  renders: <svg><use href="/icons/sprite.svg#arrow-right" /></svg>
```

Add new icons by dropping an SVG file into `icons/svg-icons/`. The sprite is rebuilt automatically.

## Database

Only one model exists: `ContactSubmission`. The Prisma schema is in `prisma/schema.prisma`.

### Local Development

Wrangler emulates D1 locally in `.wrangler/state/v3/d1/`. Run migrations with:

```bash
npm run db:migrate:local
```

### Production

Migrations are applied to the remote D1 database:

```bash
npm run db:migrate:remote
```

There is no `prisma migrate dev` step — Prisma's standard SQLite migration workflow does not apply to D1. Instead, `prisma migrate diff` generates SQL and Wrangler applies it.

### Per-Request Client

`getPrisma(env.DB)` creates a fresh `PrismaClient` on every request. This is intentional: D1 bindings are request-scoped, and there is no connection pool to maintain (D1 is HTTP-backed).

## Environment Strategy

| Concern | Local | Production |
|---|---|---|
| D1 database | Wrangler local emulation (`.wrangler/`) | Cloudflare D1 remote |
| Worker runtime | `@cloudflare/vite-plugin` (real Workers runtime in dev) | Cloudflare Workers |
| Assets | Vite dev server | Cloudflare Pages CDN |
| Environment variables | `.dev.vars` (gitignored) | Cloudflare Pages secrets |

## Architecture Decision Records

- [ADR-0001 — React Router v7](decisions/0001-react-router-v7.md)
- [ADR-0002 — Cloudflare D1 + Prisma](decisions/0002-cloudflare-d1-prisma.md)
- [ADR-0003 — MDX Content in Repo](decisions/0003-mdx-content.md)
- [ADR-0004 — Tailwind CSS v4](decisions/0004-tailwind-v4.md)
- [ADR-0005 — Testing Strategy](decisions/0005-testing-strategy.md)
