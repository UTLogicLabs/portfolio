import { data, Form, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import type { AppLoadContext } from "react-router";
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
  };
}

export async function action({ request, context }: ActionFunctionArgs & { context: AppLoadContext }) {
  const formData = await request.formData();
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

  const { cloudflare } = context as { cloudflare: { env: { portfolio_db: D1Database } } };
  const db = getPrisma(cloudflare.env.portfolio_db);
  await db.contactSubmission.create({ data: { name, email, message } });

  return data<ActionData>({ success: true });
}

export default function Contact() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>
        </Form>
      )}
    </main>
  );
}
