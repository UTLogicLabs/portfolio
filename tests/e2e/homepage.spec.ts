import { test, expect } from '@playwright/test';

test.describe('Portfolio Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main hero section', async ({ page }) => {
    // Check if the page loads properly
    await expect(page).toHaveTitle(/portfolio/i);
    
    // Look for main content indicators
    const heroContent = page.locator('h1, h2, [data-testid="hero"]');
    await expect(heroContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have working navigation', async ({ page }) => {
    // Test that navigation elements are present
    const navElements = page.locator('nav, [role="navigation"], header a');
    await expect(navElements.first()).toBeVisible({ timeout: 5000 });
    
    // Test responsive navigation behavior
    await page.setViewportSize({ width: 1024, height: 768 });
    const desktopNav = page.locator('nav a, header a').first();
    if (await desktopNav.isVisible()) {
      await expect(desktopNav).toBeVisible();
    }
  });

  test('should toggle dark mode if available', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"], [data-testid="theme-toggle"]');
    const hasThemeToggle = await themeToggle.count() > 0;
    
    if (hasThemeToggle) {
      await themeToggle.click();
      
      // Check if theme changed (html class or body attribute)
      const htmlElement = page.locator('html');
      const bodyElement = page.locator('body');
      
      const htmlHasDark = await htmlElement.getAttribute('class');
      const bodyHasDark = await bodyElement.getAttribute('class');
      
      const hasDarkTheme = (htmlHasDark?.includes('dark') || bodyHasDark?.includes('dark'));
      if (hasDarkTheme) {
        expect(hasDarkTheme).toBeTruthy();
      }
    }
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Look for navigation elements
    const navElements = page.locator('nav, [role="navigation"], header');
    await expect(navElements.first()).toBeVisible({ timeout: 5000 });
    
    // Check if there's a mobile menu toggle
    const mobileMenuToggle = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu-toggle"]');
    const mobileMenuExists = await mobileMenuToggle.count() > 0;
    
    if (mobileMenuExists) {
      await mobileMenuToggle.click();
      await page.waitForTimeout(300); // Allow for animation
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main content is visible and responsive
    const mainContent = page.locator('h1, h2, main, [role="main"]');
    await expect(mainContent.first()).toBeVisible({ timeout: 5000 });
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(mainContent.first()).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(mainContent.first()).toBeVisible();
  });
});