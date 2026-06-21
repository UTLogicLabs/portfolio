import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { Nav } from "~/components/Nav";

function renderNav(path = "/") {
  const Stub = createRoutesStub([{ path, Component: Nav }]);
  return render(<Stub initialEntries={[path]} />);
}

describe("Nav", () => {
  it("renders the wordmark linking to /", () => {
    renderNav();
    const wordmark = screen.getByRole("link", { name: "Joshua Dix" });
    expect(wordmark).toBeInTheDocument();
    expect(wordmark).toHaveAttribute("href", "/");
  });

  it("renders all route links", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });

  it("applies text-primary class to the active route link", () => {
    renderNav("/projects");
    const projectLinks = screen.getAllByRole("link", { name: "Projects" });
    projectLinks.forEach((link) => expect(link).toHaveClass("text-primary"));
  });

  it("shows the mobile menu button", () => {
    renderNav();
    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    renderNav();

    const button = screen.getByRole("button", { name: /open menu/i });

    // Menu starts closed — mobile links are in the DOM (in the mobile panel) only after open
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu when a nav link is clicked", async () => {
    const user = userEvent.setup();
    // Use a wildcard route so navigating to /blog doesn't 404
    const Stub = createRoutesStub([{ path: "/*", Component: Nav }]);
    render(<Stub initialEntries={["/"]} />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");

    // Click the mobile-only "Blog" link (second one since desktop also renders it)
    const blogLinks = screen.getAllByRole("link", { name: "Blog" });
    await user.click(blogLinks[blogLinks.length - 1]);

    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute("aria-expanded", "false");
  });
});
