import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import BlogPost, { loader, action, meta } from "~/routes/blog.$slug";

const mockFindMany = vi.fn();
vi.mock("~/db.server", () => ({
  getPrisma: vi.fn(() => ({ comment: { findMany: mockFindMany } })),
}));

const mockSubmitComment = vi.fn();
vi.mock("~/services/comments.server", () => ({
  submitComment: (...args: unknown[]) => mockSubmitComment(...args),
}));

function makeContext(overrides: Record<string, unknown> = {}) {
  return {
    cloudflare: {
      env: {
        portfolio_db: {} as D1Database,
        TURNSTILE_SITE_KEY: "test-site-key",
        ...overrides,
      },
    },
  };
}

describe("BlogPost loader", () => {
  beforeEach(() => {
    mockFindMany.mockReset().mockResolvedValue([]);
  });

  it("throws a 404 DataWithResponseInit for an unknown slug", async () => {
    await expect(
      loader({ params: { slug: "no-such-post" } })
    ).rejects.toMatchObject({ init: { status: 404 } });
  });

  it("returns frontmatter and slug for an existing post", async () => {
    const result = await loader({ params: { slug: "2026-06-21-hello-world" } });
    expect(result.slug).toBe("2026-06-21-hello-world");
    expect(result.frontmatter.title).toBe("Hello, World");
    expect(result.frontmatter.date).toBe("2026-06-21");
    expect(typeof result.frontmatter.description).toBe("string");
  });

  it("resolves a legacy short slug to the canonical date-prefixed slug", async () => {
    const result = await loader({ params: { slug: "hello-world" } });
    expect(result.slug).toBe("2026-06-21-hello-world");
    expect(result.frontmatter.title).toBe("Hello, World");
  });

  it("returns a numeric readTime for an existing post", async () => {
    const result = await loader({ params: { slug: "hello-world" } });
    expect(typeof result.readTime).toBe("number");
    expect(result.readTime).toBeGreaterThanOrEqual(1);
  });

  it("returns empty comments and no site key when no cloudflare context is present", async () => {
    const result = await loader({ params: { slug: "hello-world" } });
    expect(result.comments).toEqual([]);
    expect(result.turnstileSiteKey).toBe("");
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("fetches only approved comments for this post and builds a tree", async () => {
    mockFindMany.mockResolvedValue([
      { id: "a", parentId: null, targetType: "BLOG_POST", targetSlug: "2026-06-21-hello-world" },
      { id: "b", parentId: "a", targetType: "BLOG_POST", targetSlug: "2026-06-21-hello-world" },
    ]);
    const result = await loader({
      params: { slug: "hello-world" },
      context: makeContext() as never,
    } as never);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { targetType: "BLOG_POST", targetSlug: "2026-06-21-hello-world", approved: true },
      orderBy: { createdAt: "asc" },
    });
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0].id).toBe("a");
    expect(result.comments[0].replies[0].id).toBe("b");
    expect(result.turnstileSiteKey).toBe("test-site-key");
  });
});

describe("BlogPost action", () => {
  beforeEach(() => {
    mockSubmitComment.mockReset();
  });

  function callAction(fields: Record<string, string>) {
    const formData = new FormData();
    for (const [k, v] of Object.entries(fields)) formData.set(k, v);
    const request = new Request("http://localhost/blog/hello-world", { method: "POST", body: formData });
    return action({
      request,
      params: { slug: "hello-world" },
      context: makeContext() as never,
    } as never);
  }

  it("delegates to submitComment with targetType BLOG_POST and the canonical slug", async () => {
    mockSubmitComment.mockResolvedValue({ success: true });
    await callAction({ name: "Josh", email: "josh@example.com", body: "Nice post!" });
    expect(mockSubmitComment).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: "BLOG_POST",
        targetSlug: "2026-06-21-hello-world",
        name: "Josh",
        email: "josh@example.com",
        body: "Nice post!",
      }),
      expect.anything()
    );
  });

  it("returns a 200 status on success", async () => {
    mockSubmitComment.mockResolvedValue({ success: true });
    const result = (await callAction({ name: "Josh", email: "j@example.com", body: "Nice!" })) as {
      init: { status: number };
    };
    expect(result.init.status).toBe(200);
  });

  it("returns a 422 status when submitComment reports errors", async () => {
    mockSubmitComment.mockResolvedValue({ errors: { name: "Name is required." } });
    const result = (await callAction({ name: "", email: "j@example.com", body: "Nice!" })) as {
      init: { status: number };
    };
    expect(result.init.status).toBe(422);
  });
});

describe("BlogPost meta", () => {
  it("returns Not Found title when loaderData is undefined", () => {
    const result = meta({ data: undefined as never, loaderData: undefined as never, params: { slug: "" }, matches: [] as never, location: {} as never });
    expect(result).toContainEqual({ title: "Not Found" });
  });

  it("returns post title and description when data is present", () => {
    const result = meta({
      data: {
        frontmatter: { title: "Hello, World", description: "The first post.", date: "2026-06-21" },
        slug: "hello-world",
        readTime: 1,
        comments: [],
        turnstileSiteKey: "",
      },
      loaderData: undefined as never,
      params: { slug: "hello-world" },
      matches: [] as never,
      location: {} as never,
    });
    expect(result).toContainEqual({ title: "Hello, World — UTLogicLabs" });
    expect(result).toContainEqual({ name: "description", content: "The first post." });
  });
});

describe("BlogPost component", () => {
  const loaderData = {
    frontmatter: {
      title: "Hello, World",
      // Date-only string, as real frontmatter provides it — regression
      // coverage for the UTC-midnight-parsing off-by-one-day bug.
      date: "2026-06-21",
      description: "The first post on this blog — why I built this site.",
    },
    slug: "2026-06-21-hello-world",
    readTime: 1,
    comments: [],
    turnstileSiteKey: "test-site-key",
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

  it("renders read time when provided", async () => {
    const Stub = createRoutesStub([{
      path: "/blog/:slug",
      Component: BlogPost,
      loader: async () => ({ ...loaderData, readTime: 5 }),
    }]);
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    expect(await screen.findByText(/5 min read/)).toBeInTheDocument();
  });

  it("renders the comment section", async () => {
    const Stub = createRoutesStub([{
      path: "/blog/:slug",
      Component: BlogPost,
      loader: async () => loaderData,
    }]);
    render(<Stub initialEntries={["/blog/hello-world"]} />);
    expect(await screen.findByRole("heading", { level: 2, name: "Comments" })).toBeInTheDocument();
  });
});
