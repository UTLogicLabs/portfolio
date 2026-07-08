import { data, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import type { AppLoadContext } from "react-router";
import type { ComponentType } from "react";
import type { Route } from "./+types/projects.$slug";
import { getPrisma } from "~/db.server";
import { buildCommentTree } from "~/utils/comments";
import { submitComment, type SubmitCommentResult } from "~/services/comments.server";
import CommentSection from "~/components/CommentSection";
import type { CloudflareEnv } from "~/types/env";

interface ProjectFrontmatter {
  title: string;
  description: string;
  date: string;
  tech: string[];
  url?: string;
  repo?: string;
}

interface ProjectModule {
  frontmatter: ProjectFrontmatter;
  default: ComponentType;
}

export async function loader({
  params,
  context,
}: {
  params: { slug: string };
  context?: AppLoadContext;
}) {
  const modules = import.meta.glob<ProjectModule>("../../content/projects/*.mdx");
  const mod = modules[`../../content/projects/${params.slug}.mdx`];

  if (!mod) {
    throw data("Project not found", { status: 404 });
  }

  const resolved = await mod();

  const { cloudflare } = (context ?? {}) as { cloudflare?: { env: CloudflareEnv } };
  let comments: ReturnType<typeof buildCommentTree> = [];
  let turnstileSiteKey = "";
  if (cloudflare) {
    const db = getPrisma(cloudflare.env.portfolio_db);
    const rows = await db.comment.findMany({
      where: { targetType: "PROJECT", targetSlug: params.slug, approved: true },
      orderBy: { createdAt: "asc" },
    });
    comments = buildCommentTree(rows);
    turnstileSiteKey = cloudflare.env.TURNSTILE_SITE_KEY;
  }

  return { frontmatter: resolved.frontmatter, slug: params.slug, comments, turnstileSiteKey };
}

export async function action({ request, params, context }: ActionFunctionArgs & { context: AppLoadContext }) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv } };
  const formData = await request.formData();

  const result = await submitComment(
    {
      targetType: "PROJECT",
      targetSlug: params.slug!,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      body: String(formData.get("body") ?? ""),
      parentId: formData.get("parentId") ? String(formData.get("parentId")) : null,
      turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
    },
    cloudflare.env
  );

  return data<SubmitCommentResult>(result, { status: result.errors ? 422 : 200 });
}

export const meta: Route.MetaFunction = ({ data: loaderData }) => {
  if (!loaderData) return [{ title: "Not Found" }];
  return [
    { title: `${loaderData.frontmatter.title} — UTLogicLabs` },
    { name: "description", content: loaderData.frontmatter.description },
  ];
};

export default function ProjectDetail({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { frontmatter, slug, comments, turnstileSiteKey } = loaderData;
  const actionData = useActionData<SubmitCommentResult>();

  const modules = import.meta.glob<ProjectModule>("../../content/projects/*.mdx", {
    eager: true,
  });
  const mod = modules[`../../content/projects/${slug}.mdx`];
  const Project = mod?.default;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {frontmatter.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {frontmatter.description}
        </p>
        <ul className="flex flex-wrap gap-2 list-none p-0 mb-6">
          {frontmatter.tech.map((t) => (
            <li
              key={t}
              className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          {frontmatter.url && (
            <a
              href={frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Live Site →
            </a>
          )}
          {frontmatter.repo && (
            <a
              href={frontmatter.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              GitHub →
            </a>
          )}
        </div>
      </header>
      <article className="prose prose-neutral max-w-none">
        {Project && <Project />}
      </article>
      <CommentSection comments={comments} turnstileSiteKey={turnstileSiteKey} actionData={actionData} />
    </main>
  );
}
