import { createCookieSessionStorage } from "react-router";
import type { CloudflareEnv } from "~/types/env";

interface SessionData {
  role: "admin";
}

export function getSessionStorage(env: CloudflareEnv) {
  return createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      secrets: [env.SESSION_SECRET ?? ""],
      secure: env.ENVIRONMENT !== "development",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  });
}
