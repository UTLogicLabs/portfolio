import type { ComponentProps } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, useActionData } from "react-router";
import CommentForm from "~/components/CommentForm";

describe("CommentForm", () => {
  let capturedComplete: (() => void) | undefined;

  function installTurnstile() {
    (window as unknown as Record<string, unknown>).turnstile = {
      render: (_el: HTMLElement, opts: { callback: () => void }) => {
        capturedComplete = opts.callback;
        return "widget-1";
      },
      remove: vi.fn(),
      reset: vi.fn(),
    };
  }

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).turnstile;
    capturedComplete = undefined;
  });

  function TestWrapper(props: Partial<ComponentProps<typeof CommentForm>>) {
    const actionData = useActionData<{ success?: boolean; errors?: ComponentProps<typeof CommentForm>["errors"] }>();
    return (
      <CommentForm
        turnstileSiteKey="test-site-key"
        {...props}
        success={props.success ?? actionData?.success}
        errors={props.errors ?? actionData?.errors}
      />
    );
  }

  function makeStub(props: Partial<ComponentProps<typeof CommentForm>> = {}, actionFn?: () => unknown) {
    return createRoutesStub([
      {
        path: "/post",
        Component: () => <TestWrapper {...props} />,
        ...(actionFn ? { action: actionFn } : {}),
      },
    ]);
  }

  it("renders name, email, and comment fields", async () => {
    installTurnstile();
    const Stub = makeStub();
    render(<Stub initialEntries={["/post"]} />);
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
  });

  it("renders a hidden parentId field when parentId is provided", async () => {
    installTurnstile();
    const Stub = makeStub({ parentId: "parent-1" });
    const { container } = render(<Stub initialEntries={["/post"]} />);
    await screen.findByLabelText(/name/i);
    const hidden = container.querySelector('input[name="parentId"]');
    expect(hidden).toHaveValue("parent-1");
  });

  it("submit button is disabled until Turnstile completes", async () => {
    installTurnstile();
    const Stub = makeStub();
    render(<Stub initialEntries={["/post"]} />);
    const button = await screen.findByRole("button", { name: /post comment/i });
    expect(button).toBeDisabled();
    act(() => capturedComplete?.());
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it("shows field-level validation errors from props", async () => {
    installTurnstile();
    const Stub = makeStub({ errors: { name: "Name is required." } });
    render(<Stub initialEntries={["/post"]} />);
    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
  });

  it("shows a form-level error", async () => {
    installTurnstile();
    const Stub = makeStub({ errors: { form: "Bot check failed. Please try again." } });
    render(<Stub initialEntries={["/post"]} />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/bot check failed/i);
  });

  it("shows a success message when success is true", async () => {
    installTurnstile();
    const Stub = makeStub({ success: true });
    render(<Stub initialEntries={["/post"]} />);
    expect(await screen.findByRole("status")).toHaveTextContent(/awaiting approval/i);
  });

  it("calls onSuccess and resets the form after a successful submission", async () => {
    installTurnstile();
    const onSuccess = vi.fn();
    const actionFn = vi.fn().mockResolvedValue({ success: true });
    const Stub = makeStub({ onSuccess }, actionFn);
    render(<Stub initialEntries={["/post"]} />);
    const button = await screen.findByRole("button", { name: /post comment/i });
    act(() => capturedComplete?.());
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
