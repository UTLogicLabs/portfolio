import { describe, it, expect } from "vitest";
import { formatDate } from "~/utils/formatDate";

describe("formatDate", () => {
  it("formats a date-only string without shifting to the previous day", () => {
    expect(formatDate("2026-06-21")).toBe("June 21, 2026");
  });

  it("formats a full ISO timestamp string", () => {
    expect(formatDate("2026-06-21T12:00:00.000Z")).toBe("June 21, 2026");
  });
});
