import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import BlogIndex, { loader, meta } from "~/routes/blog._index";

describe("BlogIndex meta", () => {
  it("returns the page title", () => {
    const result = meta({ data: undefined as never, params: {}, matches: [] });
    expect(result).toContainEqual({ title: "Blog — Joshua Dix" });
  });
});

describe("BlogIndex loader", () => {
  it("returns a posts array", async () => {
    const { posts } = await loader();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("posts are sorted newest-first by date", async () => {
    const { posts } = await loader();
    for (let i = 0; i < posts.length - 1; i++) {
      expect(new Date(posts[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i + 1].date).getTime()
      );
    }
  });

  it("each post has slug, title, date, description fields", async () => {
    const { posts } = await loader();
    for (const post of posts) {
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("date");
      expect(post).toHaveProperty("description");
    }
  });
});

describe("BlogIndex component", () => {
  it("renders the Blog heading", async () => {
    const Stub = createRoutesStub([{
      path: "/blog",
      Component: BlogIndex,
      loader: async () => ({ posts: [] }),
    }]);
    render(<Stub initialEntries={["/blog"]} />);
    expect(await screen.findByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument();
  });

  it("renders empty state when posts array is empty", async () => {
    const Stub = createRoutesStub([{
      path: "/blog",
      Component: BlogIndex,
      loader: async () => ({ posts: [] }),
    }]);
    render(<Stub initialEntries={["/blog"]} />);
    expect(await screen.findByText(/No posts yet/)).toBeInTheDocument();
  });

  it("renders post list when posts exist", async () => {
    const Stub = createRoutesStub([{
      path: "/blog",
      Component: BlogIndex,
      loader: async () => ({
        posts: [{ slug: "hello-world", title: "Hello, World", date: "2026-06-21", description: "The first post on this blog." }],
      }),
    }]);
    render(<Stub initialEntries={["/blog"]} />);
    const link = await screen.findByRole("link", { name: /Hello, World/i });
    expect(link).toHaveAttribute("href", "/blog/hello-world");
    expect(await screen.findByText("The first post on this blog.")).toBeInTheDocument();
  });

  it("renders a formatted date for each post", async () => {
    // Use noon UTC so toLocaleDateString stays on June 21 in all timezones ±12h
    const Stub = createRoutesStub([{
      path: "/blog",
      Component: BlogIndex,
      loader: async () => ({
        posts: [{ slug: "hello-world", title: "Hello, World", date: "2026-06-21T12:00:00.000Z", description: "desc" }],
      }),
    }]);
    render(<Stub initialEntries={["/blog"]} />);
    expect(await screen.findByText("June 21, 2026")).toBeInTheDocument();
  });
});
