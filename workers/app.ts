import { createRequestHandler } from "@react-router/cloudflare";
// @ts-expect-error - virtual module provided by @react-router/dev in dev, build artifact in prod
import * as build from "virtual:react-router/server-build";

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
    return handler({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
    });
  },
} satisfies ExportedHandler<Env>;
