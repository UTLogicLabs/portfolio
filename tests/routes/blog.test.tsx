import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import BlogLayout, { loader } from "~/routes/blog";

const mockPosts = [
  { slug: "hello-world", title: "Hello, World", date: "2026-06-21" },
  { slug: "second-post", title: "Second Post", date: "2026-06-20" },
];

describe("BlogLayout loader", () => {
  it("returns a posts array", async () => {
    const { posts } = await loader();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("posts have slug, title, date but not description or tags", async () => {
    const { posts } = await loader();
    if (posts.length > 0) {
      expect(posts[0]).toHaveProperty("slug");
      expect(posts[0]).toHaveProperty("title");
      expect(posts[0]).toHaveProperty("date");
      expect(posts[0]).not.toHaveProperty("description");
      expect(posts[0]).not.toHaveProperty("tags");
    }
  });
});

describe("BlogLayout component", () => {
  function makeStub(_path: string) {
    return createRoutesStub([{
      path: "/blog",
      Component: BlogLayout,
      loader: async () => ({ posts: mockPosts }),
      children: [{ path: ":slug", Component: () => <div /> }],
    }]);
  }

  it("renders Blog sidebar link to /blog", async () => {
    const Stub = makeStub("/blog");
    render(<Stub initialEntries={["/blog"]} />);
    expect(await screen.findByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  it("renders post links in the sidebar", async () => {
    const Stub = makeStub("/blog/hello-world");
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    const link = await screen.findByRole("link", { name: "Hello, World" });
    expect(link).toHaveAttribute("href", "/blog/hello-world");
  });

  it("applies active classes to the current post link", async () => {
    const Stub = makeStub("/blog/hello-world");
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    const link = await screen.findByRole("link", { name: "Hello, World" });
    expect(link.className).toContain("text-foreground");
    expect(link.className).toContain("font-medium");
  });

  it("applies inactive class to a non-active post link", async () => {
    const Stub = makeStub("/blog/second-post");
    render(<Stub initialEntries={["/blog/second-post"]} />);
    const link = await screen.findByRole("link", { name: "Hello, World" });
    expect(link.className).toContain("text-muted-foreground");
    expect(link.className).not.toContain("font-medium");
  });
});
