import { describe, it, expect } from "vitest";
import { buildCommentTree } from "~/utils/comments";
import type { Comment } from "@prisma/client";

function makeComment(overrides: Partial<Comment>): Comment {
  return {
    id: "id",
    targetType: "BLOG_POST",
    targetSlug: "hello-world",
    name: "Name",
    email: "name@example.com",
    body: "Body",
    approved: true,
    parentId: null,
    createdAt: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("buildCommentTree", () => {
  it("returns an empty array for no comments", () => {
    expect(buildCommentTree([])).toEqual([]);
  });

  it("returns all comments as roots when none have a parent", () => {
    const comments = [
      makeComment({ id: "a" }),
      makeComment({ id: "b" }),
    ];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(2);
    expect(tree.map((c) => c.id).sort()).toEqual(["a", "b"]);
    expect(tree[0].replies).toEqual([]);
  });

  it("nests a reply under its parent", () => {
    const comments = [
      makeComment({ id: "parent" }),
      makeComment({ id: "child", parentId: "parent" }),
    ];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe("parent");
    expect(tree[0].replies).toHaveLength(1);
    expect(tree[0].replies[0].id).toBe("child");
  });

  it("nests multiple levels deep", () => {
    const comments = [
      makeComment({ id: "a" }),
      makeComment({ id: "b", parentId: "a" }),
      makeComment({ id: "c", parentId: "b" }),
    ];
    const tree = buildCommentTree(comments);
    expect(tree[0].id).toBe("a");
    expect(tree[0].replies[0].id).toBe("b");
    expect(tree[0].replies[0].replies[0].id).toBe("c");
  });

  it("treats a comment with a missing/orphaned parentId as a root", () => {
    const comments = [makeComment({ id: "orphan", parentId: "does-not-exist" })];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe("orphan");
  });
});
