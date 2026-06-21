# ADR-0003 — MDX Content in the Repository

**Status:** Accepted  
**Date:** 2026-06-21

## Context

Blog posts and project write-ups need to be authored and served somewhere. Options: headless CMS (Contentful, Sanity), database (D1), markdown/MDX files in the repo.

## Decision

Store blog and project content as **MDX files in the repository** under `content/`.

## Rationale

- Content is versioned alongside code — a post and the feature it describes ship in the same commit.
- No CMS subscription, no API key rotation, no outage dependency.
- MDX allows React components inside markdown — useful for code demos, interactive diagrams, callout boxes.
- `import.meta.glob` makes it trivial to build a typed list of all posts at build time without a database query.
- For a personal portfolio with a low post volume, the simplicity outweighs CMS benefits (real-time editing, non-technical authors, rich media management).

## Package Choice: `@mdx-js/rollup`

`vite-plugin-mdx` (by brillout) is unmaintained and has known SSR transform failures with React Router v7. `@mdx-js/rollup` is the official Rollup plugin from the MDX team, actively maintained, and compatible with Vite's Rollup internals.

## Frontmatter

`remark-frontmatter` + `remark-mdx-frontmatter` parse YAML frontmatter and export it as a named `frontmatter` export from each MDX module. List pages use this export to build post/project indexes without loading the full render component.

## Consequences

- Adding a post requires a code deployment. This is acceptable for a personal site.
- If a non-technical collaborator needs to author content, a CMS should be reconsidered.
- All MDX files must include valid frontmatter (`title`, `date`, `description` at minimum) or the list routes will produce incomplete data.
