import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub, UNSAFE_ErrorResponseImpl } from "react-router";
import App, { links, ErrorBoundary } from "~/root";

describe("App", () => {
  it("renders outlet children", async () => {
    const Stub = createRoutesStub([{
      path: "/",
      Component: App,
      children: [{ path: "", Component: () => <span>outlet-content</span> }],
    }]);
    render(<Stub initialEntries={["/"]} />);
    expect(await screen.findByText("outlet-content")).toBeInTheDocument();
  });
});

describe("links()", () => {
  it("returns six link descriptors", () => {
    const result = links();
    expect(result).toHaveLength(6);
  });

  it("first entry preconnects to fonts.googleapis.com", () => {
    const result = links();
    expect(result[0]).toMatchObject({ rel: "preconnect", href: "https://fonts.googleapis.com" });
  });

  it("includes the Inter stylesheet", () => {
    const result = links();
    const stylesheet = result.find((l) => 'rel' in l && l.rel === "stylesheet");
    expect(stylesheet).toMatchObject({ rel: "stylesheet" });
    expect((stylesheet as { href: string }).href).toContain("fonts.googleapis.com");
  });

  it("includes favicon.ico link", () => {
    const result = links();
    expect(result).toContainEqual({ rel: "icon", href: "/favicon.ico", sizes: "32x32" });
  });

  it("includes SVG favicon link", () => {
    const result = links();
    expect(result).toContainEqual({ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" });
  });

  it("includes apple-touch-icon link", () => {
    const result = links();
    expect(result).toContainEqual({ rel: "apple-touch-icon", href: "/apple-touch-icon.png" });
  });
});

describe("ErrorBoundary", () => {
  it("shows 404 heading for a 404 RouteErrorResponse", () => {
    const error = new UNSAFE_ErrorResponseImpl(404, "Not Found", "Not found", false);
    render(<ErrorBoundary error={error} params={{} as never} />);
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText("The requested page could not be found.")).toBeInTheDocument();
  });

  it("shows Error heading for a non-404 RouteErrorResponse", () => {
    const error = new UNSAFE_ErrorResponseImpl(500, "Server Error", "internal", false);
    render(<ErrorBoundary error={error} params={{} as never} />);
    expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();
    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });

  it("shows error message and stack trace for an Error instance in DEV mode", () => {
    const error = new Error("Something broke");
    render(<ErrorBoundary error={error} params={{} as never} />);
    expect(screen.getByText("Something broke")).toBeInTheDocument();
    // import.meta.env.DEV is true in Vitest — stack trace branch executes
    expect(screen.getByRole("code")).toBeInTheDocument();
  });

  it("shows generic Oops message for an unrecognized error type", () => {
    render(<ErrorBoundary error={null} params={{} as never} />);
    expect(screen.getByRole("heading", { name: "Oops!" })).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });
});
