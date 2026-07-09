import { describe, it, expect } from "vitest";
import { cycleTheme, parseThemeCookie, serializeThemeCookie } from "~/utils/theme";

describe("parseThemeCookie", () => {
  it("defaults to system when there is no cookie header", () => {
    expect(parseThemeCookie(null)).toBe("system");
    expect(parseThemeCookie(undefined)).toBe("system");
    expect(parseThemeCookie("")).toBe("system");
  });

  it("defaults to system when the theme cookie is missing or invalid", () => {
    expect(parseThemeCookie("other=value")).toBe("system");
    expect(parseThemeCookie("theme=neon")).toBe("system");
  });

  it("reads a valid theme from the cookie header", () => {
    expect(parseThemeCookie("theme=dark")).toBe("dark");
    expect(parseThemeCookie("theme=light")).toBe("light");
  });

  it("reads the theme cookie among other cookies", () => {
    expect(parseThemeCookie("__session=abc123; theme=dark; other=1")).toBe("dark");
  });
});

describe("serializeThemeCookie", () => {
  it("round-trips through parseThemeCookie", () => {
    const serialized = serializeThemeCookie("dark");
    expect(parseThemeCookie(serialized)).toBe("dark");
  });

  it("sets a one year max-age and site-wide path", () => {
    const serialized = serializeThemeCookie("light");
    expect(serialized).toContain("Path=/");
    expect(serialized).toContain("Max-Age=31536000");
  });
});

describe("cycleTheme", () => {
  it("cycles light -> system -> dark -> light", () => {
    expect(cycleTheme("light")).toBe("system");
    expect(cycleTheme("system")).toBe("dark");
    expect(cycleTheme("dark")).toBe("light");
  });
});
