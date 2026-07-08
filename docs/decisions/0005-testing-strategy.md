# ADR-0005 — Testing Strategy

**Status:** Accepted  
**Date:** 2026-06-21

## Context

The project requires tests at every level: unit, component, integration, and E2E. The test infrastructure must integrate with the Vite/React Router build and run in CI.

## Decision

- **E2E:** Playwright, tests in `e2e/`, run against the dev server
- **Unit / component / integration:** Vitest + React Testing Library, tests in `tests/`
- **Convention:** every code change ships with corresponding tests

## Rationale

### Playwright for E2E

- Playwright's `webServer` config in `playwright.config.ts` starts the dev server automatically — no manual process management.
- `reuseExistingServer: !process.env.CI` makes local iteration fast (reuse a running dev server) while CI always starts fresh.
- Chromium-only for now — acceptable for a portfolio site.

### Vitest for unit/component tests

- Vitest uses Vite's module graph, so it can import the same `.ts`/`.tsx` modules the app uses without a separate build step.
- jsdom environment enables DOM assertions without a browser.
- `@testing-library/react` + `@testing-library/jest-dom` provide accessible query APIs and readable DOM matchers.

### `createRoutesStub` for component tests

React Router v7 exports `createRoutesStub` specifically for testing components that use framework hooks (`useFetcher`, `useLoaderData`, `useNavigate`, etc.) without spinning up a full router. This is preferred over `<MemoryRouter>` (which is the lower-level React Router API and misses framework-mode context) and over full integration tests for component-level concerns.

### Test Layout

```
tests/
  setup.ts              — @testing-library/jest-dom import
  components/           — component tests (RTL)
  routes/               — route action/loader unit tests + component tests
e2e/
  *.spec.ts             — Playwright specs
```

## Consequences

- Vitest cannot run Cloudflare Workers runtime code directly (no D1 in jsdom). Route actions that touch D1 are tested by mocking the `context` argument with a duck-typed object.
- E2E tests for the contact form require a running dev server with a local D1 database initialized. The CI workflow runs `db:migrate:apply:local` before starting the server.
- New routes or components must include tests before merging — enforced by code review, not tooling.
