# ADR-0001 — React Router v7 (Framework Mode)

**Status:** Accepted  
**Date:** 2026-06-21

## Context

Needed a React SSR framework for a portfolio site deploying to Cloudflare Pages/Workers. Candidates considered: Next.js, Astro, plain Remix, React Router v7 framework mode.

## Decision

Use **React Router v7 in framework mode**.

## Rationale

- React Router v7 is the direct evolution of Remix — same file-based routing, `loader`/`action` pattern, and SSR model, but distributed as `react-router` rather than a separate package.
- Has a first-class **Cloudflare adapter** (`@react-router/cloudflare`) and a Vite plugin (`@cloudflare/vite-plugin`) that runs actual Workers runtime in development — no prod/dev runtime divergence.
- Next.js has no first-class Cloudflare Workers support without third-party adapters that lag behind Next.js releases.
- Astro is excellent for content sites but less ergonomic for pages with interactive server actions (e.g., the contact form).
- The `loader`/`action` colocation pattern keeps data fetching and mutation logic next to the UI that uses it, which is easier to test and reason about than separate API routes.

## Consequences

- File-based routing conventions must be followed (`app/routes/` directory, filename conventions for nested and index routes).
- React Router generates types in `.react-router/` — this directory should be gitignored but the `tsconfig.json` must reference it via `rootDirs`.
- The `ssr: true` config is required; disabling it would break the contact form action.
