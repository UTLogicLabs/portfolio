import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import CommentThread from "~/components/CommentThread";
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

function renderThread(
  comment: CommentNode,
  actionData?: { success?: boolean; errors?: { form?: string }; parentId?: string | null }
) {
  const Stub = createRoutesStub([
    {
      path: "/post",
      Component: () => (
        <CommentThread comment={comment} turnstileSiteKey="test-site-key" actionData={actionData} />
      ),
    },
  ]);
  return render(<Stub initialEntries={["/post"]} />);
}

describe("CommentThread", () => {
  it("renders the comment name, date, and body", async () => {
    renderThread(makeNode());
    expect(await screen.findByText("Josh")).toBeInTheDocument();
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("June 21, 2026")).toBeInTheDocument();
  });

  it("renders nested replies recursively", async () => {
    const comment = makeNode({
      id: "parent",
      replies: [makeNode({ id: "child", name: "Alice", body: "I agree." })],
    });
    renderThread(comment);
    expect(await screen.findByText("Josh")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("I agree.")).toBeInTheDocument();
  });

  it("reveals a reply form when Reply is clicked", async () => {
    renderThread(makeNode());
    await userEvent.click(await screen.findByRole("button", { name: /reply/i }));
    expect(screen.getByRole("button", { name: /post reply/i })).toBeInTheDocument();
  });

  it("hides the reply form again when Cancel is clicked", async () => {
    renderThread(makeNode());
    await userEvent.click(await screen.findByRole("button", { name: /reply/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("button", { name: /post reply/i })).not.toBeInTheDocument();
  });

  it("shows success message only on the reply form matching parentId", async () => {
    renderThread(makeNode({ id: "1" }), { success: true, parentId: "1" });
    await userEvent.click(await screen.findByRole("button", { name: /reply/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/awaiting approval/i);
  });

  it("does not show success on a reply form when actionData targets a different comment", async () => {
    renderThread(makeNode({ id: "1" }), { success: true, parentId: "other-id" });
    await userEvent.click(await screen.findByRole("button", { name: /reply/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
