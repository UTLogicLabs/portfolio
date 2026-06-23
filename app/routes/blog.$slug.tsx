import { data } from "react-router";
import type { ComponentType } from "react";
import type { Route } from "./+types/blog.$slug";

interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

interface PostModule {
  frontmatter: PostFrontmatter;
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
  const { frontmatter, slug } = loaderData;

  // Dynamically render the MDX component
  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx", {
    eager: true,
  });
  const mod = modules[`../../content/blog/${slug}.mdx`];
  const Post = mod?.default;

  return (
    <div>
      <header className="mb-12">
        <time className="text-sm text-muted-foreground">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
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
