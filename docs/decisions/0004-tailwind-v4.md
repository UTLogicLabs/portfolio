# ADR-0004 — Tailwind CSS v4

**Status:** Accepted  
**Date:** 2026-06-21

## Context

The site needs a styling solution. Options: Tailwind CSS (v3 or v4), CSS Modules, vanilla CSS, Panda CSS, UnoCSS.

## Decision

Use **Tailwind CSS v4** with the `@tailwindcss/vite` plugin.

## Rationale

- Tailwind v4 uses a CSS-first configuration model — all design tokens are defined in `app/app.css` under `@theme {}`. No `tailwind.config.js` file.
- The `@tailwindcss/vite` plugin is a purpose-built Vite integration that replaces the PostCSS pipeline from v3. Faster, simpler setup.
- Utility-first CSS keeps styling co-located with markup in TSX files, which reduces context-switching.
- v4's `@theme` custom properties interoperate directly with arbitrary CSS — design tokens are actual CSS custom properties available everywhere.

## What Changed vs v3

| v3 | v4 |
|---|---|
| `tailwind.config.js` | `@theme {}` in CSS |
| PostCSS plugin | `@tailwindcss/vite` Vite plugin |
| `@tailwind base/components/utilities` directives | `@import "tailwindcss"` |
| `theme.extend.colors` | `--color-*` in `@theme {}` |

## Consequences

- Tailwind v3 documentation does not apply — all design token customization must use the v4 `@theme {}` syntax.
- Third-party component libraries expecting `tailwind.config.js` may need workarounds or be incompatible.
- PostCSS config (`postcss.config.js`) is not needed and should not be created.
