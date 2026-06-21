# Portfolio — Claude Code Guidelines

## Testing Policy

Every change to `app/` must be covered by a test. There are no exceptions.

- **New component or function** → add a test covering its behavior
- **Bug fix** → add a regression test that would have caught the bug
- **Changed behavior** → update the existing test(s)
- **Deleted code** → remove or update the tests that covered it

### Test structure

Unit tests live in `tests/` and mirror the `app/` directory tree:

| Source file | Test file |
|---|---|
| `app/routes/contact.tsx` | `tests/routes/contact.test.tsx` |
| `app/components/Icon.tsx` | `tests/components/Icon.test.tsx` |

E2E tests live in `e2e/` and cover full user flows (one spec file per route group).

### Commands

| Purpose | Command |
|---|---|
| Run unit tests | `npm test` |
| Run with coverage | `npm run test:coverage` |
| Watch mode | `npm run test:watch` |
| Run E2E tests | `npm run test:e2e` |

### Before finishing any task

Run `npm test` and confirm all tests pass. The Stop hook enforces this automatically — it runs `npm test` whenever `app/` or `tests/` have changed and blocks completion if any test fails.

E2E tests are not run by the hook (they require a live dev server). Run `npm run test:e2e` manually when modifying route-level behavior or layouts.
