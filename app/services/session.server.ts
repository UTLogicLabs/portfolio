import { createCookieSessionStorage } from "react-router";
import type { CloudflareEnv } from "~/types/env";

interface SessionData {
  role: "admin";
}

const ROTATION_WINDOW_MS = 1000 * 60 * 60 * 12;

async function deriveSecret(baseSecret: string, bucket: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(baseSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(bucket)));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getSessionStorage(env: CloudflareEnv) {
  const base = env.SESSION_SECRET;
  const currentBucket = Math.floor(Date.now() / ROTATION_WINDOW_MS);
  const secrets = base
    ? await Promise.all([currentBucket, currentBucket - 1].map((b) => deriveSecret(base, b)))
    : [""];

  return createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      secrets,
      secure: env.ENVIRONMENT !== "development",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    },
  });
}
