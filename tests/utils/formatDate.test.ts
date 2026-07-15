import { describe, it, expect } from "vitest";
import { formatDate } from "~/utils/formatDate";

describe("formatDate", () => {
  it("formats a date-only string without shifting to the previous day", () => {
    expect(formatDate("2026-06-21")).toBe("June 21, 2026");
  });

  it("formats a full ISO timestamp string using the native Date parser", () => {
    const input = "2026-06-21T12:00:00.000Z";
    const expected = new Date(input).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(formatDate(input)).toBe(expected);
  });

  it("falls back to the native Date parser for an invalid calendar date", () => {
    const input = "2026-02-30";
    const expected = new Date(input).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(formatDate(input)).toBe(expected);
  });
});
