import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Joshua Dix — Software Engineer" },
  {
    name: "description",
    content:
      "Personal portfolio of Joshua Dix — software engineer, builder, and writer.",
  },
];

export default function Home() {
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
    </main>
  );
}
