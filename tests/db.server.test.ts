import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@prisma/adapter-d1", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaD1: vi.fn(function (this: any, db: unknown) { this._db = db; }),
}));
vi.mock("~/generated/prisma/client", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaClient: vi.fn(function (this: any, opts: unknown) { this._opts = opts; }),
}));

import { getPrisma } from "~/db.server";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "~/generated/prisma/client";

describe("getPrisma", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("constructs PrismaD1 with the db binding", () => {
    const mockDB = {} as D1Database;
    getPrisma(mockDB);
    expect(PrismaD1).toHaveBeenCalledWith(mockDB);
  });

  it("constructs PrismaClient with the adapter", () => {
    const mockDB = {} as D1Database;
    getPrisma(mockDB);
    expect(PrismaClient).toHaveBeenCalledWith(
      expect.objectContaining({ adapter: expect.objectContaining({ _db: mockDB }) })
    );
  });

  it("returns the PrismaClient instance", () => {
    const mockDB = {} as D1Database;
    const client = getPrisma(mockDB);
    expect(client).toBeDefined();
    expect(client).toHaveProperty("_opts");
  });
});
