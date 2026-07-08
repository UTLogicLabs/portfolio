import { redirect } from "react-router";
import { getSessionStorage } from "~/services/session.server";
import type { CloudflareEnv } from "~/types/env";

export async function requireAdmin(request: Request, env: CloudflareEnv): Promise<void> {
  // Fail closed: an unconfigured secret must never be treated as "authenticated".
  if (!env.SESSION_SECRET) {
    throw redirect("/admin/login");
  }

  const { getSession } = getSessionStorage(env);
  const session = await getSession(request.headers.get("Cookie"));

  if (session.get("role") !== "admin") {
    throw redirect("/admin/login");
  }
}

export async function isAdmin(request: Request, env: CloudflareEnv): Promise<boolean> {
  if (!env.SESSION_SECRET) return false;
  const { getSession } = getSessionStorage(env);
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("role") === "admin";
}
