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
    
    // Test navigation exists in the DOM (may be hidden on mobile)
    await expect(page.locator('nav a[href="#about"]')).toHaveCount(1);
    await expect(page.locator('nav a[href="#projects"]')).toHaveCount(1);
    await expect(page.locator('nav a[href="#contact"]')).toHaveCount(1);
    
    // Test navigation links are visible on desktop
    await page.setViewportSize({ width: 1024, height: 768 });
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

  test('should handle mobile navigation', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // On mobile, navigation links should be in the DOM but may be hidden
    await expect(page.locator('nav a[href="#about"]')).toHaveCount(1);
    
    // Check if there's a mobile menu toggle (if it exists)
    const mobileMenuToggle = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu-toggle"]');
    const mobileMenuExists = await mobileMenuToggle.count() > 0;
    
    if (mobileMenuExists) {
      await mobileMenuToggle.click();
      await expect(page.locator('nav a[href="#about"]')).toBeVisible();
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('.sm\\:text-6xl')).toBeVisible();
  });
});