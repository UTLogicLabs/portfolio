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

function renderSection(
  comments: CommentNode[],
  actionData?: { success?: boolean; errors?: { form?: string }; parentId?: string | null }
) {
  const Stub = createRoutesStub([
    {
      path: "/post",
      Component: () => (
        <CommentSection
          comments={comments}
          turnstileSiteKey="test-site-key"
          actionData={actionData}
        />
      ),
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

  it("shows errors on the root form when actionData.parentId is null", async () => {
    renderSection([], { errors: { form: "Bot check failed." }, parentId: null });
    expect(await screen.findByRole("alert")).toHaveTextContent(/bot check failed/i);
  });

  it("does not show errors on the root form when actionData targets a reply", async () => {
    renderSection([], { errors: { form: "Bot check failed." }, parentId: "some-comment-id" });
    await screen.findByLabelText(/name/i);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
