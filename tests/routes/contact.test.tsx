import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import Contact, { action, meta } from "~/routes/contact";

vi.mock("~/db.server", () => ({
  getPrisma: vi.fn(() => ({
    contactSubmission: { create: vi.fn().mockResolvedValue({}) },
  })),
}));

// React Router v7 data() returns { type, data, init } rather than a Response
type DataResult<T> = { data: T; init: { status: number } };

describe("contact meta", () => {
  it("returns the page title", () => {
    const result = meta({ data: undefined as never, loaderData: undefined as never, params: {}, matches: [] as never[], location: {} as never });
    expect(result).toContainEqual({ title: "Contact — Joshua Dix" });
  });
});

// Unit tests for the action (validation logic)
describe("contact action — validation", () => {
  async function callAction(fields: Record<string, string>) {
    const formData = new FormData();
    for (const [k, v] of Object.entries(fields)) formData.set(k, v);

    const request = new Request("http://localhost/contact", {
      method: "POST",
      body: formData,
    });

    const mockDB = {} as D1Database;
    const mockContext = { cloudflare: { env: { DB: mockDB }, ctx: {} as ExecutionContext } };

    return action({ request, context: mockContext as never, params: {} } as never);
  }

  it("returns 422 when name is missing", async () => {
    const result = (await callAction({ name: "", email: "a@b.com", message: "hello world!" })) as DataResult<{ errors: { name?: string } }>;
    expect(result.data.errors.name).toBeTruthy();
    expect(result.init.status).toBe(422);
  });

  it("returns 422 when email is invalid", async () => {
    const result = (await callAction({ name: "Josh", email: "not-an-email", message: "hello world!" })) as DataResult<{ errors: { email?: string } }>;
    expect(result.data.errors.email).toBeTruthy();
    expect(result.init.status).toBe(422);
  });

  it("returns 422 when message is too short", async () => {
    const result = (await callAction({ name: "Josh", email: "a@b.com", message: "hi" })) as DataResult<{ errors: { message?: string } }>;
    expect(result.data.errors.message).toBeTruthy();
    expect(result.init.status).toBe(422);
  });

  it("returns success when all fields are valid and db write succeeds", async () => {
    const result = (await callAction({
      name: "Josh",
      email: "josh@example.com",
      message: "Hello, this is a valid test message.",
    })) as { data: { success: boolean } };
    expect(result.data.success).toBe(true);
  });
});

// Component tests using createRoutesStub
describe("Contact component", () => {
  it("renders the contact form", () => {
    const Stub = createRoutesStub([
      { path: "/contact", Component: Contact },
    ]);
    render(<Stub initialEntries={["/contact"]} />);
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation errors returned by the action", async () => {
    const Stub = createRoutesStub([
      {
        path: "/contact",
        Component: Contact,
        action: async () => ({
          errors: { name: "Name is required.", email: undefined, message: undefined },
        }),
      },
    ]);
    render(<Stub initialEntries={["/contact"]} />);
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByText("Name is required.")).toBeInTheDocument()
    );
  });

  it("shows success message after successful submission", async () => {
    const Stub = createRoutesStub([
      {
        path: "/contact",
        Component: Contact,
        action: async () => ({ success: true }),
      },
    ]);
    render(<Stub initialEntries={["/contact"]} />);
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/message sent/i)
    );
  });
});
