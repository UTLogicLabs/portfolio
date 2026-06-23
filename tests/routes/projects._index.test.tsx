import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import ProjectsIndex, { loader, meta } from "~/routes/projects._index";

describe("ProjectsIndex meta", () => {
  it("returns the page title", () => {
    const result = meta({ data: undefined as never, loaderData: undefined as never, params: {}, matches: [] as never[], location: {} as never });
    expect(result).toContainEqual({ title: "Projects — UTLogicLabs" });
  });
});

describe("ProjectsIndex loader", () => {
  it("returns a projects array", async () => {
    const { projects } = await loader();
    expect(Array.isArray(projects)).toBe(true);
  });

  it("projects are sorted newest-first by date", async () => {
    const { projects } = await loader();
    for (let i = 0; i < projects.length - 1; i++) {
      expect(new Date(projects[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(projects[i + 1].date).getTime()
      );
    }
  });

  it("each project has slug, title, description, date, tech fields", async () => {
    const { projects } = await loader();
    for (const project of projects) {
      expect(project).toHaveProperty("slug");
      expect(project).toHaveProperty("title");
      expect(project).toHaveProperty("description");
      expect(project).toHaveProperty("date");
      expect(project).toHaveProperty("tech");
      expect(Array.isArray(project.tech)).toBe(true);
    }
  });
});

describe("ProjectsIndex component", () => {
  it("renders the Projects heading", async () => {
    const Stub = createRoutesStub([{
      path: "/projects",
      Component: ProjectsIndex,
      loader: async () => ({ projects: [] }),
    }]);
    render(<Stub initialEntries={["/projects"]} />);
    expect(await screen.findByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
  });

  it("renders empty state when projects array is empty", async () => {
    const Stub = createRoutesStub([{
      path: "/projects",
      Component: ProjectsIndex,
      loader: async () => ({ projects: [] }),
    }]);
    render(<Stub initialEntries={["/projects"]} />);
    expect(await screen.findByText(/Projects coming soon/)).toBeInTheDocument();
  });

  it("renders a card linking to each project", async () => {
    const Stub = createRoutesStub([{
      path: "/projects",
      Component: ProjectsIndex,
      loader: async () => ({
        projects: [{
          slug: "portfolio",
          title: "This Portfolio",
          description: "Personal portfolio site.",
          date: "2026-06-21",
          tech: ["React Router v7", "TypeScript"],
        }],
      }),
    }]);
    render(<Stub initialEntries={["/projects"]} />);
    const link = await screen.findByRole("link", { name: /This Portfolio/i });
    expect(link).toHaveAttribute("href", "/projects/portfolio");
    expect(await screen.findByText("Personal portfolio site.")).toBeInTheDocument();
  });

  it("renders tech tags for each project card", async () => {
    const Stub = createRoutesStub([{
      path: "/projects",
      Component: ProjectsIndex,
      loader: async () => ({
        projects: [{
          slug: "portfolio",
          title: "This Portfolio",
          description: "desc",
          date: "2026-06-21",
          tech: ["React Router v7", "TypeScript"],
        }],
      }),
    }]);
    render(<Stub initialEntries={["/projects"]} />);
    expect(await screen.findByText("React Router v7")).toBeInTheDocument();
    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
  });
});
