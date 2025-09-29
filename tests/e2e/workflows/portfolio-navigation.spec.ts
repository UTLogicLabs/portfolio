import { test, expect } from '@playwright/test';

test.describe('Portfolio Navigation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate through main portfolio sections', async ({ page }) => {
    // Test home page loads
    await expect(page.locator('h1, h2, [data-testid="hero"]')).toBeVisible({ timeout: 10000 });
    
    // Look for navigation elements
    const navElements = page.locator('nav a, header a, [role="navigation"] a');
    const navCount = await navElements.count();
    
    if (navCount > 0) {
      // Test that navigation links exist and are accessible
      for (let i = 0; i < Math.min(navCount, 5); i++) {
        const navLink = navElements.nth(i);
        if (await navLink.isVisible()) {
          await expect(navLink).toHaveAttribute('href');
        }
      }
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('main')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('main')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should have accessible content', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
    
    // Check for semantic HTML elements
    const mainContent = page.locator('main, [role="main"]');
    if (await mainContent.count() > 0) {
      await expect(mainContent.first()).toBeVisible();
    }
    
    // Check for skip links or other accessibility features
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toHaveText(/skip/i);
    }
  });
});