import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import Home, { meta } from "~/routes/_index";

const Stub = createRoutesStub([{ path: "/", Component: Home }]);

describe("Home meta", () => {
  it("returns the page title", () => {
    const result = meta({ data: undefined, params: {}, matches: [] } as unknown as Parameters<typeof meta>[0]);
    expect(result).toContainEqual({ title: "Joshua Dix — Software Engineer" });
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
});
