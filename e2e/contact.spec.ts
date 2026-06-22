import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
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
