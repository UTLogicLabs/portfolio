import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "~/components/Icon";

describe("Icon", () => {
  it("renders an svg with the correct href for the named icon", () => {
    render(<Icon name="ArrowRight" />);
    const svg = document.querySelector("svg");
    const use = document.querySelector("use");
    expect(svg).toBeInTheDocument();
    expect(use).toHaveAttribute("href", "/icons/sprite.svg#ArrowRight");
  });

  it("applies the given size as width and height", () => {
    render(<Icon name="Github" size={24} />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("defaults to size 16", () => {
    render(<Icon name="ExternalLink" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("forwards additional svg props", () => {
    render(<Icon name="ArrowRight" className="text-primary" data-testid="icon" />);
    const svg = screen.getByTestId("icon");
    expect(svg).toHaveClass("text-primary");
  });

  it("has aria-hidden so it is invisible to screen readers", () => {
    render(<Icon name="ArrowRight" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("accepts non-square dimensions via width and height props", () => {
    render(<Icon name="UtlogiclabsLogo" width={91} height={32} />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "91");
    expect(svg).toHaveAttribute("height", "32");
    expect(document.querySelector("use")).toHaveAttribute("href", "/icons/sprite.svg#UtlogiclabsLogo");
  });
});
