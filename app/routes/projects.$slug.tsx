import { data } from "react-router";
import type { ComponentType } from "react";
import type { Route } from "./+types/projects.$slug";

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

export async function loader({ params }: { params: { slug: string } }) {
  const modules = import.meta.glob<ProjectModule>("../../content/projects/*.mdx");
  const mod = modules[`../../content/projects/${params.slug}.mdx`];

  if (!mod) {
    throw data("Project not found", { status: 404 });
  }

  const resolved = await mod();
  return { frontmatter: resolved.frontmatter, slug: params.slug };
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
  const { frontmatter, slug } = loaderData;

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
    </main>
  );
}
