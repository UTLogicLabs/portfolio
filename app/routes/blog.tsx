import { Link, Outlet, useLocation } from "react-router";

interface PostFrontmatter {
  title: string;
  date: string;
}

interface PostModule {
  frontmatter: PostFrontmatter;
}

export async function loader() {
  const modules = import.meta.glob<PostModule>("../../content/blog/*.mdx", {
    eager: true,
  });

  const posts = Object.entries(modules)
    .map(([path, mod]) => ({
      slug: path.split("/").at(-1)!.replace(/\.mdx$/, ""),
      title: mod.frontmatter.title,
      date: mod.frontmatter.date,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts };
}

export default function BlogLayout({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { posts } = loaderData;
  const location = useLocation();
  // The blog index already lists every post in the main column, so the
  // sidebar is only useful for navigating between posts on a detail page.
  const showSidebar = location.pathname !== "/blog";

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12">
        {showSidebar && (
          <aside className="md:w-56 shrink-0">
            <Link
              to="/blog"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <nav aria-label="Blog posts" className="mt-4 space-y-1">
              {posts.map((post) => {
                const isActive = location.pathname === `/blog/${post.slug}`;
                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className={`block text-sm py-1 pr-2 transition-colors truncate ${
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {post.title}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
