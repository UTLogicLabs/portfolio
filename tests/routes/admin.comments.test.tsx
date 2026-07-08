import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import AdminComments, { loader, action, meta } from "~/routes/admin.comments";
import { getSessionStorage } from "~/services/session.server";

const mockFindMany = vi.fn();
const mockUpdate = vi.fn().mockResolvedValue({});
const mockDelete = vi.fn().mockResolvedValue({});
vi.mock("~/db.server", () => ({
  getPrisma: vi.fn(() => ({
    comment: { findMany: mockFindMany, update: mockUpdate, delete: mockDelete },
  })),
}));

const BASE_ENV = {
  portfolio_db: {} as D1Database,
  TURNSTILE_SITE_KEY: "test-site-key",
  ADMIN_PASSWORD: "correct-password",
  SESSION_SECRET: "test-secret",
};

async function makeAuthenticatedRequest(url: string, init?: RequestInit) {
  const { getSession, commitSession } = getSessionStorage(BASE_ENV);
  const session = await getSession(null);
  session.set("role", "admin");
  const cookie = await commitSession(session);
  return new Request(url, { ...init, headers: { ...init?.headers, Cookie: cookie } });
}

function makeContext(overrides: Record<string, unknown> = {}) {
  return { cloudflare: { env: { ...BASE_ENV, ...overrides } } };
}

describe("admin.comments meta", () => {
  it("returns the page title", () => {
    expect(meta({} as never)).toContainEqual({ title: "Pending Comments — UTLogicLabs" });
  });
});

describe("admin.comments loader", () => {
  beforeEach(() => {
    mockFindMany.mockReset().mockResolvedValue([]);
  });

  it("redirects to /admin/login when unauthenticated", async () => {
    const request = new Request("http://localhost/admin/comments");
    await expect(
      loader({ request, context: makeContext() as never, params: {} } as never)
    ).rejects.toMatchObject({ status: 302 });
  });

  it("returns only unapproved comments when authenticated", async () => {
    mockFindMany.mockResolvedValue([{ id: "1", approved: false }]);
    const request = await makeAuthenticatedRequest("http://localhost/admin/comments");
    const result = await loader({ request, context: makeContext() as never, params: {} } as never);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { approved: false } })
    );
    expect(result.pending).toEqual([{ id: "1", approved: false }]);
  });
});

describe("admin.comments action", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockDelete.mockClear();
  });

  it("redirects to /admin/login when unauthenticated", async () => {
    const formData = new FormData();
    formData.set("intent", "approve");
    formData.set("commentId", "1");
    const request = new Request("http://localhost/admin/comments", { method: "POST", body: formData });
    await expect(
      action({ request, context: makeContext() as never, params: {} } as never)
    ).rejects.toMatchObject({ status: 302 });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("approves a comment", async () => {
    const formData = new FormData();
    formData.set("intent", "approve");
    formData.set("commentId", "1");
    const request = await makeAuthenticatedRequest("http://localhost/admin/comments", {
      method: "POST",
      body: formData,
    });
    await action({ request, context: makeContext() as never, params: {} } as never);
    expect(mockUpdate).toHaveBeenCalledWith({ where: { id: "1" }, data: { approved: true } });
  });

  it("rejects (deletes) a comment", async () => {
    const formData = new FormData();
    formData.set("intent", "reject");
    formData.set("commentId", "1");
    const request = await makeAuthenticatedRequest("http://localhost/admin/comments", {
      method: "POST",
      body: formData,
    });
    await action({ request, context: makeContext() as never, params: {} } as never);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  it("returns 400 for an unknown intent and does not touch the DB", async () => {
    const formData = new FormData();
    formData.set("intent", "delete-everything");
    formData.set("commentId", "1");
    const request = await makeAuthenticatedRequest("http://localhost/admin/comments", {
      method: "POST",
      body: formData,
    });
    const result = (await action({ request, context: makeContext() as never, params: {} } as never)) as {
      data: { error: string };
      init: { status: number };
    };
    expect(result.init.status).toBe(400);
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns 400 when intent is missing", async () => {
    const formData = new FormData();
    formData.set("commentId", "1");
    const request = await makeAuthenticatedRequest("http://localhost/admin/comments", {
      method: "POST",
      body: formData,
    });
    const result = (await action({ request, context: makeContext() as never, params: {} } as never)) as {
      data: { error: string };
      init: { status: number };
    };
    expect(result.init.status).toBe(400);
  });

  it("returns 400 when commentId is empty", async () => {
    const formData = new FormData();
    formData.set("intent", "approve");
    const request = await makeAuthenticatedRequest("http://localhost/admin/comments", {
      method: "POST",
      body: formData,
    });
    const result = (await action({ request, context: makeContext() as never, params: {} } as never)) as {
      data: { error: string };
      init: { status: number };
    };
    expect(result.init.status).toBe(400);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe("AdminComments component", () => {
  it("shows an empty state when there are no pending comments", async () => {
    const Stub = createRoutesStub([
      { path: "/admin/comments", Component: AdminComments, loader: async () => ({ pending: [] }) },
    ]);
    render(<Stub initialEntries={["/admin/comments"]} />);
    expect(await screen.findByText(/no comments awaiting approval/i)).toBeInTheDocument();
  });

  it("renders a pending comment with target, name, and body", async () => {
    const Stub = createRoutesStub([
      {
        path: "/admin/comments",
        Component: AdminComments,
        loader: async () => ({
          pending: [
            {
              id: "1",
              targetType: "BLOG_POST",
              targetSlug: "hello-world",
              name: "Josh",
              email: "josh@example.com",
              body: "Nice post!",
            },
          ],
        }),
      },
    ]);
    const { container } = render(<Stub initialEntries={["/admin/comments"]} />);
    expect(await screen.findByText("hello-world")).toBeInTheDocument();
    expect(container.querySelector("li")!.textContent).toContain("Josh");
    expect(container.querySelector("li")!.textContent).toContain("josh@example.com");
    expect(screen.getByText("Nice post!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });

  it("submits the approve action when the Approve button is clicked", async () => {
    const actionFn = vi.fn().mockResolvedValue({ success: true });
    const Stub = createRoutesStub([
      {
        path: "/admin/comments",
        Component: AdminComments,
        loader: async () => ({
          pending: [
            { id: "1", targetType: "PROJECT", targetSlug: "shelfie", name: "A", email: "a@a.com", body: "B" },
          ],
        }),
        action: actionFn,
      },
    ]);
    render(<Stub initialEntries={["/admin/comments"]} />);
    await userEvent.click(await screen.findByRole("button", { name: /approve/i }));
    expect(actionFn).toHaveBeenCalled();
  });
});
