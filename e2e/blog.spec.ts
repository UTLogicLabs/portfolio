import { test, expect } from "@playwright/test";

const CANONICAL_SLUG = "2026-06-21-hello-world";
const LEGACY_SLUG = "hello-world"; // pre-rename short URL, still supported via fallback

test.describe("Blog", () => {
  test("blog index renders the post list", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Blog");
    // The sample post should appear
    await expect(page.getByText("Hello, World")).toBeVisible();
  });

  test("clicking a post navigates to its detail page", async ({ page }) => {
    await page.goto("/blog");
    await page.getByText("Hello, World").click();
    await expect(page).toHaveURL(`/blog/${CANONICAL_SLUG}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hello, World");
  });

  test("blog post detail renders the content", async ({ page }) => {
    await page.goto(`/blog/${LEGACY_SLUG}`);
    await expect(page.getByRole("article")).toBeVisible();
  });

  test("404 for non-existent slug", async ({ page }) => {
    const response = await page.goto("/blog/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Blog post sidebar", () => {
  test("sidebar is not visible on the blog index", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("navigation", { name: "Posts" })).not.toBeVisible();
  });

  test("sidebar is visible on a blog post page", async ({ page }) => {
    await page.goto(`/blog/${LEGACY_SLUG}`);
    await expect(page.getByRole("navigation", { name: "Posts" })).toBeVisible();
  });

  test("sidebar lists blog posts", async ({ page }) => {
    await page.goto(`/blog/${LEGACY_SLUG}`);
    await expect(
      page.getByRole("navigation", { name: "Posts" }).getByRole("link", { name: "Hello, World" })
    ).toBeVisible();
  });

  test("active post link is visually distinguished", async ({ page }) => {
    await page.goto(`/blog/${CANONICAL_SLUG}`);
    const activeLink = page
      .getByRole("navigation", { name: "Posts" })
      .getByRole("link", { name: "Hello, World" });
    await expect(activeLink).toHaveClass(/font-medium/);
  });

  test("clicking a sidebar link navigates to that post", async ({ page }) => {
    await page.goto(`/blog/${CANONICAL_SLUG}`);
    await page
      .getByRole("navigation", { name: "Posts" })
      .getByRole("link", { name: "Hello, World" })
      .click();
    await expect(page).toHaveURL(`/blog/${CANONICAL_SLUG}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Hello, World"
    );
  });
});
