import { expect, type Page } from "@playwright/test";

// Turnstile doesn't render in headless browsers without a real challenge flow.
// We intercept the script URL and return a shim that exposes window.turnstile
// with the same API the component calls. render() fires the callback immediately
// so turnstileReady flips to true and the submit button is enabled.
export async function mockTurnstile(page: Page) {
  await page.route("https://challenges.cloudflare.com/turnstile/**", (route) => {
    route.fulfill({
      contentType: "application/javascript",
      body: `
        (function() {
          window.turnstile = {
            render: function(el, opts) {
              var input = document.createElement('input');
              input.type = 'hidden';
              input.name = 'cf-turnstile-response';
              input.value = 'playwright-test-token';
              el.appendChild(input);
              if (opts && typeof opts.callback === 'function') {
                opts.callback('playwright-test-token');
              }
              return 'mock-widget-id';
            },
            remove: function() {},
            reset: function() {},
          };
        })();
      `,
    });
  });
}

// The blog post page's date renders differently on the server (UTC) vs. a
// browser in a non-UTC timezone, which forces a client-side hydration
// remount. Waiting for the mocked Turnstile widget's hidden input — only
// added by our client-only render() shim — confirms hydration has finished
// before a test starts filling in and submitting a form.
export async function waitForHydration(page: Page) {
  await expect(page.locator('input[name="cf-turnstile-response"]').first()).toBeAttached();
}
