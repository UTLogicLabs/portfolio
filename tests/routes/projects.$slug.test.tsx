import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import ProjectDetail, { loader, action, meta } from "~/routes/projects.$slug";

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

describe("ProjectDetail loader", () => {
  beforeEach(() => {
    mockFindMany.mockReset().mockResolvedValue([]);
  });

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

  it("returns empty comments and no site key when no cloudflare context is present", async () => {
    const result = await loader({ params: { slug: "portfolio" } });
    expect(result.comments).toEqual([]);
    expect(result.turnstileSiteKey).toBe("");
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("fetches only approved comments for this project and builds a tree", async () => {
    mockFindMany.mockResolvedValue([
      { id: "a", parentId: null, targetType: "PROJECT", targetSlug: "portfolio" },
      { id: "b", parentId: "a", targetType: "PROJECT", targetSlug: "portfolio" },
    ]);
    const result = await loader({
      params: { slug: "portfolio" },
      context: makeContext() as never,
    } as never);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { targetType: "PROJECT", targetSlug: "portfolio", approved: true },
      orderBy: { createdAt: "asc" },
    });
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0].id).toBe("a");
    expect(result.comments[0].replies[0].id).toBe("b");
    expect(result.turnstileSiteKey).toBe("test-site-key");
  });
});

describe("ProjectDetail action", () => {
  beforeEach(() => {
    mockSubmitComment.mockReset();
  });

  function callAction(fields: Record<string, string>) {
    const formData = new FormData();
    for (const [k, v] of Object.entries(fields)) formData.set(k, v);
    const request = new Request("http://localhost/projects/portfolio", { method: "POST", body: formData });
    return action({
      request,
      params: { slug: "portfolio" },
      context: makeContext() as never,
    } as never);
  }

  it("delegates to submitComment with targetType PROJECT and the route's slug", async () => {
    mockSubmitComment.mockResolvedValue({ success: true });
    await callAction({ name: "Josh", email: "josh@example.com", body: "Nice project!" });
    expect(mockSubmitComment).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: "PROJECT",
        targetSlug: "portfolio",
        name: "Josh",
        email: "josh@example.com",
        body: "Nice project!",
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

describe("ProjectDetail meta", () => {
  it("returns Not Found title when loaderData is undefined", () => {
    const result = meta({ data: undefined as never, loaderData: undefined as never, params: { slug: "" }, matches: [] as never, location: {} as never });
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
        comments: [],
        turnstileSiteKey: "",
      },
      loaderData: undefined as never,
      params: { slug: "portfolio" },
      matches: [] as never,
      location: {} as never,
    });
    expect(result).toContainEqual({ title: "This Portfolio — UTLogicLabs" });
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
    comments: [],
    turnstileSiteKey: "test-site-key",
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

  it("outer container uses max-w-4xl", async () => {
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => baseLoader,
    }]);
    const { container } = render(<Stub initialEntries={["/projects/portfolio"]} />);
    await screen.findByRole("heading", { level: 1 });
    const outer = container.querySelector("main")!;
    expect(outer.className).toContain("max-w-4xl");
  });

  it("renders the comment section", async () => {
    const Stub = createRoutesStub([{
      path: "/projects/:slug",
      Component: ProjectDetail,
      loader: async () => baseLoader,
    }]);
    render(<Stub initialEntries={["/projects/portfolio"]} />);
    expect(await screen.findByRole("heading", { level: 2, name: "Comments" })).toBeInTheDocument();
  });
});
