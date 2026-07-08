import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyTurnstile } from "~/services/turnstile.server";

describe("verifyTurnstile", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns true without calling fetch when no secret is configured", async () => {
    const result = await verifyTurnstile("token", undefined);
    expect(result).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns true when siteverify reports success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    } as Response);
    const result = await verifyTurnstile("token", "secret");
    expect(result).toBe(true);
  });

  it("returns false and logs when siteverify reports failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, "error-codes": ["invalid-input-response"] }),
    } as Response);
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await verifyTurnstile("token", "secret");
    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[turnstile] siteverify failed",
      ["invalid-input-response"]
    );
    consoleErrorSpy.mockRestore();
  });

  it("fails open (returns true) when the network request throws", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));
    const result = await verifyTurnstile("token", "secret");
    expect(result).toBe(true);
  });
});
