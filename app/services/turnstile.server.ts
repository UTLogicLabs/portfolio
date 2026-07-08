export async function verifyTurnstile(token: string, secret: string | undefined): Promise<boolean> {
  // Skip Turnstile when no secret is configured (local dev / CI).
  // Production always has the secret set via `wrangler secret put`.
  if (!secret) return true;

  try {
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    const verifyData = (await verifyRes.json()) as { success: boolean; "error-codes"?: string[] };
    if (!verifyData.success) {
      console.error("[turnstile] siteverify failed", verifyData["error-codes"]);
    }
    return verifyData.success;
  } catch {
    // Network error calling siteverify — fail open to avoid blocking real users
    return true;
  }
}
