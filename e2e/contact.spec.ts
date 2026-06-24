import { test, expect } from "@playwright/test";

// Turnstile doesn't render in headless browsers without real challenge flow.
// We intercept the script and inject a shim that immediately fills the hidden
// field, then use Cloudflare's always-pass test secret in .dev.vars so the
// server-side siteverify call accepts any token.
async function mockTurnstile(page: import("@playwright/test").Page) {
  await page.route("https://challenges.cloudflare.com/turnstile/**", (route) => {
    route.fulfill({
      contentType: "application/javascript",
      body: `
        (function() {
          function install() {
            document.querySelectorAll('.cf-turnstile').forEach(function(el) {
              if (el.dataset.turnstileInstalled) return;
              el.dataset.turnstileInstalled = '1';
              var input = document.createElement('input');
              input.type = 'hidden';
              input.name = 'cf-turnstile-response';
              input.value = 'playwright-test-token';
              el.appendChild(input);
              // Fire data-callback to unblock the submit button
              var cb = el.dataset.callback;
              if (cb && typeof window[cb] === 'function') window[cb]('playwright-test-token');
            });
          }
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', install);
          } else {
            install();
          }
        })();
      `,
    });
  });
}

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await mockTurnstile(page);
    await page.goto("/contact");
  });

  test("renders the contact form", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Get in Touch");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("shows validation errors on empty submission", async ({ page }) => {
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText("Name is required.")).toBeVisible();
    await expect(page.getByText(/valid email/i)).toBeVisible();
    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  });

  test("shows success message after valid submission", async ({ page }) => {
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Message").fill("This is a test message from Playwright.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).toContainText(/message sent/i);
  });
});
