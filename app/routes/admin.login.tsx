import { data, Form, redirect, useActionData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import type { AppLoadContext } from "react-router";
import { getSessionStorage } from "~/services/session.server";
import { isAdmin } from "~/services/auth.server";
import type { CloudflareEnv } from "~/types/env";

export const meta: MetaFunction = () => [{ title: "Admin Login — UTLogicLabs" }];

interface ActionData {
  error?: string;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv } };
  if (await isAdmin(request, cloudflare.env)) {
    throw redirect("/admin/comments");
  }
  return null;
}

export async function action({ request, context }: ActionFunctionArgs & { context: AppLoadContext }) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv } };
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");

  if (!cloudflare.env.ADMIN_PASSWORD || password !== cloudflare.env.ADMIN_PASSWORD) {
    return data<ActionData>({ error: "Invalid password." }, { status: 401 });
  }

  if (!cloudflare.env.SESSION_SECRET) {
    return data<ActionData>({ error: "Server is not configured for admin login." }, { status: 500 });
  }

  const { getSession, commitSession } = await getSessionStorage(cloudflare.env);
  const session = await getSession(request.headers.get("Cookie"));
  session.set("role", "admin");

  throw redirect("/admin/comments", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function AdminLogin() {
  const actionData = useActionData<ActionData>();

  return (
    <main className="max-w-sm mx-auto px-6 py-16 md:py-24">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Admin Login</h1>
      <Form method="post" className="space-y-6">
        {actionData?.error && (
          <p role="alert" className="text-red-500 text-sm">
            {actionData.error}
          </p>
        )}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Log In
        </button>
      </Form>
    </main>
  );
}
