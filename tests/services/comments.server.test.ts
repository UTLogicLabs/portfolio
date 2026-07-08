import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitComment } from "~/services/comments.server";
import type { CloudflareEnv } from "~/types/env";

const mockCreate = vi.fn().mockResolvedValue({});
const mockFindUnique = vi.fn();
vi.mock("~/db.server", () => ({
  getPrisma: vi.fn(() => ({
    comment: { create: mockCreate, findUnique: mockFindUnique },
  })),
}));

const { mockEmailSend } = vi.hoisted(() => ({
  mockEmailSend: vi.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null }),
}));
vi.mock("resend", () => ({
  Resend: vi.fn(function MockResend(this: { emails: { send: typeof mockEmailSend } }) {
    this.emails = { send: mockEmailSend };
  }),
}));

function makeEnv(overrides: Partial<CloudflareEnv> = {}): CloudflareEnv {
  return {
    portfolio_db: {} as D1Database,
    RESEND_API_KEY: "re_test_key",
    TURNSTILE_SECRET_KEY: "test-secret",
    TURNSTILE_SITE_KEY: "test-site-key",
    SITE_URL: "https://utlogiclabs.com",
    ...overrides,
  };
}

const VALID_INPUT = {
  targetType: "BLOG_POST" as const,
  targetSlug: "hello-world",
  name: "Josh",
  email: "josh@example.com",
  body: "This is a valid comment.",
  turnstileToken: "test-token",
};

describe("submitComment — Turnstile", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockEmailSend.mockClear();
    mockFindUnique.mockReset();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }));
  });

  it("returns a form error when Turnstile verification fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    } as Response);
    const result = await submitComment(VALID_INPUT, makeEnv());
    expect(result.errors?.form).toBeTruthy();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("includes the submitted parentId in the result even when Turnstile verification fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    } as Response);
    const result = await submitComment({ ...VALID_INPUT, parentId: "parent-1" }, makeEnv());
    expect(result.parentId).toBe("parent-1");
  });
});

describe("submitComment — validation", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockEmailSend.mockClear();
    mockFindUnique.mockReset();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }));
  });

  it("returns an error when name is missing", async () => {
    const result = await submitComment({ ...VALID_INPUT, name: "" }, makeEnv());
    expect(result.errors?.name).toBeTruthy();
  });

  it("includes parentId: null in the result for a top-level validation error", async () => {
    const result = await submitComment({ ...VALID_INPUT, name: "" }, makeEnv());
    expect(result.parentId).toBeNull();
  });

  it("returns an error when email is invalid", async () => {
    const result = await submitComment({ ...VALID_INPUT, email: "not-an-email" }, makeEnv());
    expect(result.errors?.email).toBeTruthy();
  });

  it("returns an error when body is too short", async () => {
    const result = await submitComment({ ...VALID_INPUT, body: "hi" }, makeEnv());
    expect(result.errors?.body).toBeTruthy();
  });

  it("creates the comment as unapproved on valid input", async () => {
    const result = await submitComment(VALID_INPUT, makeEnv());
    expect(result.success).toBe(true);
    expect(result.parentId).toBeNull();
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        targetType: "BLOG_POST",
        targetSlug: "hello-world",
        name: "Josh",
        email: "josh@example.com",
        body: "This is a valid comment.",
        parentId: null,
      }),
    });
  });

  it("returns a form error when parentId points to a comment on a different target", async () => {
    mockFindUnique.mockResolvedValue({
      id: "parent-1",
      targetType: "BLOG_POST",
      targetSlug: "some-other-post",
    });
    const result = await submitComment({ ...VALID_INPUT, parentId: "parent-1" }, makeEnv());
    expect(result.errors?.form).toBeTruthy();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns a form error when parentId does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await submitComment({ ...VALID_INPUT, parentId: "missing" }, makeEnv());
    expect(result.errors?.form).toBeTruthy();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("creates a reply when parentId matches the same target", async () => {
    mockFindUnique.mockResolvedValue({
      id: "parent-1",
      targetType: "BLOG_POST",
      targetSlug: "hello-world",
    });
    const result = await submitComment({ ...VALID_INPUT, parentId: "parent-1" }, makeEnv());
    expect(result.success).toBe(true);
    expect(result.parentId).toBe("parent-1");
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ parentId: "parent-1" }),
    });
  });
});

describe("submitComment — notification email", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockEmailSend.mockClear();
    mockFindUnique.mockReset();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }));
  });

  it("sends an admin notification email after a successful submission", async () => {
    await submitComment(VALID_INPUT, makeEnv());
    expect(mockEmailSend).toHaveBeenCalledOnce();
    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "joshua.dix@utlogiclabs.com",
        subject: expect.stringContaining("Josh"),
      })
    );
  });

  it("escapes HTML-unsafe characters in the notification email", async () => {
    await submitComment(
      { ...VALID_INPUT, name: "<script>alert(1)</script>", body: "Hello & <b>world</b>" },
      makeEnv()
    );
    const sentArgs = mockEmailSend.mock.calls[0][0];
    expect(sentArgs.html).not.toContain("<script>alert(1)</script>");
    expect(sentArgs.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("builds an absolute admin review link using SITE_URL", async () => {
    await submitComment(VALID_INPUT, makeEnv());
    const sentArgs = mockEmailSend.mock.calls[0][0];
    expect(sentArgs.text).toContain("https://utlogiclabs.com/admin/comments");
    expect(sentArgs.html).toContain('href="https://utlogiclabs.com/admin/comments"');
  });

  it("falls back to a relative link when SITE_URL is unset", async () => {
    await submitComment(VALID_INPUT, makeEnv({ SITE_URL: undefined }));
    const sentArgs = mockEmailSend.mock.calls[0][0];
    expect(sentArgs.text).toContain("Review at /admin/comments");
    expect(sentArgs.html).toContain('href="/admin/comments"');
  });

  it("does not send an email when RESEND_API_KEY is unset", async () => {
    await submitComment(VALID_INPUT, makeEnv({ RESEND_API_KEY: undefined }));
    expect(mockEmailSend).not.toHaveBeenCalled();
  });

  it("logs an error and still returns success when the email send fails", async () => {
    mockEmailSend.mockRejectedValueOnce(new Error("send failed"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await submitComment(VALID_INPUT, makeEnv());
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[resend] failed to send comment notification email",
      expect.any(Error)
    );
    expect(result.success).toBe(true);
    consoleErrorSpy.mockRestore();
  });
});
