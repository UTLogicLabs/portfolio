import { test, expect } from "@playwright/test";

test.describe("Projects", () => {
  test("projects index renders the project list", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Projects");
    await expect(page.getByText("This Portfolio")).toBeVisible();
  });

  test("clicking a project navigates to its detail page", async ({ page }) => {
    await page.goto("/projects");
    await page.getByText("This Portfolio").click();
    await expect(page).toHaveURL("/projects/portfolio");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("This Portfolio");
  });

  test("project detail page renders the content", async ({ page }) => {
    await page.goto("/projects/portfolio");
    await expect(page.getByRole("article")).toBeVisible();
  });

  test("404 for non-existent slug", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
