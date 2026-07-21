import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import AdminLogin, { loader, action, meta } from "~/routes/admin.login";
import { getSessionStorage } from "~/services/session.server";

function makeContext(overrides: Record<string, unknown> = {}) {
  return {
    cloudflare: {
      env: {
        portfolio_db: {} as D1Database,
        TURNSTILE_SITE_KEY: "test-site-key",
        ADMIN_PASSWORD: "correct-password",
        SESSION_SECRET: "test-secret",
        ...overrides,
      },
    },
  };
}

describe("admin.login meta", () => {
  it("returns the page title", () => {
    expect(meta({} as never)).toContainEqual({ title: "Admin Login — UTLogicLabs" });
  });
});

describe("admin.login loader", () => {
  it("returns null when not authenticated", async () => {
    const request = new Request("http://localhost/admin/login");
    const result = await loader({ request, context: makeContext() as never, params: {} } as never);
    expect(result).toBeNull();
  });

  it("redirects to /admin/comments when already authenticated", async () => {
    const env = makeContext().cloudflare.env;
    const { getSession, commitSession } = await getSessionStorage(env);
    const session = await getSession(null);
    session.set("role", "admin");
    const cookie = await commitSession(session);

    const request = new Request("http://localhost/admin/login", { headers: { Cookie: cookie } });
    await expect(
      loader({ request, context: makeContext() as never, params: {} } as never)
    ).rejects.toMatchObject({ status: 302 });
  });
});

describe("admin.login action", () => {
  function callAction(fields: Record<string, string>, contextOverrides?: Record<string, unknown>) {
    const formData = new FormData();
    for (const [k, v] of Object.entries(fields)) formData.set(k, v);
    const request = new Request("http://localhost/admin/login", { method: "POST", body: formData });
    return action({ request, context: makeContext(contextOverrides) as never, params: {} } as never);
  }

  it("returns 401 with an error for the wrong password", async () => {
    const result = (await callAction({ password: "wrong" })) as { data: { error: string }; init: { status: number } };
    expect(result.data.error).toBeTruthy();
    expect(result.init.status).toBe(401);
  });

  it("returns 401 when ADMIN_PASSWORD is not configured", async () => {
    const result = (await callAction({ password: "anything" }, { ADMIN_PASSWORD: undefined })) as {
      data: { error: string };
      init: { status: number };
    };
    expect(result.init.status).toBe(401);
  });

  it("returns 500 and does not set a cookie when SESSION_SECRET is not configured", async () => {
    const result = (await callAction(
      { password: "correct-password" },
      { SESSION_SECRET: undefined }
    )) as { data: { error: string }; init: { status: number } };
    expect(result.init.status).toBe(500);
    expect(result.data.error).toBeTruthy();
  });

  it("redirects to /admin/comments with a Set-Cookie header on correct password", async () => {
    try {
      await callAction({ password: "correct-password" });
      throw new Error("expected a redirect to be thrown");
    } catch (err) {
      const response = err as Response;
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe("/admin/comments");
      expect(response.headers.get("Set-Cookie")).toBeTruthy();
    }
  });
});

describe("AdminLogin component", () => {
  function makeStub(actionFn?: () => unknown) {
    return createRoutesStub([
      {
        path: "/admin/login",
        Component: AdminLogin,
        ...(actionFn ? { action: actionFn } : {}),
      },
    ]);
  }

  it("renders the password field and submit button", async () => {
    const Stub = makeStub();
    render(<Stub initialEntries={["/admin/login"]} />);
    expect(await screen.findByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows the error returned by the action", async () => {
    const Stub = makeStub(async () => ({ error: "Invalid password." }));
    render(<Stub initialEntries={["/admin/login"]} />);
    await userEvent.type(await screen.findByLabelText(/password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid password.");
  });
});
