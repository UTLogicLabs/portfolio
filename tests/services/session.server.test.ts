import { describe, it, expect, vi, afterEach } from "vitest";
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

describe("session.server", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("round-trips a session: commit then read back the same data", async () => {
    const { getSession, commitSession } = await getSessionStorage(makeEnv());
    const session = await getSession(null);
    session.set("role", "admin");
    const cookieHeader = await commitSession(session);

    const readBack = await getSession(cookieHeader);
    expect(readBack.get("role")).toBe("admin");
  });

  it("returns an empty session for a missing cookie header", async () => {
    const { getSession } = await getSessionStorage(makeEnv());
    const session = await getSession(null);
    expect(session.get("role")).toBeUndefined();
  });

  it("rejects a cookie signed with a different secret", async () => {
    const { getSession, commitSession } = await getSessionStorage(makeEnv({ SESSION_SECRET: "secret-a" }));
    const session = await getSession(null);
    session.set("role", "admin");
    const cookieHeader = await commitSession(session);

    const { getSession: getSessionOtherSecret } = await getSessionStorage(makeEnv({ SESSION_SECRET: "secret-b" }));
    const tamperedSession = await getSessionOtherSecret(cookieHeader);
    expect(tamperedSession.get("role")).toBeUndefined();
  });

  it("sets the Secure attribute on the session cookie by default", async () => {
    const { getSession, commitSession } = await getSessionStorage(makeEnv());
    const session = await getSession(null);
    session.set("role", "admin");
    const cookieHeader = await commitSession(session);
    expect(cookieHeader).toContain("Secure");
  });

  it("omits the Secure attribute on the session cookie when ENVIRONMENT is development", async () => {
    const { getSession, commitSession } = await getSessionStorage(makeEnv({ ENVIRONMENT: "development" }));
    const session = await getSession(null);
    session.set("role", "admin");
    const cookieHeader = await commitSession(session);
    expect(cookieHeader).not.toContain("Secure");
  });

  it("destroySession clears the session data", async () => {
    const { getSession, commitSession, destroySession } = await getSessionStorage(makeEnv());
    const session = await getSession(null);
    session.set("role", "admin");
    const cookieHeader = await commitSession(session);
    const loaded = await getSession(cookieHeader);

    const destroyedHeader = await destroySession(loaded);
    const { getSession: reload } = await getSessionStorage(makeEnv());
    const reloaded = await reload(destroyedHeader);
    expect(reloaded.get("role")).toBeUndefined();
  });

  it("sets a 12-hour Max-Age on the session cookie", async () => {
    const { getSession, commitSession } = await getSessionStorage(makeEnv());
    const session = await getSession(null);
    session.set("role", "admin");
    const cookieHeader = await commitSession(session);
    expect(cookieHeader).toContain(`Max-Age=${60 * 60 * 12}`);
  });

  it("rotates the effective signing secret every 12 hours, invalidating old sessions", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const { getSession, commitSession } = await getSessionStorage(makeEnv());
    const session = await getSession(null);
    session.set("role", "admin");
    const cookieHeader = await commitSession(session);

    vi.setSystemTime(new Date("2026-01-01T11:00:00Z"));
    const { getSession: getSessionLater } = await getSessionStorage(makeEnv());
    expect((await getSessionLater(cookieHeader)).get("role")).toBe("admin");

    vi.setSystemTime(new Date("2026-01-02T13:00:00Z"));
    const { getSession: getSessionMuchLater } = await getSessionStorage(makeEnv());
    expect((await getSessionMuchLater(cookieHeader)).get("role")).toBeUndefined();
  });
});
