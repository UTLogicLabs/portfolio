import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import ProjectDetail, { loader, meta } from "~/routes/projects.$slug";

describe("ProjectDetail loader", () => {
  it("throws a 404 DataWithResponseInit for an unknown slug", async () => {
    await expect(
      loader({ params: { slug: "no-such-project" } })
    ).rejects.toMatchObject({ init: { status: 404 } });
  });

  it("returns frontmatter and slug for an existing project", async () => {
    const result = await loader({ params: { slug: "portfolio" } });
    expect(result.slug).toBe("portfolio");
    expect(result.frontmatter.title).toBe("This Portfolio");
    expect(Array.isArray(result.frontmatter.tech)).toBe(true);
  });
});

describe("ProjectDetail meta", () => {
  it("returns Not Found title when loaderData is undefined", () => {
    const result = meta({ data: undefined as never, params: {}, matches: [] });
    expect(result).toContainEqual({ title: "Not Found" });
  });

  it("returns project title and description when data is present", () => {
    const result = meta({
      data: {
        frontmatter: {
          title: "This Portfolio",
          description: "Personal portfolio site.",
          date: "2026-06-21",
          tech: [],
        },
        slug: "portfolio",
      },
      params: {},
      matches: [],
    });
    expect(result).toContainEqual({ title: "This Portfolio — Joshua Dix" });
    expect(result).toContainEqual({ name: "description", content: "Personal portfolio site." });
  });
});

describe("ProjectDetail component", () => {
  const baseLoader = {
    frontmatter: {
      title: "This Portfolio",
      description: "Personal portfolio site built with React Router v7.",
      date: "2026-06-21",
      tech: ["React Router v7", "TypeScript"],
      repo: "https://github.com/UTLogicLabs/portfolio",
    },
    slug: "portfolio",
  };

  it("renders the project h1 title", async () => {
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => baseLoader,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    expect(await screen.findByRole("heading", { level: 1, name: "This Portfolio" })).toBeInTheDocument();
  });

  it("renders the project description", async () => {
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => baseLoader,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    expect(await screen.findByText(/Personal portfolio site built with React Router v7/)).toBeInTheDocument();
  });

  it("renders tech tags", async () => {
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => baseLoader,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    // Wait for full render, then use getAllByText — "React Router v7" appears in
    // both the tech tag and the MDX article body, so findByText would time out
    // retrying on the multi-match error.
    await screen.findByRole("heading", { level: 1 });
    expect(screen.getAllByText("React Router v7").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
  });

  it("renders the GitHub link when repo is present", async () => {
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => baseLoader,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    const link = await screen.findByRole("link", { name: /GitHub/i });
    expect(link).toHaveAttribute("href", "https://github.com/UTLogicLabs/portfolio");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("does not render the Live Site link when url is absent", async () => {
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => baseLoader,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    await screen.findByRole("heading", { level: 1 }); // wait for render
    expect(screen.queryByRole("link", { name: /Live Site/i })).toBeNull();
  });

  it("renders the Live Site link when url is present", async () => {
    const withUrl = {
      ...baseLoader,
      frontmatter: { ...baseLoader.frontmatter, url: "https://example.com" },
    };
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => withUrl,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    const link = await screen.findByRole("link", { name: /Live Site/i });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("does not render the GitHub link when repo is absent", async () => {
    const withoutRepo = {
      ...baseLoader,
      frontmatter: { ...baseLoader.frontmatter, repo: undefined },
    };
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => withoutRepo,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    await screen.findByRole("heading", { level: 1 }); // wait for render
    expect(screen.queryByRole("link", { name: /GitHub/i })).toBeNull();
  });
});
