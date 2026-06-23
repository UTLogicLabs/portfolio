import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "About — UTLogicLabs" },
  { name: "description", content: "About UTLogicLabs — background, skills, and experience." },
];

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight mb-8">About</h1>
      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg">
          I&apos;m Joshua Dix, a software engineer based in the US.
        </p>
        <p>
          I build full-stack web applications with a focus on developer
          experience, performance, and clean architecture. I enjoy working
          across the entire stack — from database schema design to polished UI.
        </p>
        <p>
          When I&apos;m not writing code, I&apos;m writing about it. You can
          find my thoughts on software craft on the{" "}
          <a href="/blog" className="text-primary underline underline-offset-4">
            blog
          </a>
          .
        </p>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Skills</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-none p-0">
            {[
              "TypeScript",
              "React",
              "React Router",
              "Node.js",
              "Prisma",
              "PostgreSQL",
              "Cloudflare Workers",
              "Tailwind CSS",
              "Playwright",
            ].map((skill) => (
              <li
                key={skill}
                className="bg-muted text-foreground px-3 py-1.5 rounded-md text-sm font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
