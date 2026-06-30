import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import ContentCard from "~/components/ContentCard";

function renderCard(props: Parameters<typeof ContentCard>[0]) {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => <ContentCard {...props} />,
    },
  ]);
  return render(<Stub initialEntries={["/"]} />);
}

describe("ContentCard", () => {
  it("renders a link to the given path", async () => {
    renderCard({ to: "/projects/foo", title: "Foo", description: "A project." });
    const link = await screen.findByRole("link", { name: /Foo/i });
    expect(link).toHaveAttribute("href", "/projects/foo");
  });

  it("renders the title and description", async () => {
    renderCard({ to: "/projects/foo", title: "Foo", description: "A project." });
    expect(await screen.findByRole("heading", { level: 2, name: "Foo" })).toBeInTheDocument();
    expect(await screen.findByText("A project.")).toBeInTheDocument();
  });

  it("renders a formatted date when date prop is provided", async () => {
    renderCard({ to: "/blog/post", title: "Post", description: "desc", date: "2026-06-21T12:00:00.000Z" });
    expect(await screen.findByText("June 21, 2026")).toBeInTheDocument();
  });

  it("does not render a time element when date is not provided", async () => {
    const { container } = renderCard({ to: "/projects/foo", title: "Foo", description: "desc" });
    await screen.findByRole("heading", { level: 2 });
    expect(container.querySelector("time")).toBeNull();
  });

  it("renders tags when tags prop is provided", async () => {
    renderCard({ to: "/projects/foo", title: "Foo", description: "desc", tags: ["TypeScript", "React"] });
    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
    expect(await screen.findByText("React")).toBeInTheDocument();
  });

  it("does not render a tag list when tags is not provided", async () => {
    renderCard({ to: "/blog/post", title: "Post", description: "desc", date: "2026-06-21" });
    await screen.findByRole("heading", { level: 2 });
    expect(screen.queryByRole("list", { name: /tags/i })).toBeNull();
  });

  it("card link has h-full class for equal-height grid cells", async () => {
    renderCard({ to: "/projects/foo", title: "Foo", description: "desc" });
    const link = await screen.findByRole("link", { name: /Foo/i });
    expect(link.className).toContain("h-full");
  });

  it("renders read time when date and readTime are both provided", async () => {
    renderCard({ to: "/blog/post", title: "Post", description: "desc", date: "2026-06-21", readTime: 5 });
    expect(await screen.findByText(/5 min read/)).toBeInTheDocument();
  });

  it("does not render read time when readTime is not provided", async () => {
    renderCard({ to: "/blog/post", title: "Post", description: "desc", date: "2026-06-21" });
    await screen.findByRole("heading", { level: 2 });
    expect(screen.queryByText(/min read/)).toBeNull();
  });
});
