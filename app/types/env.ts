export type CloudflareEnv = {
  portfolio_db: D1Database;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
};
