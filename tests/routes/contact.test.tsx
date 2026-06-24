import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import Contact, { action, meta } from "~/routes/contact";

const mockCreate = vi.fn().mockResolvedValue({});
vi.mock("~/db.server", () => ({
  getPrisma: vi.fn(() => ({
    contactSubmission: { create: mockCreate },
  })),
}));

// React Router v7 data() returns { type, data, init } rather than a Response
type DataResult<T> = { data: T; init: { status: number } };

const VALID_FIELDS = {
  name: "Josh",
  email: "josh@example.com",
  message: "Hello, this is a valid test message.",
  "cf-turnstile-response": "test-token",
};

function makeContext(overrides: Record<string, unknown> = {}) {
  return {
    cloudflare: {
      env: {
        portfolio_db: {} as D1Database,
        EMAIL: { send: vi.fn().mockResolvedValue(undefined) },
        TURNSTILE_SECRET_KEY: "test-secret",
        TURNSTILE_SITE_KEY: "test-site-key",
        ...overrides,
      },
      ctx: { waitUntil: vi.fn((p: Promise<unknown>) => p) } as unknown as ExecutionContext,
    },
  };
}

async function callAction(fields: Record<string, string>, contextOverrides?: Record<string, unknown>) {
  const formData = new FormData();
  for (const [k, v] of Object.entries(fields)) formData.set(k, v);
  const request = new Request("http://localhost/contact", { method: "POST", body: formData });
  return action({ request, context: makeContext(contextOverrides) as never, params: {} } as never);
}

describe("contact meta", () => {
  it("returns the page title", () => {
    const result = meta({ data: undefined as never, loaderData: undefined as never, params: {}, matches: [] as never[], location: {} as never });
    expect(result).toContainEqual({ title: "Contact — UTLogicLabs" });
  });
});

describe("contact action — Turnstile verification", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }));
  });

  it("returns 422 with form error when Turnstile verification fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    } as Response);

    const result = (await callAction(VALID_FIELDS)) as DataResult<{ errors: { form?: string } }>;
    expect(result.data.errors.form).toBeTruthy();
    expect(result.init.status).toBe(422);
  });

  it("sends email after successful DB write", async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    await callAction(VALID_FIELDS, { EMAIL: { send: mockSend } });
    expect(mockSend).toHaveBeenCalledOnce();
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "joshua.dix@utlogiclabs.com",
        subject: expect.stringContaining("Josh"),
      })
    );
  });
});

describe("contact action — validation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }));
  });

  it("returns 422 when name is missing", async () => {
    const result = (await callAction({ ...VALID_FIELDS, name: "" })) as DataResult<{ errors: { name?: string } }>;
    expect(result.data.errors.name).toBeTruthy();
    expect(result.init.status).toBe(422);
  });

  it("returns 422 when email is invalid", async () => {
    const result = (await callAction({ ...VALID_FIELDS, email: "not-an-email" })) as DataResult<{ errors: { email?: string } }>;
    expect(result.data.errors.email).toBeTruthy();
    expect(result.init.status).toBe(422);
  });

  it("returns 422 when message is too short", async () => {
    const result = (await callAction({ ...VALID_FIELDS, message: "hi" })) as DataResult<{ errors: { message?: string } }>;
    expect(result.data.errors.message).toBeTruthy();
    expect(result.init.status).toBe(422);
  });

  it("returns success when all fields are valid and db write succeeds", async () => {
    const result = (await callAction(VALID_FIELDS)) as { data: { success: boolean } };
    expect(result.data.success).toBe(true);
  });
});

// Component tests using createRoutesStub
describe("Contact component", () => {
  function makeStub(actionFn?: () => unknown) {
    return createRoutesStub([
      {
        path: "/contact",
        Component: Contact,
        loader: async () => ({ turnstileSiteKey: "test-site-key" }),
        ...(actionFn ? { action: actionFn } : {}),
      },
    ]);
  }

  it("renders the contact form", async () => {
    const Stub = makeStub();
    render(<Stub initialEntries={["/contact"]} />);
    expect(await screen.findByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("renders the Turnstile widget placeholder", async () => {
    const Stub = makeStub();
    const { container } = render(<Stub initialEntries={["/contact"]} />);
    await screen.findByRole("button", { name: /send message/i });
    expect(container.querySelector(".cf-turnstile")).toBeInTheDocument();
    expect(container.querySelector(".cf-turnstile")).toHaveAttribute("data-sitekey", "test-site-key");
  });

  it("shows validation errors returned by the action", async () => {
    const Stub = makeStub(async () => ({
      errors: { name: "Name is required.", email: undefined, message: undefined },
    }));
    render(<Stub initialEntries={["/contact"]} />);
    await userEvent.click(await screen.findByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByText("Name is required.")).toBeInTheDocument()
    );
  });

  it("shows form-level error when Turnstile fails", async () => {
    const Stub = makeStub(async () => ({
      errors: { form: "Bot check failed. Please try again." },
    }));
    render(<Stub initialEntries={["/contact"]} />);
    await userEvent.click(await screen.findByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/bot check failed/i)
    );
  });

  it("shows success message after successful submission", async () => {
    const Stub = makeStub(async () => ({ success: true }));
    render(<Stub initialEntries={["/contact"]} />);
    await userEvent.click(await screen.findByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/message sent/i)
    );
  });

  it("outer container uses max-w-4xl", async () => {
    const Stub = makeStub();
    const { container } = render(<Stub initialEntries={["/contact"]} />);
    await screen.findByRole("button", { name: /send message/i });
    expect(container.querySelector("main")!.className).toContain("max-w-4xl");
  });
});
