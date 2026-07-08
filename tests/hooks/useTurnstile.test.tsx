import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, waitFor } from "@testing-library/react";
import { useTurnstile } from "~/hooks/useTurnstile";

describe("useTurnstile", () => {
  let capturedCallback: (() => void) | undefined;
  let capturedExpired: (() => void) | undefined;
  let capturedError: ((code: string) => void) | undefined;
  let mockRemove: ReturnType<typeof vi.fn>;
  let mockReset: ReturnType<typeof vi.fn>;
  let latest: ReturnType<typeof useTurnstile> | undefined;

  function TestComponent({ siteKey }: { siteKey: string }) {
    const hook = useTurnstile(siteKey);
    latest = hook;
    return <div ref={hook.turnstileRef} data-testid="widget" />;
  }

  function installTurnstile() {
    mockRemove = vi.fn();
    mockReset = vi.fn();
    (window as unknown as Record<string, unknown>).turnstile = {
      render: (_el: HTMLElement, opts: {
        callback: () => void;
        'expired-callback': () => void;
        'error-callback': (code: string) => void;
      }) => {
        capturedCallback = opts.callback;
        capturedExpired = opts['expired-callback'];
        capturedError = opts['error-callback'];
        return "widget-1";
      },
      remove: mockRemove,
      reset: mockReset,
    };
  }

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).turnstile;
    capturedCallback = undefined;
    capturedExpired = undefined;
    capturedError = undefined;
    latest = undefined;
  });

  it("does not render a widget when siteKey is empty", () => {
    installTurnstile();
    render(<TestComponent siteKey="" />);
    expect(latest?.turnstileReady).toBe(false);
    expect(capturedCallback).toBeUndefined();
  });

  it("becomes ready once the widget callback fires", async () => {
    installTurnstile();
    render(<TestComponent siteKey="site-key" />);
    await waitFor(() => expect(capturedCallback).toBeDefined());
    act(() => capturedCallback?.());
    await waitFor(() => expect(latest?.turnstileReady).toBe(true));
  });

  it("sets an error message when the widget error callback fires", async () => {
    installTurnstile();
    render(<TestComponent siteKey="site-key" />);
    await waitFor(() => expect(capturedError).toBeDefined());
    act(() => capturedError?.("some-error"));
    await waitFor(() =>
      expect(latest?.turnstileError).toMatch(/bot verification failed/i)
    );
  });

  it("becomes not-ready when the widget expires", async () => {
    installTurnstile();
    render(<TestComponent siteKey="site-key" />);
    await waitFor(() => expect(capturedCallback).toBeDefined());
    act(() => capturedCallback?.());
    await waitFor(() => expect(latest?.turnstileReady).toBe(true));
    act(() => capturedExpired?.());
    await waitFor(() => expect(latest?.turnstileReady).toBe(false));
  });

  it("resetTurnstile calls the widget's reset and clears ready state", async () => {
    installTurnstile();
    render(<TestComponent siteKey="site-key" />);
    await waitFor(() => expect(capturedCallback).toBeDefined());
    act(() => capturedCallback?.());
    await waitFor(() => expect(latest?.turnstileReady).toBe(true));
    act(() => latest?.resetTurnstile());
    expect(mockReset).toHaveBeenCalledWith("widget-1");
    expect(latest?.turnstileReady).toBe(false);
  });

  it("removes the widget on unmount", async () => {
    installTurnstile();
    const { unmount } = render(<TestComponent siteKey="site-key" />);
    await waitFor(() => expect(capturedCallback).toBeDefined());
    unmount();
    expect(mockRemove).toHaveBeenCalledWith("widget-1");
  });
});
