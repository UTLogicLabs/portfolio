import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import ContentCard from "~/components/ContentCard";

export const meta: MetaFunction = () => [
  { title: "UTLogicLabs" },
  {
    name: "description",
    content:
      "UTLogicLabs — software engineering, thoughtful products, and writing on craft.",
  },
];

interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  featured?: boolean;
}

interface ProjectFrontmatter {
  title: string;
  description: string;
  date: string;
  tech: string[];
  url?: string;
  repo?: string;
  featured?: boolean;
}

export async function loader() {
  const projectModules = import.meta.glob<{ frontmatter: ProjectFrontmatter }>(
    "../../content/projects/*.mdx",
    { eager: true }
  );
  const postModules = import.meta.glob<{ frontmatter: PostFrontmatter }>(
    "../../content/blog/*.mdx",
    { eager: true }
  );

  const featuredProjects = Object.entries(projectModules)
    .map(([path, mod]) => ({
      slug: path.split("/").at(-1)!.replace(/\.mdx$/, ""),
      ...mod.frontmatter,
    }))
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredPosts = Object.entries(postModules)
    .map(([path, mod]) => ({
      slug: path.split("/").at(-1)!.replace(/\.mdx$/, ""),
      ...mod.frontmatter,
    }))
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { featuredProjects, featuredPosts };
}

export default function Home({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { featuredProjects = [], featuredPosts = [] } = loaderData ?? {};

  return (
    <main className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-40">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <img
            src="/avatar.png"
            alt="Joshua Dix"
            className="w-48 h-48 rounded-full object-cover shrink-0 shadow-md"
          />
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Hi, I&apos;m Joshua.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              I&apos;m a software engineer who builds thoughtful products. I write
              about code, craft, and the things I&apos;m figuring out along the way.
            </p>
            <nav className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View Projects
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Read Blog
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Get in Touch
              </Link>
            </nav>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Projects</h2>
          <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
            {featuredProjects.map((project) => (
              <li key={project.slug}>
                <ContentCard
                  to={`/projects/${project.slug}`}
                  title={project.title}
                  description={project.description}
                  tags={project.tech}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {featuredPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Writing</h2>
          <ol className="space-y-6 list-none p-0">
            {featuredPosts.map((post) => (
              <li key={post.slug}>
                <ContentCard
                  to={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                />
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
