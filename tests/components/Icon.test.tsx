import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "~/components/Icon";

describe("Icon", () => {
  it("renders an svg with the correct href for the named icon", () => {
    render(<Icon name="arrow-right" />);
    const svg = document.querySelector("svg");
    const use = document.querySelector("use");
    expect(svg).toBeInTheDocument();
    expect(use).toHaveAttribute("href", "/icons/sprite.svg#arrow-right");
  });

  it("applies the given size as width and height", () => {
    render(<Icon name="github" size={24} />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("defaults to size 16", () => {
    render(<Icon name="external-link" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("forwards additional svg props", () => {
    render(<Icon name="arrow-right" className="text-primary" data-testid="icon" />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveClass("text-primary");
  });

  it("has aria-hidden so it is invisible to screen readers", () => {
    render(<Icon name="arrow-right" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden");
  });
});
