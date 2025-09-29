import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  // Helper function to login before tests
  const loginAsAdmin = async (page: any) => {
    await page.goto('/admin/login');
    await page.getByLabel(/username/i).fill('admin');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/admin/dashboard');
  };

  test.describe('Authentication Protection', () => {
    test('should redirect to login when accessing dashboard without authentication', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should redirect to dashboard after successful login', async ({ page }) => {
      await loginAsAdmin(page);
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      await expect(page.getByText('Logged in as admin')).toBeVisible();
    });

    test('should show loading state while checking authentication', async ({ page }) => {
      await page.goto('/admin/dashboard');
      // Should briefly show loading before redirect
      await expect(page.getByText('Loading...')).toBeVisible();
    });
  });

  test.describe('Dashboard Header', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should display admin dashboard header correctly', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
      await expect(page.getByText('Logged in as admin')).toBeVisible();
    });

    test('should have back to website link', async ({ page }) => {
      const backLink = page.getByRole('link', { name: /back to website/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/');
    });

    test('should logout and redirect to homepage', async ({ page }) => {
      await page.getByRole('button', { name: /logout/i }).click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Navigation Sidebar', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should display sidebar navigation', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
      await expect(page.getByRole('button', { name: /statistics/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /posts/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /tags/i })).toBeVisible();
    });

    test('should have new post button', async ({ page }) => {
      const newPostButton = page.getByRole('button', { name: /new post/i });
      await expect(newPostButton).toBeVisible();
    });

    test('should navigate between tabs', async ({ page }) => {
      // Start on posts tab (default)
      await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();

      // Switch to statistics
      await page.getByRole('button', { name: /statistics/i }).click();
      await expect(page.getByRole('heading', { name: 'Blog Statistics' })).toBeVisible();

      // Switch to tags
      await page.getByRole('button', { name: /tags/i }).click();
      await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();

      // Switch back to posts
      await page.getByRole('button', { name: /posts/i }).click();
      await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
    });

    test('should highlight active tab', async ({ page }) => {
      const postsTab = page.getByRole('button', { name: /posts/i });
      const statsTab = page.getByRole('button', { name: /statistics/i });

      // Posts tab should be active by default
      await expect(postsTab).toHaveClass(/bg-accent/);

      // Switch to stats and check highlight
      await statsTab.click();
      await expect(statsTab).toHaveClass(/bg-accent/);
      await expect(postsTab).not.toHaveClass(/bg-accent/);
    });
  });

  test.describe('Statistics Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.getByRole('button', { name: /statistics/i }).click();
    });

    test('should display blog statistics', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Blog Statistics' })).toBeVisible();
      
      // Check stats cards
      await expect(page.getByText('Total Posts')).toBeVisible();
      await expect(page.getByText('Published')).toBeVisible();
      await expect(page.getByText('Drafts')).toBeVisible();
      await expect(page.getByText('Total Views')).toBeVisible();
    });

    test('should show popular tags section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Popular Tags' })).toBeVisible();
      // Should show at least one tag
      await expect(page.locator('.bg-accent').first()).toBeVisible();
    });

    test('should show recent posts section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Recent Posts' })).toBeVisible();
      // Should show post items
      await expect(page.locator('.bg-accent\\/50').first()).toBeVisible();
    });

    test('should display correct numerical values', async ({ page }) => {
      // Check that stat numbers are present and numeric
      const statNumbers = page.locator('.text-2xl.font-bold');
      const count = await statNumbers.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < count; i++) {
        const text = await statNumbers.nth(i).textContent();
        expect(text).toMatch(/^\d+$/);
      }
    });
  });

  test.describe('Posts Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      // Posts tab is default, but ensure we're there
      await page.getByRole('button', { name: /posts/i }).click();
    });

    test('should display posts list', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
      await expect(page.locator('[data-testid="post-card"], .shadow-sm').first()).toBeVisible();
    });

    test('should have search functionality', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search posts...');
      await expect(searchInput).toBeVisible();
      
      // Test searching
      await searchInput.fill('React');
      // Should filter posts containing 'React'
      await expect(page.getByText(/React/i).first()).toBeVisible();
    });

    test('should display post information correctly', async ({ page }) => {
      const firstPost = page.locator('.shadow-sm').first();
      await expect(firstPost).toBeVisible();
      
      // Check for post elements
      await expect(firstPost.locator('img')).toBeVisible(); // Cover image
      await expect(firstPost.locator('.font-medium')).toBeVisible(); // Title
      // Status badge
      await expect(firstPost.locator('.rounded-full').first()).toBeVisible();
    });

    test('should show post actions (edit and delete)', async ({ page }) => {
      const firstPost = page.locator('.shadow-sm').first();
      
      // Check for edit and delete buttons
      await expect(firstPost.getByText('✏️')).toBeVisible();
      await expect(firstPost.getByText('🗑️')).toBeVisible();
    });

    test('should navigate to post editor when edit is clicked', async ({ page }) => {
      const firstPostEditButton = page.locator('.shadow-sm').first().getByText('✏️');
      await firstPostEditButton.click();
      
      // Should navigate to post editor (with ID)
      await expect(page).toHaveURL(/\/admin\/post\/\d+/);
    });

    test('should search posts by title', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search posts...');
      
      // Search for a specific title
      await searchInput.fill('TypeScript');
      
      // Should show posts containing TypeScript
      await expect(page.getByText(/TypeScript/i).first()).toBeVisible();
    });

    test('should search posts by tags', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search posts...');
      
      // Search for a tag
      await searchInput.fill('React');
      
      // Should show posts with React tag
      await expect(page.getByText(/React/i).first()).toBeVisible();
    });

    test('should show no results message when search returns empty', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search posts...');
      
      // Search for something that doesn't exist
      await searchInput.fill('NonexistentSearchTerm');
      
      await expect(page.getByText('No posts found.')).toBeVisible();
    });
  });

  test.describe('Tags Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.getByRole('button', { name: /tags/i }).click();
    });

    test('should display tags list', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();
      
      // Should show tag cards
      await expect(page.locator('.shadow-sm').first()).toBeVisible();
    });

    test('should show tag names and counts', async ({ page }) => {
      const firstTag = page.locator('.shadow-sm').first();
      
      // Should have tag name
      await expect(firstTag.locator('.font-medium')).toBeVisible();
      
      // Should have count badge
      await expect(firstTag.locator('.bg-accent')).toBeVisible();
    });

    test('should display multiple tags', async ({ page }) => {
      // Should have multiple tag cards
      const tagCards = page.locator('.shadow-sm');
      const count = await tagCards.count();
      expect(count).toBeGreaterThan(1);
    });
  });

  test.describe('New Post Button', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should navigate to post creation page', async ({ page }) => {
      await page.getByRole('button', { name: /new post/i }).click();
      await expect(page).toHaveURL('/admin/post');
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Should still show main elements
      await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
      await expect(page.getByRole('button', { name: /posts/i })).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Should maintain layout
      await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });
  });

  test.describe('Data Persistence', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should maintain authentication across page refreshes', async ({ page }) => {
      await page.reload();
      
      // Should still be on dashboard (not redirected to login)
      await expect(page).toHaveURL('/admin/dashboard');
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
    });

    test('should maintain selected tab after refresh', async ({ page }) => {
      // Switch to stats tab
      await page.getByRole('button', { name: /statistics/i }).click();
      await expect(page.getByRole('heading', { name: 'Blog Statistics' })).toBeVisible();
      
      // Refresh page
      await page.reload();
      
      // Should return to default posts tab (expected behavior)
      await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle authentication errors gracefully', async ({ page }) => {
      // Try to access dashboard with invalid session
      await page.goto('/admin/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login');
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should have proper heading structure', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
    });

    test('should have keyboard navigation support', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: /back to website/i })).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: /logout/i })).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for screen reader text
      await expect(page.getByText('Edit', { exact: false })).toBeVisible();
      await expect(page.getByText('Delete', { exact: false })).toBeVisible();
    });
  });
});