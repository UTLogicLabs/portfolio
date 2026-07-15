import { data, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import type { AppLoadContext } from "react-router";
import type { ComponentType } from "react";
import type { Route } from "./+types/blog.$slug";
import { readTime } from "~/utils/readTime";
import { formatDate } from "~/utils/formatDate";
import { resolvePost } from "~/utils/blogSlug";
import { getPrisma } from "~/db.server";
import { buildCommentTree } from "~/utils/comments";
import { submitComment, type SubmitCommentResult } from "~/services/comments.server";
import CommentSection from "~/components/CommentSection";
import type { CloudflareEnv } from "~/types/env";

interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

interface PostModule {
  frontmatter: PostFrontmatter;
  wordCount: number;
  default: ComponentType;
}

export async function loader({
  params,
  context,
}: {
  params: { slug: string };
  context?: AppLoadContext;
}) {
  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx");
  const resolved = resolvePost(modules, params.slug);

  if (!resolved) {
    throw data("Post not found", { status: 404 });
  }

  const { canonicalSlug, mod } = resolved;
  const post = await mod();

  const { cloudflare } = (context ?? {}) as { cloudflare?: { env: CloudflareEnv } };
  let comments: ReturnType<typeof buildCommentTree> = [];
  let turnstileSiteKey = "";
  if (cloudflare) {
    const db = getPrisma(cloudflare.env.portfolio_db);
    const rows = await db.comment.findMany({
      where: { targetType: "BLOG_POST", targetSlug: canonicalSlug, approved: true },
      orderBy: { createdAt: "asc" },
    });
    comments = buildCommentTree(rows);
    turnstileSiteKey = cloudflare.env.TURNSTILE_SITE_KEY;
  }

  return {
    frontmatter: post.frontmatter,
    slug: canonicalSlug,
    readTime: readTime(post.wordCount ?? 0),
    comments,
    turnstileSiteKey,
  };
}

export async function action({ request, params, context }: ActionFunctionArgs & { context: AppLoadContext }) {
  const { cloudflare } = context as { cloudflare: { env: CloudflareEnv } };
  const formData = await request.formData();

  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx");
  const resolved = resolvePost(modules, params.slug!);
  if (!resolved) {
    throw data("Post not found", { status: 404 });
  }

  const result = await submitComment(
    {
      targetType: "BLOG_POST",
      targetSlug: resolved.canonicalSlug,
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

export default function BlogPost({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { frontmatter, slug, readTime: minutes, comments, turnstileSiteKey } = loaderData;
  const actionData = useActionData<SubmitCommentResult>();

  // Dynamically render the MDX component
  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx", {
    eager: true,
  });
  const mod = modules[`../../content/blog/${slug}.mdx`];
  const Post = mod?.default;

  return (
    <div>
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time>
            {formatDate(frontmatter.date)}
          </time>
          <span>· {minutes} min read</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mt-2 mb-4">
          {frontmatter.title}
        </h1>
        <p className="text-lg text-muted-foreground">{frontmatter.description}</p>
      </header>
      <article className="prose prose-neutral max-w-none">
        {Post && <Post />}
      </article>
      <CommentSection comments={comments} turnstileSiteKey={turnstileSiteKey} actionData={actionData} />
    </div>
  );
}
