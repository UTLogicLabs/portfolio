import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders the hero heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm Joshua");
  });

  test("has navigation links to all major sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /view projects/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /read blog/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get in touch/i })).toBeVisible();
  });

  test("projects link navigates to /projects", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /view projects/i }).click();
    await expect(page).toHaveURL("/projects");
  });

  test("blog link navigates to /blog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /read blog/i }).click();
    await expect(page).toHaveURL("/blog");
  });
});
