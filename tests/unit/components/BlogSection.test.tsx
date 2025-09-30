import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogSection } from "@/components/BlogSection";

// Mock the Icon component
vi.mock("@/components/ui", () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => 
    <a href={to}>{children}</a>,
}));

describe("BlogSection", () => {
  it("should render empty state when no blog posts are provided", () => {
    render(<BlogSection blogPosts={[]} />);
    
    expect(screen.getByText("Blog & Writing")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(screen.getByText("I'm working on some exciting blog posts about web development, React, and more. Check back soon for insightful articles and tutorials!")).toBeInTheDocument();
  });

  it("should render empty state when blogPosts is undefined", () => {
    render(<BlogSection />);
    
    expect(screen.getByText("Blog & Writing")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("should render section with proper heading", () => {
    render(<BlogSection blogPosts={[]} />);
    
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Blog & Writing");
  });

  it("should render external link icon in Coming Soon card", () => {
    render(<BlogSection blogPosts={[]} />);
    
    expect(screen.getByTestId("icon-external-link")).toBeInTheDocument();
  });
});
