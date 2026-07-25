import { describe, it, expect } from "vitest";
import { requireAdmin, isAdmin } from "~/services/auth.server";
import { getSessionStorage } from "~/services/session.server";
import type { CloudflareEnv } from "~/types/env";

function makeEnv(overrides: Partial<CloudflareEnv> = {}): CloudflareEnv {
  return {
    portfolio_db: {} as D1Database,
    TURNSTILE_SITE_KEY: "site-key",
    SESSION_SECRET: "test-secret",
    ...overrides,
  };
}

async function adminCookie(env: CloudflareEnv) {
  const { getSession, commitSession } = await getSessionStorage(env);
  const session = await getSession(null);
  session.set("role", "admin");
  return commitSession(session);
}

function requestWithCookie(cookie?: string) {
  return new Request("http://localhost/admin/comments", {
    headers: cookie ? { Cookie: cookie } : {},
  });
}

describe("requireAdmin", () => {
  it("resolves without throwing for a valid admin session", async () => {
    const env = makeEnv();
    const cookie = await adminCookie(env);
    await expect(requireAdmin(requestWithCookie(cookie), env)).resolves.toBeUndefined();
  });

  it("throws a redirect to /admin/login when no cookie is present", async () => {
    const env = makeEnv();
    await expect(requireAdmin(requestWithCookie(), env)).rejects.toMatchObject({
      status: 302,
      headers: expect.any(Headers),
    });
    try {
      await requireAdmin(requestWithCookie(), env);
    } catch (err) {
      expect((err as Response).headers.get("Location")).toBe("/admin/login");
    }
  });

  it("throws a redirect when SESSION_SECRET is not configured, even with a cookie", async () => {
    const env = makeEnv({ SESSION_SECRET: "test-secret" });
    const cookie = await adminCookie(env);
    const envWithoutSecret = makeEnv({ SESSION_SECRET: undefined });
    await expect(requireAdmin(requestWithCookie(cookie), envWithoutSecret)).rejects.toMatchObject({
      status: 302,
    });
  });

  it("throws a redirect for a tampered/invalid cookie", async () => {
    const env = makeEnv();
    await expect(
      requireAdmin(requestWithCookie("__session=garbage"), env)
    ).rejects.toMatchObject({ status: 302 });
  });
});

describe("isAdmin", () => {
  it("returns true for a valid admin session", async () => {
    const env = makeEnv();
    const cookie = await adminCookie(env);
    expect(await isAdmin(requestWithCookie(cookie), env)).toBe(true);
  });

  it("returns false when there is no session", async () => {
    const env = makeEnv();
    expect(await isAdmin(requestWithCookie(), env)).toBe(false);
  });

  it("returns false when SESSION_SECRET is unset", async () => {
    const env = makeEnv({ SESSION_SECRET: undefined });
    expect(await isAdmin(requestWithCookie(), env)).toBe(false);
  });
});
