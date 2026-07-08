import { useEffect, useRef, useState } from "react";

type TurnstileInstance = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': (errorCode: string) => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

let turnstileLoadPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  const w = window as unknown as { turnstile?: TurnstileInstance };
  if (w.turnstile) return Promise.resolve();
  if (turnstileLoadPromise) return turnstileLoadPromise;
  turnstileLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
  return turnstileLoadPromise;
}

export function useTurnstile(siteKey: string) {
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!siteKey) return;
    const w = window as unknown as { turnstile?: TurnstileInstance };
    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !turnstileRef.current) return;
      widgetIdRef.current = w.turnstile?.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: () => { setTurnstileReady(true); setTurnstileError(null); },
        'expired-callback': () => setTurnstileReady(false),
        'error-callback': (errorCode: string) => {
          console.error("[turnstile] widget error", errorCode);
          setTurnstileError("Bot verification failed. Please refresh the page and try again.");
        },
      });
    };

    loadTurnstileScript().then(renderWidget);

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== undefined) {
        (window as unknown as { turnstile?: TurnstileInstance }).turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [siteKey]);

  function resetTurnstile() {
    if (widgetIdRef.current !== undefined) {
      (window as unknown as { turnstile?: TurnstileInstance }).turnstile?.reset(widgetIdRef.current);
      setTurnstileReady(false);
    }
  }

  return { turnstileRef, turnstileReady, turnstileRequired: !!siteKey, turnstileError, resetTurnstile };
}
