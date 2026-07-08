import { describe, it, expect } from "vitest";
import { escapeHtml } from "~/utils/html.server";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });

  it("escapes double and single quotes", () => {
    expect(escapeHtml(`"quoted" and 'single'`)).toBe(
      "&quot;quoted&quot; and &#39;single&#39;"
    );
  });

  it("leaves safe strings unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});
