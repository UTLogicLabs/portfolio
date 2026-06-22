import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import BlogPost, { loader, meta } from "~/routes/blog.$slug";

describe("BlogPost loader", () => {
  it("throws a 404 DataWithResponseInit for an unknown slug", async () => {
    await expect(
      loader({ params: { slug: "no-such-post" } })
    ).rejects.toMatchObject({ init: { status: 404 } });
  });

  it("returns frontmatter and slug for an existing post", async () => {
    const result = await loader({ params: { slug: "hello-world" } });
    expect(result.slug).toBe("hello-world");
    expect(result.frontmatter.title).toBe("Hello, World");
    expect(result.frontmatter.date).toBe("2026-06-21");
    expect(typeof result.frontmatter.description).toBe("string");
  });
});

describe("BlogPost meta", () => {
  it("returns Not Found title when loaderData is undefined", () => {
    const result = meta({ data: undefined, params: {}, matches: [] } as unknown as Parameters<typeof meta>[0]);
    expect(result).toContainEqual({ title: "Not Found" });
  });

  it("returns post title and description when data is present", () => {
    const result = meta({
      data: {
        frontmatter: { title: "Hello, World", description: "The first post.", date: "2026-06-21" },
        slug: "hello-world",
      },
      params: {},
      matches: [],
    } as unknown as Parameters<typeof meta>[0]);
    expect(result).toContainEqual({ title: "Hello, World — Joshua Dix" });
    expect(result).toContainEqual({ name: "description", content: "The first post." });
  });
});

describe("BlogPost component", () => {
  const loaderData = {
    frontmatter: {
      title: "Hello, World",
      // Noon UTC keeps toLocaleDateString on June 21 in all timezones ±11h
      date: "2026-06-21T12:00:00.000Z",
      description: "The first post on this blog — why I built this site.",
    },
    slug: "hello-world",
  };

  it("renders the post h1 title", async () => {
    const Stub = createRoutesStub([{
      path: "/blog/:slug",
      Component: BlogPost,
      loader: async () => loaderData,
    }]);
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    expect(await screen.findByRole("heading", { level: 1, name: "Hello, World" })).toBeInTheDocument();
  });

  it("renders the formatted date", async () => {
    const Stub = createRoutesStub([{
      path: "/blog/:slug",
      Component: BlogPost,
      loader: async () => loaderData,
    }]);
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    expect(await screen.findByText("June 21, 2026")).toBeInTheDocument();
  });

  it("renders the post description", async () => {
    const Stub = createRoutesStub([{
      path: "/blog/:slug",
      Component: BlogPost,
      loader: async () => loaderData,
    }]);
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    expect(await screen.findByText(/The first post on this blog/)).toBeInTheDocument();
  });

  it("renders MDX content", async () => {
    const Stub = createRoutesStub([{
      path: "/blog/:slug",
      Component: BlogPost,
      loader: async () => loaderData,
    }]);
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    expect(await screen.findByText(/Welcome to my corner of the internet/)).toBeInTheDocument();
  });
});
