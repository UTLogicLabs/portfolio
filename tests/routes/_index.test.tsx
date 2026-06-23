import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import Home, { loader, meta } from "~/routes/_index";

const emptyLoaderData = { featuredProjects: [], featuredPosts: [] };

const Stub = createRoutesStub([{
  path: "/",
  Component: Home,
  loader: async () => emptyLoaderData,
}]);

describe("Home meta", () => {
  it("returns the page title", () => {
    const result = meta({ data: undefined as never, loaderData: undefined as never, params: {}, matches: [] as never[], location: {} as never });
    expect(result).toContainEqual({ title: "UTLogicLabs" });
  });
});

describe("Home loader", () => {
  it("returns featuredProjects and featuredPosts arrays", async () => {
    const { featuredProjects, featuredPosts } = await loader();
    expect(Array.isArray(featuredProjects)).toBe(true);
    expect(Array.isArray(featuredPosts)).toBe(true);
  });

  it("featuredProjects only contains projects with featured: true", async () => {
    const { featuredProjects } = await loader();
    for (const project of featuredProjects) {
      expect(project.featured).toBe(true);
    }
  });

  it("featuredPosts only contains posts with featured: true", async () => {
    const { featuredPosts } = await loader();
    for (const post of featuredPosts) {
      expect(post.featured).toBe(true);
    }
  });
});

describe("Home page", () => {
  it("renders the h1 greeting", async () => {
    render(<Stub initialEntries={["/"]} />);
    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Hi, I'm Joshua.");
  });

  it("renders View Projects link to /projects", async () => {
    render(<Stub initialEntries={["/"]} />);
    expect(await screen.findByRole("link", { name: /View Projects/i })).toHaveAttribute("href", "/projects");
  });

  it("renders Read Blog link to /blog", async () => {
    render(<Stub initialEntries={["/"]} />);
    expect(await screen.findByRole("link", { name: /Read Blog/i })).toHaveAttribute("href", "/blog");
  });

  it("renders Get in Touch link to /contact", async () => {
    render(<Stub initialEntries={["/"]} />);
    expect(await screen.findByRole("link", { name: /Get in Touch/i })).toHaveAttribute("href", "/contact");
  });

  it("renders the avatar image", async () => {
    render(<Stub initialEntries={["/"]} />);
    const img = await screen.findByRole("img", { name: "Joshua Dix" });
    expect(img).toHaveAttribute("src", "/avatar.png");
  });

  it("does not render featured sections when both arrays are empty", async () => {
    render(<Stub initialEntries={["/"]} />);
    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByRole("heading", { name: "Featured Projects" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Featured Writing" })).not.toBeInTheDocument();
  });
});

describe("Home featured projects", () => {
  it("renders Featured Projects heading when projects exist", async () => {
    const FeaturedStub = createRoutesStub([{
      path: "/",
      Component: Home,
      loader: async () => ({
        featuredProjects: [{ slug: "my-app", title: "My App", description: "A cool app", date: "2026-06-01", tech: ["React"], featured: true }],
        featuredPosts: [],
      }),
    }]);
    render(<FeaturedStub initialEntries={["/"]} />);
    expect(await screen.findByRole("heading", { name: "Featured Projects" })).toBeInTheDocument();
  });

  it("featured project card links to /projects/:slug", async () => {
    const FeaturedStub = createRoutesStub([{
      path: "/",
      Component: Home,
      loader: async () => ({
        featuredProjects: [{ slug: "my-app", title: "My App", description: "desc", date: "2026-06-01", tech: ["React"], featured: true }],
        featuredPosts: [],
      }),
    }]);
    render(<FeaturedStub initialEntries={["/"]} />);
    const link = await screen.findByRole("link", { name: /My App/i });
    expect(link).toHaveAttribute("href", "/projects/my-app");
  });

  it("renders tech tags on featured project cards", async () => {
    const FeaturedStub = createRoutesStub([{
      path: "/",
      Component: Home,
      loader: async () => ({
        featuredProjects: [{ slug: "my-app", title: "My App", description: "desc", date: "2026-06-01", tech: ["TypeScript", "Cloudflare"], featured: true }],
        featuredPosts: [],
      }),
    }]);
    render(<FeaturedStub initialEntries={["/"]} />);
    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
    expect(await screen.findByText("Cloudflare")).toBeInTheDocument();
  });
});

describe("Home featured writing", () => {
  it("renders Featured Writing heading when posts exist", async () => {
    const FeaturedStub = createRoutesStub([{
      path: "/",
      Component: Home,
      loader: async () => ({
        featuredProjects: [],
        featuredPosts: [{ slug: "hello", title: "Hello", date: "2026-06-21", description: "A post", featured: true }],
      }),
    }]);
    render(<FeaturedStub initialEntries={["/"]} />);
    expect(await screen.findByRole("heading", { name: "Featured Writing" })).toBeInTheDocument();
  });

  it("featured post card links to /blog/:slug", async () => {
    const FeaturedStub = createRoutesStub([{
      path: "/",
      Component: Home,
      loader: async () => ({
        featuredProjects: [],
        featuredPosts: [{ slug: "hello", title: "Hello", date: "2026-06-21", description: "A post", featured: true }],
      }),
    }]);
    render(<FeaturedStub initialEntries={["/"]} />);
    const link = await screen.findByRole("link", { name: /Hello/i });
    expect(link).toHaveAttribute("href", "/blog/hello");
  });

  it("renders formatted date on featured post cards", async () => {
    const FeaturedStub = createRoutesStub([{
      path: "/",
      Component: Home,
      loader: async () => ({
        featuredProjects: [],
        featuredPosts: [{ slug: "hello", title: "Hello", date: "2026-06-21T12:00:00.000Z", description: "desc", featured: true }],
      }),
    }]);
    render(<FeaturedStub initialEntries={["/"]} />);
    expect(await screen.findByText("June 21, 2026")).toBeInTheDocument();
  });
});
