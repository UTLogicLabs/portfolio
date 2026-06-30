import { data } from "react-router";
import type { ComponentType } from "react";
import type { Route } from "./+types/blog.$slug";
import { readTime } from "~/utils/readTime";

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

export async function loader({ params }: { params: { slug: string } }) {
  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx");
  const mod = modules[`../../content/blog/${params.slug}.mdx`];

  if (!mod) {
    throw data("Post not found", { status: 404 });
  }

  const resolved = await mod();
  return {
    frontmatter: resolved.frontmatter,
    slug: params.slug,
    readTime: readTime(resolved.wordCount ?? 0),
  };
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
  const { frontmatter, slug, readTime: minutes } = loaderData;

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
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
    </div>
  );
}
