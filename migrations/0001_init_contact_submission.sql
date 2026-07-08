-- Migration number: 0001 	 2026-07-08T05:48:10.130Z
-- Baseline: reflects the ContactSubmission table already live in production.
-- Recorded here (without being re-applied) so Wrangler's migration tracking
-- has an accurate history to diff future schema changes against.
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
