import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import CommentSection from "~/components/CommentSection";
import type { CommentNode } from "~/utils/comments";

function makeNode(overrides: Partial<CommentNode> = {}): CommentNode {
  return {
    id: "1",
    targetType: "BLOG_POST",
    targetSlug: "hello-world",
    name: "Josh",
    email: "josh@example.com",
    body: "Great post!",
    approved: true,
    parentId: null,
    createdAt: new Date("2026-06-21T12:00:00.000Z"),
    replies: [],
    ...overrides,
  };
}

function renderSection(comments: CommentNode[]) {
  const Stub = createRoutesStub([
    {
      path: "/post",
      Component: () => <CommentSection comments={comments} turnstileSiteKey="test-site-key" />,
    },
  ]);
  return render(<Stub initialEntries={["/post"]} />);
}

describe("CommentSection", () => {
  it("shows an empty state when there are no comments", async () => {
    renderSection([]);
    expect(await screen.findByText(/no comments yet/i)).toBeInTheDocument();
  });

  it("renders top-level comments via CommentThread", async () => {
    renderSection([makeNode()]);
    expect(await screen.findByText("Josh")).toBeInTheDocument();
    expect(screen.getByText("Great post!")).toBeInTheDocument();
  });

  it("always renders a top-level comment form", async () => {
    renderSection([]);
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /post comment/i })).toBeInTheDocument();
  });
});
