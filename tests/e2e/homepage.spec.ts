import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the main hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check if the hero section is visible
    await expect(page.locator('h2')).toContainText('Full Stack Developer');
    await expect(page.locator('text=Building modern web applications')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    await expect(page.locator('nav a[href="#about"]')).toBeVisible();
    await expect(page.locator('nav a[href="#projects"]')).toBeVisible();
    await expect(page.locator('nav a[href="#contact"]')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Find the theme toggle button
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();
    
    // Click to toggle theme
    await themeToggle.click();
    
    // Check if dark class is applied
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('.sm\\:text-6xl')).toBeVisible();
  });
});