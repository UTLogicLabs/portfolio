import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "~/components/ThemeToggle";

function setInitialTheme(theme: string) {
  document.documentElement.dataset.theme = theme;
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    setInitialTheme("system");
    document.cookie = "theme=; Max-Age=0";
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");
  });

  it("renders a single click-anywhere control with light, system, and dark slots, system in the center", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /currently system/i });
    const slots = button.querySelectorAll("span");

    expect(slots).toHaveLength(3);
    expect(slots[1].querySelector("svg")).not.toBeNull(); // active (system) slot shows its icon
    expect(slots[0].querySelector("svg")).toBeNull();
    expect(slots[2].querySelector("svg")).toBeNull();
  });

  it("clicking anywhere on the control cycles light -> system -> dark -> light", async () => {
    setInitialTheme("light");
    const user = userEvent.setup();
    render(<ThemeToggle />);

    let button = screen.getByRole("button", { name: /currently light/i });
    await user.click(button);

    button = screen.getByRole("button", { name: /currently system/i });
    expect(document.cookie).toContain("theme=system");

    await user.click(button);
    button = screen.getByRole("button", { name: /currently dark/i });
    expect(document.cookie).toContain("theme=dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(button);
    button = screen.getByRole("button", { name: /currently light/i });
    expect(document.cookie).toContain("theme=light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("syncs a second mounted instance when the first is clicked", async () => {
    setInitialTheme("light");
    const user = userEvent.setup();
    render(
      <>
        <ThemeToggle />
        <ThemeToggle />
      </>
    );

    const [first, second] = screen.getAllByRole("button", { name: /currently light/i });
    await user.click(first);

    expect(first).toHaveAccessibleName(/currently system/i);
    expect(second).toHaveAccessibleName(/currently system/i);
  });

  it("falls back to the system slot when the initial dataset theme is invalid", () => {
    setInitialTheme("neon");
    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /currently system/i })).toBeInTheDocument();
  });
});
