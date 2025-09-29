import { test, expect } from '@playwright/test';

test.describe('Admin System Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Complete Authentication Flow', () => {
    test('should complete full login to dashboard workflow', async ({ page }) => {
      // Start from login page
      await page.goto('/admin/login');
      
      // Verify we're on login page
      await expect(page.getByText('Admin Login')).toBeVisible();
      
      // Login with valid credentials
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/admin/dashboard');
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      
      // Should show user info
      await expect(page.getByText('Logged in as admin')).toBeVisible();
      
      // Should show logout button
      await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
    });

    test('should complete full logout workflow', async ({ page }) => {
      // Login first
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Logout
      await page.getByRole('button', { name: /logout/i }).click();
      
      // Should redirect to homepage
      await expect(page).toHaveURL('/');
      
      // Trying to access dashboard should redirect to login
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should maintain authentication across pages', async ({ page }) => {
      // Login
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Navigate to post editor
      await page.goto('/admin/post');
      await expect(page.getByText(/create.*post/i)).toBeVisible();
      
      // Navigate back to dashboard
      await page.goto('/admin/dashboard');
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      
      // Should still be authenticated
      await expect(page.getByText('Logged in as admin')).toBeVisible();
    });
  });

  test.describe('Protected Route Integration', () => {
    test('should protect dashboard from unauthenticated access', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should protect post editor from unauthenticated access', async ({ page }) => {
      await page.goto('/admin/post');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should protect specific post edit from unauthenticated access', async ({ page }) => {
      await page.goto('/admin/post/123');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should allow authenticated access to all admin routes', async ({ page }) => {
      // Login first
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Test dashboard access
      await page.goto('/admin/dashboard');
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      
      // Test post editor access
      await page.goto('/admin/post');
      await expect(page.getByText(/create.*post/i)).toBeVisible();
      
      // Test specific post edit access (would show edit form or 404)
      await page.goto('/admin/post/1');
      // Should not redirect to login
      await expect(page).not.toHaveURL('/admin/login');
    });
  });

  test.describe('Dashboard and Blog Store Integration', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should show consistent data across dashboard tabs', async ({ page }) => {
      // Check Statistics tab
      await page.getByRole('tab', { name: /statistics/i }).click();
      const totalPostsText = await page.locator('[data-testid="stat-total-posts"]').textContent();
      const totalPosts = totalPostsText ? parseInt(totalPostsText) : 0;
      
      // Check Posts tab
      await page.getByRole('tab', { name: /posts/i }).click();
      const postRows = page.locator('[data-testid="post-row"]');
      const actualPostCount = await postRows.count();
      
      // Counts should match
      expect(actualPostCount).toBe(totalPosts);
    });

    test('should update statistics after post operations', async ({ page }) => {
      // Get initial statistics
      await page.getByRole('tab', { name: /statistics/i }).click();
      const initialTotalText = await page.locator('[data-testid="stat-total-posts"]').textContent();
      const initialTotal = initialTotalText ? parseInt(initialTotalText) : 0;
      
      // Create a new post
      await page.getByRole('tab', { name: /posts/i }).click();
      await page.getByRole('button', { name: /create new post/i }).click();
      
      // Fill out the form
      await page.getByLabel(/title/i).fill('Integration Test Post');
      await page.getByLabel(/content/i).fill('This post was created during integration testing.');
      await page.getByLabel(/excerpt/i).fill('Integration test excerpt');
      await page.getByLabel(/tags/i).fill('test,integration');
      
      // Save the post
      await page.getByRole('button', { name: /save.*post/i }).click();
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Check that statistics updated
      await page.getByRole('tab', { name: /statistics/i }).click();
      const newTotalText = await page.locator('[data-testid="stat-total-posts"]').textContent();
      const newTotal = newTotalText ? parseInt(newTotalText) : 0;
      
      expect(newTotal).toBe(initialTotal + 1);
    });

    test('should maintain search state during tab navigation', async ({ page }) => {
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Perform a search
      const searchInput = page.getByPlaceholder(/search posts/i);
      await searchInput.fill('React');
      await page.waitForTimeout(500);
      
      // Note the search results
      const searchResults = page.locator('[data-testid="post-row"]');
      const searchCount = await searchResults.count();
      
      // Switch to another tab and back
      await page.getByRole('tab', { name: /statistics/i }).click();
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Search should be maintained
      await expect(searchInput).toHaveValue('React');
      const maintainedResults = page.locator('[data-testid="post-row"]');
      const maintainedCount = await maintainedResults.count();
      
      expect(maintainedCount).toBe(searchCount);
    });
  });

  test.describe('Post Editor Integration', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should create post and see it in dashboard', async ({ page }) => {
      // Go to post editor
      await page.goto('/admin/post');
      
      // Create a post
      const postTitle = 'Integration Test Post ' + Date.now();
      await page.getByLabel(/title/i).fill(postTitle);
      await page.getByLabel(/content/i).fill('Content for integration test post.');
      await page.getByLabel(/excerpt/i).fill('Test excerpt');
      await page.getByLabel(/tags/i).fill('integration,test');
      
      // Save and redirect to dashboard
      await page.getByRole('button', { name: /save.*post/i }).click();
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Check that post appears in Posts tab
      await page.getByRole('tab', { name: /posts/i }).click();
      await expect(page.getByText(postTitle)).toBeVisible();
    });

    test('should edit existing post and see changes', async ({ page }) => {
      // Go to Posts tab
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Get the first post's title
      const originalTitle = await page.locator('[data-testid="post-row"]').first()
        .locator('[data-testid="post-title"]').textContent();
      
      // Edit the first post
      await page.locator('[data-testid="edit-post-btn"]').first().click();
      
      // Change the title
      const newTitle = 'Edited ' + originalTitle + ' ' + Date.now();
      const titleInput = page.getByLabel(/title/i);
      await titleInput.clear();
      await titleInput.fill(newTitle);
      
      // Save changes
      await page.getByRole('button', { name: /save.*post/i }).click();
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Check that changes appear in dashboard
      await page.getByRole('tab', { name: /posts/i }).click();
      await expect(page.getByText(newTitle)).toBeVisible();
      if (originalTitle) {
        await expect(page.getByText(originalTitle)).not.toBeVisible();
      }
    });

    test('should navigate between create and edit modes correctly', async ({ page }) => {
      // Start with create mode
      await page.goto('/admin/post');
      await expect(page.getByText(/create.*post/i)).toBeVisible();
      
      // Go back to dashboard
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Edit an existing post
      await page.locator('[data-testid="edit-post-btn"]').first().click();
      await expect(page.getByText(/edit.*post/i)).toBeVisible();
      
      // The form should be populated with existing data
      const titleInput = page.getByLabel(/title/i);
      const titleValue = await titleInput.inputValue();
      expect(titleValue).toBeTruthy();
      expect(titleValue.length).toBeGreaterThan(0);
    });
  });

  test.describe('Error Handling Integration', () => {
    test('should handle login errors gracefully', async ({ page }) => {
      await page.goto('/admin/login');
      
      // Try with wrong credentials
      await page.getByLabel(/username/i).fill('wrong');
      await page.getByLabel(/password/i).fill('credentials');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Should show error and stay on login page
      await expect(page.getByText('Invalid username or password')).toBeVisible();
      await expect(page).toHaveURL('/admin/login');
      
      // Should be able to try again
      await page.getByLabel(/username/i).clear();
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).clear();
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Should succeed
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should handle navigation to non-existent posts', async ({ page }) => {
      // Login first
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Try to edit non-existent post
      await page.goto('/admin/post/99999');
      
      // Should handle gracefully (could show error or redirect)
      // The exact behavior depends on implementation
      await expect(page).not.toHaveURL('/admin/login'); // Should not redirect to login
    });
  });

  test.describe('Performance Integration', () => {
    test('should load dashboard quickly after login', async ({ page }) => {
      await page.goto('/admin/login');
      
      // Measure login + dashboard load time
      const startTime = Date.now();
      
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      await expect(page.locator('[data-testid="stat-total-posts"]')).toBeVisible();
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should complete in reasonable time
      expect(totalTime).toBeLessThan(3000);
    });

    test('should switch between dashboard tabs smoothly', async ({ page }) => {
      // Login
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Measure tab switching performance
      const tabs = ['Statistics', 'Posts', 'Tags'];
      
      for (const tab of tabs) {
        const startTime = Date.now();
        
        await page.getByRole('tab', { name: new RegExp(tab, 'i') }).click();
        
        // Wait for tab content to be visible
        if (tab === 'Statistics') {
          await expect(page.locator('[data-testid="stat-total-posts"]')).toBeVisible();
        } else if (tab === 'Posts') {
          await expect(page.getByText('Your Blog Posts')).toBeVisible();
        } else if (tab === 'Tags') {
          await expect(page.getByText('Tag Overview')).toBeVisible();
        }
        
        const endTime = Date.now();
        const switchTime = endTime - startTime;
        
        // Each tab switch should be fast
        expect(switchTime).toBeLessThan(1000);
      }
    });
  });

  test.describe('Data Consistency Integration', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should maintain data consistency across browser refresh', async ({ page }) => {
      // Create a post
      await page.goto('/admin/post');
      const postTitle = 'Refresh Test Post ' + Date.now();
      await page.getByLabel(/title/i).fill(postTitle);
      await page.getByLabel(/content/i).fill('Content for refresh test.');
      await page.getByRole('button', { name: /save.*post/i }).click();
      
      // Check it appears in dashboard
      await page.getByRole('tab', { name: /posts/i }).click();
      await expect(page.getByText(postTitle)).toBeVisible();
      
      // Refresh the page
      await page.reload();
      
      // Should still be authenticated and post should still be there
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      await page.getByRole('tab', { name: /posts/i }).click();
      await expect(page.getByText(postTitle)).toBeVisible();
    });

    test('should handle concurrent operations correctly', async ({ page, context }) => {
      // Open second tab
      const secondPage = await context.newPage();
      
      // Both tabs should be authenticated
      await page.getByRole('tab', { name: /posts/i }).click();
      
      await secondPage.goto('/admin/dashboard');
      await expect(secondPage.getByText('Admin Dashboard')).toBeVisible();
      await secondPage.getByRole('tab', { name: /posts/i }).click();
      
      // Get initial post count from first tab
      const initialRows = page.locator('[data-testid="post-row"]');
      const initialCount = await initialRows.count();
      
      // Create post in second tab
      await secondPage.getByRole('button', { name: /create new post/i }).click();
      await secondPage.getByLabel(/title/i).fill('Concurrent Test Post');
      await secondPage.getByLabel(/content/i).fill('Created in second tab.');
      await secondPage.getByRole('button', { name: /save.*post/i }).click();
      
      // Refresh first tab to see changes
      await page.reload();
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Should see the new post
      const finalRows = page.locator('[data-testid="post-row"]');
      const finalCount = await finalRows.count();
      expect(finalCount).toBe(initialCount + 1);
      
      await secondPage.close();
    });
  });

  test.describe('Mobile Integration', () => {
    test('should work on mobile viewports', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Login on mobile
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Dashboard should work on mobile
      await expect(page).toHaveURL('/admin/dashboard');
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      
      // Tabs should work on mobile
      await page.getByRole('tab', { name: /posts/i }).click();
      await expect(page.getByText('Your Blog Posts')).toBeVisible();
      
      // Post editor should work on mobile
      await page.goto('/admin/post');
      await expect(page.getByLabel(/title/i)).toBeVisible();
      await expect(page.getByLabel(/content/i)).toBeVisible();
    });
  });
});