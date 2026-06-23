import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "~/components/Footer";

describe("Footer", () => {
  it("renders the UTLogicLabs copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/UTLogicLabs/)).toBeInTheDocument();
  });

  it("renders the built-with tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/Built with React Router \+ Cloudflare Workers/)).toBeInTheDocument();
  });

  it("renders a footer element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});
