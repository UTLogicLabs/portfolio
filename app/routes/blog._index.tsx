import type { MetaFunction } from "react-router";
import { Link } from "react-router";

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
}

export async function loader() {
  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx", {
    eager: true,
  });

  const posts = Object.entries(modules)
    .map(([path, mod]) => {
      const slug = path.split("/").at(-1)!.replace(/\.mdx$/, "");
      return { slug, ...mod.frontmatter };
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
              <Link
                to={`/blog/${post.slug}`}
                className="group block border border-border rounded-xl p-6 hover:border-primary transition-colors"
              >
                <time className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="text-xl font-semibold mt-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mt-1">{post.description}</p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
