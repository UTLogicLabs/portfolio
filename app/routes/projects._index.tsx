import type { MetaFunction } from "react-router";
import ContentCard from "~/components/ContentCard";

export const meta: MetaFunction = () => [
  { title: "Projects — UTLogicLabs" },
  { name: "description", content: "A selection of projects I've built." },
];

interface ProjectFrontmatter {
  title: string;
  description: string;
  date: string;
  tech: string[];
  url?: string;
  repo?: string;
  featured?: boolean;
}

interface ProjectModule {
  frontmatter: ProjectFrontmatter;
}

export async function loader() {
  const modules = import.meta.glob<ProjectModule>("../../content/projects/*.mdx", {
    eager: true,
  });

  const projects = Object.entries(modules)
    .map(([path, mod]) => {
      const slug = path.split("/").at(-1)!.replace(/\.mdx$/, "");
      return { slug, ...mod.frontmatter };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { projects };
}

export default function ProjectsIndex({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { projects } = loaderData;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight mb-12">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-muted-foreground">Projects coming soon.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
          {projects.map((project) => (
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
      )}
    </main>
  );
}
