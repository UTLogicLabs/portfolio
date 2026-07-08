-- Migration number: 0002 	 2026-07-08T05:48:12.271Z
-- Baseline: reflects the Comment table already live in production.
-- Recorded here (without being re-applied) so Wrangler's migration tracking
-- has an accurate history to diff future schema changes against.
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetType" TEXT NOT NULL,
    "targetSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Comment_targetType_targetSlug_approved_idx" ON "Comment"("targetType", "targetSlug", "approved");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");
