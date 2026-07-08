import { test, expect } from "@playwright/test";
import { mockTurnstile, waitForHydration } from "./helpers/turnstile";

const ADMIN_PASSWORD = "test-admin-password";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL("/admin/comments");
}

test.describe("Admin auth", () => {
  test("redirects to /admin/login when visiting the moderation queue unauthenticated", async ({ page }) => {
    await page.goto("/admin/comments");
    await expect(page).toHaveURL("/admin/login");
  });

  test("shows an error for the wrong password and stays on the login page", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: /log in/i }).click();
    await expect(page.getByRole("alert")).toContainText(/invalid password/i);
    await expect(page).toHaveURL("/admin/login");
  });

  test("logs in with the correct password and reaches the moderation queue", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { level: 1, name: "Pending Comments" })).toBeVisible();
  });
});

test.describe("Admin moderation queue", () => {
  test("approving a pending comment removes it from the queue and publishes it", async ({ page }) => {
    const commentBody = `Playwright admin approve ${Date.now()}`;

    await mockTurnstile(page);
    await page.goto("/blog/hello-world");
    await waitForHydration(page);
    await page.getByLabel("Name").fill("Admin Test");
    await page.getByLabel("Email").fill("admin-test@example.com");
    await page.getByLabel("Comment").fill(commentBody);
    await page.getByRole("button", { name: /post comment/i }).click();
    await expect(page.getByRole("status")).toContainText(/awaiting approval/i);

    await login(page);
    const row = page.locator("li", { hasText: commentBody });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: /approve/i }).click();
    await expect(row).not.toBeVisible();

    await page.goto("/blog/hello-world");
    await expect(page.getByText(commentBody)).toBeVisible();
  });

  test("rejecting a pending comment removes it from the queue permanently", async ({ page }) => {
    const commentBody = `Playwright admin reject ${Date.now()}`;

    await mockTurnstile(page);
    await page.goto("/blog/hello-world");
    await waitForHydration(page);
    await page.getByLabel("Name").fill("Admin Test");
    await page.getByLabel("Email").fill("admin-test@example.com");
    await page.getByLabel("Comment").fill(commentBody);
    await page.getByRole("button", { name: /post comment/i }).click();
    await expect(page.getByRole("status")).toContainText(/awaiting approval/i);

    await login(page);
    const row = page.locator("li", { hasText: commentBody });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: /reject/i }).click();
    await expect(row).not.toBeVisible();

    await page.goto("/blog/hello-world");
    await expect(page.getByText(commentBody)).not.toBeVisible();
  });
});
