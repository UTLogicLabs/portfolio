# ADR-0002 — Cloudflare D1 + Prisma

**Status:** Accepted  
**Date:** 2026-06-21

## Context

The contact form needs to persist submissions somewhere. The site runs on Cloudflare Workers. Options: Cloudflare D1 (SQLite on Cloudflare), KV (key-value, no relational queries), R2 (object storage, wrong tool), Turso (external SQLite), PlanetScale/Neon (external Postgres).

## Decision

Use **Cloudflare D1** as the database, accessed via **Prisma** with `@prisma/adapter-d1`.

## Rationale

- D1 is native to the Cloudflare platform — no external network hop, same billing, same dashboard.
- Prisma provides a typed client generated from the schema, eliminating raw SQL for simple queries.
- `@prisma/adapter-d1` bridges Prisma's query engine to D1's HTTP-based API.
- Wrangler's local D1 emulation means development requires no external service.
- The schema is intentionally minimal (one model: `ContactSubmission`). If the data model grows significantly, this choice should be re-evaluated.

## Per-Request Client Pattern

D1 bindings are request-scoped by the Workers runtime. A module-level `PrismaClient` singleton would hold a stale binding after the first request. `getPrisma(env.DB)` in `app/db.server.ts` creates a fresh client per request. This is lightweight because D1 is HTTP-backed — there is no connection pool to establish.

## Migration Workflow

`prisma migrate dev` writes to a local SQLite file, which is incompatible with D1's emulation layer. The correct workflow is:

1. `prisma migrate diff` — generates SQL from schema changes
2. `wrangler d1 execute portfolio-db --local --file=-` — applies SQL locally
3. `wrangler d1 execute portfolio-db --file=-` — applies SQL to remote D1

This is wrapped in the `db:migrate:local` and `db:migrate:remote` npm scripts.

## Consequences

- Prisma must be re-generated (`npm run db:generate`) after any schema change and before builds in CI.
- `DATABASE_URL` env var is required by Prisma's generator even though runtime access goes through the D1 adapter — set it to a dummy value or a local SQLite path in `.dev.vars`.
- D1 is SQLite, so PostgreSQL-specific features (arrays, JSON operators, etc.) are unavailable.
