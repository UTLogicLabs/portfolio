import { useEffect, useRef, useState } from "react";
import { data, Form, useActionData, useLoaderData, useNavigation } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import type { AppLoadContext } from "react-router";
import { Resend } from "resend";
import { getPrisma } from "~/db.server";

export const meta: MetaFunction = () => [
  { title: "Contact — UTLogicLabs" },
  { name: "description", content: "Get in touch with UTLogicLabs." },
];

interface ActionData {
  success?: boolean;
  errors?: {
    name?: string;
    email?: string;
    message?: string;
    form?: string;
  };
}

type TurnstileInstance = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': (errorCode: string) => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

type CloudflareEnv = {
  portfolio_db: D1Database;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv } };
  return { turnstileSiteKey: cloudflare.env.TURNSTILE_SITE_KEY };
}

export async function action({ request, context }: ActionFunctionArgs & { context: AppLoadContext }) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv; ctx: ExecutionContext } };
  const formData = await request.formData();

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  const turnstileSecret = cloudflare.env.TURNSTILE_SECRET_KEY;
  // Skip Turnstile when no secret is configured (local dev / CI).
  // Production always has the secret set via `wrangler secret put`.
  let turnstilePassed = !turnstileSecret;
  if (turnstileSecret) {
    try {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
      });
      const verifyData = await verifyRes.json() as { success: boolean; "error-codes"?: string[] };
      turnstilePassed = verifyData.success;
      if (!verifyData.success) {
        console.error("[turnstile] siteverify failed", verifyData["error-codes"]);
      }
    } catch {
      // Network error calling siteverify — fail open to avoid blocking real users
      turnstilePassed = true;
    }
  }
  if (!turnstilePassed) {
    return data<ActionData>(
      { errors: { form: "Bot check failed. Please try again." } },
      { status: 422 }
    );
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: ActionData["errors"] = {};
  if (!name) errors.name = "Name is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "A valid email address is required.";
  if (!message || message.length < 10)
    errors.message = "Message must be at least 10 characters.";

  if (Object.keys(errors).length > 0) {
    return data<ActionData>({ errors }, { status: 422 });
  }

  const db = getPrisma(cloudflare.env.portfolio_db);
  await db.contactSubmission.create({ data: { name, email, message } });

  if (cloudflare.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(cloudflare.env.RESEND_API_KEY);
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message);
      await resend.emails.send({
        from: "Portfolio Contact Form <contact@utlogiclabs.com>",
        to: "joshua.dix@utlogiclabs.com",
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p><p>${safeMessage}</p>`,
      });
    } catch (err) {
      console.error("[resend] failed to send contact notification email", err);
    }
  }

  return data<ActionData>({ success: true });
}

export default function Contact() {
  const loaderData = useLoaderData<typeof loader>();
  const turnstileSiteKey = loaderData?.turnstileSiteKey ?? "";
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    const w = window as unknown as { turnstile?: TurnstileInstance };
    const renderWidget = () => {
      if (!turnstileRef.current) return;
      widgetIdRef.current = w.turnstile?.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: () => { setTurnstileReady(true); setTurnstileError(null); },
        'expired-callback': () => setTurnstileReady(false),
        'error-callback': (errorCode: string) => {
          console.error("[turnstile] widget error", errorCode);
          setTurnstileError("Bot verification failed. Please refresh the page and try again.");
        },
      });
    };

    if (w.turnstile) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current !== undefined) {
        (window as unknown as { turnstile?: TurnstileInstance }).turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [turnstileSiteKey]);

  useEffect(() => {
    if (actionData?.errors?.form && widgetIdRef.current !== undefined) {
      (window as unknown as { turnstile?: TurnstileInstance }).turnstile?.reset(widgetIdRef.current);
      setTurnstileReady(false);
    }
  }, [actionData?.errors?.form]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
      <p className="text-muted-foreground mb-10">
        Have a project in mind or just want to say hi? Fill out the form and
        I&apos;ll get back to you.
      </p>

      {actionData?.success ? (
        <div
          role="status"
          className="bg-muted border border-border rounded-xl p-6 text-center"
        >
          <p className="font-semibold text-lg mb-2">Message sent!</p>
          <p className="text-muted-foreground">
            Thanks for reaching out. I&apos;ll reply as soon as I can.
          </p>
        </div>
      ) : (
        <Form method="post" className="space-y-6" noValidate>
          {actionData?.errors?.form && (
            <p role="alert" className="text-red-500 text-sm">
              {actionData.errors.form}
            </p>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-describedby={actionData?.errors?.name ? "name-error" : undefined}
              className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            {actionData?.errors?.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {actionData.errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-describedby={actionData?.errors?.email ? "email-error" : undefined}
              className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            {actionData?.errors?.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {actionData.errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1.5"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              aria-describedby={
                actionData?.errors?.message ? "message-error" : undefined
              }
              className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y"
            />
            {actionData?.errors?.message && (
              <p id="message-error" className="text-red-500 text-sm mt-1">
                {actionData.errors.message}
              </p>
            )}
          </div>

          {!!turnstileSiteKey && (
            <div
              ref={turnstileRef}
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
            />
          )}
          {turnstileError && (
            <p role="alert" className="text-red-500 text-sm">
              {turnstileError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !turnstileReady}
            className="w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>
        </Form>
      )}
    </main>
  );
}
