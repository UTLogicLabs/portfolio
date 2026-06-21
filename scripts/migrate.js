#!/usr/bin/env node
/**
 * Runs `prisma migrate diff` and applies the SQL to D1 only when there are
 * actual changes. Wrangler rejects empty/comment-only SQL files, so we check
 * the diff's exit code (0 = empty, 2 = has changes, 1 = error) before
 * invoking wrangler.
 *
 * Usage:
 *   node scripts/migrate.js          # apply to local D1
 *   node scripts/migrate.js --remote # apply to remote D1
 */

import { execSync, spawnSync } from "node:child_process";
import { unlinkSync, existsSync } from "node:fs";

const remote = process.argv.includes("--remote");
const target = remote ? "remote D1" : "local D1";

const diffResult = spawnSync(
  "npx",
  [
    "prisma",
    "migrate",
    "diff",
    "--from-config-datasource",
    "--to-schema",
    "prisma/schema.prisma",
    "--script",
    "--output",
    "migration.sql",
    "--exit-code",
  ],
  { stdio: "inherit" }
);

if (diffResult.status === 0) {
  console.log(`✓ ${target} schema is already up to date — nothing to apply.`);
  if (existsSync("migration.sql")) unlinkSync("migration.sql");
  process.exit(0);
}

if (diffResult.status !== 2) {
  console.error(`✘ prisma migrate diff failed (exit ${diffResult.status}).`);
  if (existsSync("migration.sql")) unlinkSync("migration.sql");
  process.exit(diffResult.status ?? 1);
}

// Exit code 2 = non-empty diff — apply it.
const wranglerArgs = [
  "d1",
  "execute",
  "portfolio-db",
  "--file=migration.sql",
];
if (!remote) wranglerArgs.push("--local");

const applyResult = spawnSync("npx", ["wrangler", ...wranglerArgs], {
  stdio: "inherit",
});

if (existsSync("migration.sql")) unlinkSync("migration.sql");

process.exit(applyResult.status ?? 0);
