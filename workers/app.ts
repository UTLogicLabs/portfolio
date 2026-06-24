import { createRequestHandler } from "@react-router/cloudflare";
import * as build from "virtual:react-router/server-build";

interface Env {
  portfolio_db: D1Database;
  EMAIL: SendEmail;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_SITE_KEY: string;
}

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const handler = createRequestHandler({ build, mode: process.env.NODE_ENV });

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // createRequestHandler types as PagesFunction; cast to accept this Worker-shaped context
    return (handler as (ctx: unknown) => Promise<Response>)({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
    });
  },
} satisfies ExportedHandler<Env>;
