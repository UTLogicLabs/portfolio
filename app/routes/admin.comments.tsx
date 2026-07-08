import { data, Form } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import type { AppLoadContext } from "react-router";
import { getPrisma } from "~/db.server";
import { requireAdmin } from "~/services/auth.server";
import type { CloudflareEnv } from "~/types/env";

export const meta: MetaFunction = () => [{ title: "Pending Comments — UTLogicLabs" }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv } };
  await requireAdmin(request, cloudflare.env);

  const db = getPrisma(cloudflare.env.portfolio_db);
  const pending = await db.comment.findMany({
    where: { approved: false },
    orderBy: { createdAt: "asc" },
  });

  return { pending };
}

export async function action({ request, context }: ActionFunctionArgs & { context: AppLoadContext }) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv } };
  await requireAdmin(request, cloudflare.env);

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const commentId = String(formData.get("commentId") ?? "");

  const db = getPrisma(cloudflare.env.portfolio_db);

  if (intent === "approve") {
    await db.comment.update({ where: { id: commentId }, data: { approved: true } });
  } else if (intent === "reject") {
    await db.comment.delete({ where: { id: commentId } });
  }

  return data({ success: true });
}

export default function AdminComments({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { pending } = loaderData;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Pending Comments</h1>

      {pending.length === 0 ? (
        <p className="text-muted-foreground">No comments awaiting approval.</p>
      ) : (
        <ul className="space-y-4 list-none p-0">
          {pending.map((comment) => (
            <li
              key={comment.id}
              className="border border-border rounded-xl p-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">
                  {comment.targetType === "BLOG_POST" ? "Blog" : "Project"}
                </span>
                <span>{comment.targetSlug}</span>
              </div>
              <p className="font-semibold">
                {comment.name} <span className="text-muted-foreground font-normal">({comment.email})</span>
              </p>
              <p className="mt-1">{comment.body}</p>
              <div className="flex gap-3 mt-4">
                <Form method="post">
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="intent" value="approve" />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                </Form>
                <Form method="post">
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="intent" value="reject" />
                  <button
                    type="submit"
                    className="border border-red-500 text-red-500 px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
                  >
                    Reject
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
