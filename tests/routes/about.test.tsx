import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About, { meta } from "~/routes/about";

describe("About meta", () => {
  it("returns the page title", () => {
    const result = meta({ data: undefined as never, loaderData: undefined as never, params: {}, matches: [] as never[], location: {} as never });
    expect(result).toContainEqual({ title: "About — Joshua Dix" });
  });
});

describe("About page", () => {
  it("renders the h1", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
  });

  it("renders all skill badges", () => {
    render(<About />);
    const skills = [
      "TypeScript", "React", "React Router", "Node.js", "Prisma",
      "PostgreSQL", "Cloudflare Workers", "Tailwind CSS", "Playwright",
    ];
    for (const skill of skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it("renders an anchor link to the blog", () => {
    render(<About />);
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
  });
});
