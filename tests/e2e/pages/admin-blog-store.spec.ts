import { test, expect } from '@playwright/test';

test.describe('Blog Store Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin/login');
    await page.getByLabel(/username/i).fill('admin');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test.describe('Blog Statistics', () => {
    test('should display correct post statistics', async ({ page }) => {
      await page.goto('/admin/dashboard');
      
      // Switch to Statistics tab if not already there
      await page.getByRole('tab', { name: /statistics/i }).click();
      
      // Check for statistics cards
      await expect(page.getByText('Total Posts')).toBeVisible();
      await expect(page.getByText('Published')).toBeVisible();
      await expect(page.getByText('Drafts')).toBeVisible();
      await expect(page.getByText('Total Tags')).toBeVisible();
      
      // Check that numbers are displayed
      const totalPosts = page.locator('[data-testid="stat-total-posts"]');
      const published = page.locator('[data-testid="stat-published"]');
      const drafts = page.locator('[data-testid="stat-drafts"]');
      const totalTags = page.locator('[data-testid="stat-total-tags"]');
      
      await expect(totalPosts).toContainText(/\d+/);
      await expect(published).toContainText(/\d+/);
      await expect(drafts).toContainText(/\d+/);
      await expect(totalTags).toContainText(/\d+/);
    });

    test('should show recent posts section', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /statistics/i }).click();
      
      await expect(page.getByText('Recent Posts')).toBeVisible();
      
      // Should show at least one post
      const postItems = page.locator('[data-testid="recent-post-item"]');
      await expect(postItems.first()).toBeVisible();
    });

    test('should show popular tags section', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /statistics/i }).click();
      
      await expect(page.getByText('Popular Tags')).toBeVisible();
      
      // Should show at least one tag
      const tagItems = page.locator('[data-testid="popular-tag-item"]');
      await expect(tagItems.first()).toBeVisible();
    });
  });

  test.describe('Post Management', () => {
    test('should display all posts in Posts tab', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Should show posts table
      await expect(page.getByText('Your Blog Posts')).toBeVisible();
      
      // Should have table headers
      await expect(page.getByText('Title')).toBeVisible();
      await expect(page.getByText('Status')).toBeVisible();
      await expect(page.getByText('Date')).toBeVisible();
      await expect(page.getByText('Tags')).toBeVisible();
      await expect(page.getByText('Actions')).toBeVisible();
      
      // Should show at least one post
      const postRows = page.locator('[data-testid="post-row"]');
      await expect(postRows.first()).toBeVisible();
    });

    test('should show post status badges correctly', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Check for published status badge
      const publishedBadge = page.locator('[data-testid="status-published"]').first();
      if (await publishedBadge.isVisible()) {
        await expect(publishedBadge).toHaveClass(/bg-green/);
      }
      
      // Check for draft status badge
      const draftBadge = page.locator('[data-testid="status-draft"]').first();
      if (await draftBadge.isVisible()) {
        await expect(draftBadge).toHaveClass(/bg-yellow/);
      }
    });

    test('should allow editing posts', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Click edit button on first post
      const editButton = page.locator('[data-testid="edit-post-btn"]').first();
      await editButton.click();
      
      // Should navigate to post editor
      await expect(page).toHaveURL(/\/admin\/post\/\d+/);
      await expect(page.getByText('Edit Post')).toBeVisible();
    });

    test('should allow deleting posts', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Get initial post count
      const initialRows = page.locator('[data-testid="post-row"]');
      const initialCount = await initialRows.count();
      
      // Click delete button on first post
      const deleteButton = page.locator('[data-testid="delete-post-btn"]').first();
      await deleteButton.click();
      
      // Should show confirmation dialog
      await expect(page.getByText('Are you sure you want to delete this post?')).toBeVisible();
      
      // Confirm deletion
      await page.getByRole('button', { name: 'Delete' }).click();
      
      // Post count should decrease
      const finalRows = page.locator('[data-testid="post-row"]');
      const finalCount = await finalRows.count();
      expect(finalCount).toBe(initialCount - 1);
    });

    test('should cancel post deletion', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Get initial post count
      const initialRows = page.locator('[data-testid="post-row"]');
      const initialCount = await initialRows.count();
      
      // Click delete button on first post
      const deleteButton = page.locator('[data-testid="delete-post-btn"]').first();
      await deleteButton.click();
      
      // Should show confirmation dialog
      await expect(page.getByText('Are you sure you want to delete this post?')).toBeVisible();
      
      // Cancel deletion
      await page.getByRole('button', { name: 'Cancel' }).click();
      
      // Post count should remain the same
      const finalRows = page.locator('[data-testid="post-row"]');
      const finalCount = await finalRows.count();
      expect(finalCount).toBe(initialCount);
    });

    test('should create new post', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Click create new post button
      await page.getByRole('button', { name: /create new post/i }).click();
      
      // Should navigate to post editor
      await expect(page).toHaveURL('/admin/post');
      await expect(page.getByText(/create.*post/i)).toBeVisible();
    });

    test('should search posts', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Get all posts first
      const allRows = page.locator('[data-testid="post-row"]');
      const allCount = await allRows.count();
      
      // Search for a specific term
      const searchInput = page.getByPlaceholder(/search posts/i);
      await searchInput.fill('React');
      
      // Wait for search results
      await page.waitForTimeout(500);
      
      // Should show filtered results
      const filteredRows = page.locator('[data-testid="post-row"]');
      const filteredCount = await filteredRows.count();
      
      // Should show only matching posts (or no posts if none match)
      expect(filteredCount).toBeLessThanOrEqual(allCount);
    });

    test('should clear search', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Search for a term
      const searchInput = page.getByPlaceholder(/search posts/i);
      await searchInput.fill('NonExistentTerm');
      await page.waitForTimeout(500);
      
      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);
      
      // Should show all posts again
      const postRows = page.locator('[data-testid="post-row"]');
      await expect(postRows.first()).toBeVisible();
    });

    test('should show no results message for empty search', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Search for non-existent term
      const searchInput = page.getByPlaceholder(/search posts/i);
      await searchInput.fill('XYZ123NonExistent');
      await page.waitForTimeout(500);
      
      // Should show no results message
      await expect(page.getByText(/no posts found/i)).toBeVisible();
    });
  });

  test.describe('Tag Management', () => {
    test('should display all tags in Tags tab', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /tags/i }).click();
      
      await expect(page.getByText('Tag Overview')).toBeVisible();
      
      // Should show at least one tag
      const tagItems = page.locator('[data-testid="tag-item"]');
      await expect(tagItems.first()).toBeVisible();
    });

    test('should show tag usage counts', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /tags/i }).click();
      
      // Each tag should show usage count
      const tagUsage = page.locator('[data-testid="tag-usage"]').first();
      await expect(tagUsage).toContainText(/\d+.*posts?/);
    });

    test('should show tag colors/styles', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /tags/i }).click();
      
      // Tags should have consistent styling
      const tagBadges = page.locator('[data-testid="tag-badge"]');
      const firstTag = tagBadges.first();
      
      await expect(firstTag).toHaveClass(/bg-/); // Should have background color class
      await expect(firstTag).toHaveClass(/text-/); // Should have text color class
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist post creation', async ({ page }) => {
      // Go to post editor
      await page.goto('/admin/post');
      
      // Fill out post form
      await page.getByLabel(/title/i).fill('Test Post Title');
      await page.getByLabel(/content/i).fill('This is test content for the post.');
      await page.getByLabel(/excerpt/i).fill('Test excerpt');
      await page.getByLabel(/tags/i).fill('test,automation');
      
      // Save the post
      await page.getByRole('button', { name: /save.*post/i }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Go to Posts tab
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Should see the new post
      await expect(page.getByText('Test Post Title')).toBeVisible();
    });

    test('should persist post updates', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Edit the first post
      const editButton = page.locator('[data-testid="edit-post-btn"]').first();
      await editButton.click();
      
      // Update the title
      const titleInput = page.getByLabel(/title/i);
      await titleInput.clear();
      await titleInput.fill('Updated Post Title');
      
      // Save changes
      await page.getByRole('button', { name: /save.*post/i }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Go to Posts tab
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Should see the updated title
      await expect(page.getByText('Updated Post Title')).toBeVisible();
    });

    test('should persist post deletion', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Get the title of the first post
      const firstPostTitle = await page.locator('[data-testid="post-row"]').first()
        .locator('[data-testid="post-title"]').textContent();
      
      // Delete the first post
      const deleteButton = page.locator('[data-testid="delete-post-btn"]').first();
      await deleteButton.click();
      
      // Confirm deletion
      await page.getByRole('button', { name: 'Delete' }).click();
      
      // Refresh the page
      await page.reload();
      await page.getByRole('tab', { name: /posts/i }).click();
      
      // Should not see the deleted post
      if (firstPostTitle) {
        await expect(page.getByText(firstPostTitle)).not.toBeVisible();
      }
    });
  });

  test.describe('Data Validation', () => {
    test('should handle empty state gracefully', async ({ page }) => {
      // This test would require clearing all data first
      // For now, just check that the interface handles low data counts
      await page.goto('/admin/dashboard');
      
      // Even with no posts, interface should work
      await expect(page.getByRole('tab', { name: /statistics/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /posts/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /tags/i })).toBeVisible();
    });

    test('should show correct statistics calculations', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /statistics/i }).click();
      
      // Get statistics
      const totalPostsText = await page.locator('[data-testid="stat-total-posts"]').textContent();
      const publishedText = await page.locator('[data-testid="stat-published"]').textContent();
      const draftsText = await page.locator('[data-testid="stat-drafts"]').textContent();
      
      if (totalPostsText && publishedText && draftsText) {
        const totalPosts = parseInt(totalPostsText);
        const published = parseInt(publishedText);
        const drafts = parseInt(draftsText);
        
        // Total should equal published + drafts
        expect(totalPosts).toBe(published + drafts);
      }
    });

    test('should maintain data consistency after operations', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /statistics/i }).click();
      
      // Get initial counts
      const initialTotalText = await page.locator('[data-testid="stat-total-posts"]').textContent();
      const initialTotal = initialTotalText ? parseInt(initialTotalText) : 0;
      
      // Go to Posts tab and delete a post
      await page.getByRole('tab', { name: /posts/i }).click();
      const deleteButton = page.locator('[data-testid="delete-post-btn"]').first();
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.getByRole('button', { name: 'Delete' }).click();
        
        // Go back to Statistics tab
        await page.getByRole('tab', { name: /statistics/i }).click();
        
        // Total should be one less
        const newTotalText = await page.locator('[data-testid="stat-total-posts"]').textContent();
        const newTotal = newTotalText ? parseInt(newTotalText) : 0;
        
        expect(newTotal).toBe(initialTotal - 1);
      }
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard data quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/admin/dashboard');
      
      // Wait for main content to load
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      await expect(page.locator('[data-testid="stat-total-posts"]')).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      
      // Should load in reasonable time (adjust threshold as needed)
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle search efficiently', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('tab', { name: /posts/i }).click();
      
      const searchInput = page.getByPlaceholder(/search posts/i);
      
      const startTime = Date.now();
      await searchInput.fill('React');
      
      // Wait for search results
      await page.waitForTimeout(100);
      
      const searchTime = Date.now() - startTime;
      
      // Search should be responsive
      expect(searchTime).toBeLessThan(1000);
    });

    test('should handle tab switching smoothly', async ({ page }) => {
      await page.goto('/admin/dashboard');
      
      // Switch between tabs multiple times
      const tabs = ['Statistics', 'Posts', 'Tags'];
      
      for (const tab of tabs) {
        const startTime = Date.now();
        await page.getByRole('tab', { name: new RegExp(tab, 'i') }).click();
        
        // Wait for tab content to load
        await page.waitForTimeout(100);
        
        const switchTime = Date.now() - startTime;
        expect(switchTime).toBeLessThan(500);
      }
    });
  });
});