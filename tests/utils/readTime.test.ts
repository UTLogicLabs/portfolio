import { describe, it, expect } from "vitest";
import { readTime } from "~/utils/readTime";

describe("readTime", () => {
  it("returns 1 for 0 words", () => {
    expect(readTime(0)).toBe(1);
  });

  it("returns 1 for fewer than 100 words", () => {
    expect(readTime(50)).toBe(1);
  });

  it("returns 1 for exactly 200 words", () => {
    expect(readTime(200)).toBe(1);
  });

  it("returns 2 for 400 words", () => {
    expect(readTime(400)).toBe(2);
  });

  it("rounds to nearest minute (300 words → 2 min)", () => {
    expect(readTime(300)).toBe(2);
  });

  it("rounds down correctly (100 words → 1 min minimum)", () => {
    expect(readTime(100)).toBe(1);
  });
});
