import type { MetaFunction } from "react-router";
import ContentCard from "~/components/ContentCard";
import { readTime } from "~/utils/readTime";

export const meta: MetaFunction = () => [
  { title: "Blog — UTLogicLabs" },
  { name: "description", content: "Writing on software, craft, and things I'm figuring out." },
];

interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

interface PostModule {
  frontmatter: PostFrontmatter;
  wordCount: number;
}

export async function loader() {
  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx", {
    eager: true,
  });

  const posts = Object.entries(modules)
    .map(([path, mod]) => {
      const slug = path.split("/").at(-1)!.replace(/\.mdx$/, "");
      return { slug, ...mod.frontmatter, readTime: readTime(mod.wordCount ?? 0) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts };
}

export default function BlogIndex({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { posts } = loaderData;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight mb-12">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <ol className="space-y-10 list-none p-0">
          {posts.map((post) => (
            <li key={post.slug}>
              <ContentCard
                to={`/blog/${post.slug}`}
                title={post.title}
                description={post.description}
                date={post.date}
                readTime={post.readTime}
              />
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
