import { test, expect } from "@playwright/test";
import { mockTurnstile, waitForHydration } from "./helpers/turnstile";

const ADMIN_PASSWORD = "test-admin-password";

async function approveComment(page: import("@playwright/test").Page, bodyText: string) {
  await page.goto("/admin/comments");
  if (page.url().endsWith("/admin/login")) {
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /log in/i }).click();
    await expect(page).toHaveURL("/admin/comments");
  }

  const row = page.locator("li", { hasText: bodyText });
  await row.getByRole("button", { name: /approve/i }).click();
  await expect(row).not.toBeVisible();
}

test.describe("Blog post comments", () => {
  test.beforeEach(async ({ page }) => {
    await mockTurnstile(page);
    await page.goto("/blog/hello-world");
    await waitForHydration(page);
  });

  test("renders the comments section", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 2, name: "Comments" })).toBeVisible();
  });

  test("shows validation errors on empty submission", async ({ page }) => {
    await page.getByRole("button", { name: /post comment/i }).click();
    await expect(page.getByText("Name is required.")).toBeVisible();
    await expect(page.getByText(/valid email/i)).toBeVisible();
    await expect(page.getByText(/at least 3 characters/i)).toBeVisible();
  });

  test("a submitted comment is pending and not shown immediately", async ({ page }) => {
    const commentBody = `Playwright pending comment ${Date.now()}`;
    await page.getByLabel("Name").fill("Playwright Tester");
    await page.getByLabel("Email").fill("playwright@example.com");
    await page.getByLabel("Comment").fill(commentBody);
    await page.getByRole("button", { name: /post comment/i }).click();

    await expect(page.getByRole("status")).toContainText(/awaiting approval/i);
    await expect(page.getByText(commentBody)).not.toBeVisible();
  });

  test("an approved comment appears publicly, and an approved reply nests under it", async ({ page }) => {
    const commentBody = `Playwright approved comment ${Date.now()}`;
    await page.getByLabel("Name").fill("Playwright Tester");
    await page.getByLabel("Email").fill("playwright@example.com");
    await page.getByLabel("Comment").fill(commentBody);
    await page.getByRole("button", { name: /post comment/i }).click();
    await expect(page.getByRole("status")).toContainText(/awaiting approval/i);

    await approveComment(page, commentBody);

    await mockTurnstile(page);
    await page.goto("/blog/hello-world");
    await waitForHydration(page);
    await expect(page.getByText(commentBody)).toBeVisible();

    const replyBody = `Playwright reply ${Date.now()}`;
    const parentThread = page.locator("div", { hasText: commentBody }).last();
    await parentThread.getByRole("button", { name: /^reply$/i }).click();
    await parentThread.getByLabel("Name").fill("Reply Tester");
    await parentThread.getByLabel("Email").fill("reply@example.com");
    await parentThread.getByLabel("Comment").fill(replyBody);
    await parentThread.getByRole("button", { name: /post reply/i }).click();
    await expect(parentThread.getByRole("status")).toContainText(/awaiting approval/i);

    await approveComment(page, replyBody);

    await mockTurnstile(page);
    await page.goto("/blog/hello-world");
    await waitForHydration(page);
    const approvedParent = page.locator("div", { hasText: commentBody }).first();
    await expect(approvedParent.getByText(replyBody)).toBeVisible();
  });
});
