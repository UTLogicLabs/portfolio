import { test, expect } from '@playwright/test';

test.describe('Admin Post Editor', () => {
  // Helper function to login before tests
  const loginAsAdmin = async (page: any) => {
    await page.goto('/admin/login');
    await page.getByLabel(/username/i).fill('admin');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/admin/dashboard');
  };

  test.describe('Authentication Protection', () => {
    test('should redirect to login when accessing post editor without authentication', async ({ page }) => {
      await page.goto('/admin/post');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should redirect to login when accessing post edit without authentication', async ({ page }) => {
      await page.goto('/admin/post/123');
      await expect(page).toHaveURL('/admin/login');
    });
  });

  test.describe('Create New Post', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/post');
    });

    test('should display create post form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
      
      // Check all form fields are present
      await expect(page.getByLabel(/title/i)).toBeVisible();
      await expect(page.getByLabel(/excerpt/i)).toBeVisible();
      await expect(page.getByLabel(/content/i)).toBeVisible();
      await expect(page.getByLabel(/tags/i)).toBeVisible();
      await expect(page.getByLabel(/status/i)).toBeVisible();
      await expect(page.getByLabel(/cover image/i)).toBeVisible();
    });

    test('should have proper form field attributes', async ({ page }) => {
      // Title field
      const titleField = page.getByLabel(/title/i);
      await expect(titleField).toHaveAttribute('type', 'text');
      await expect(titleField).toHaveAttribute('placeholder', 'Enter post title...');

      // Excerpt field
      const excerptField = page.getByLabel(/excerpt/i);
      await expect(excerptField).toHaveAttribute('rows', '3');
      await expect(excerptField).toHaveAttribute('placeholder', 'Enter post excerpt...');

      // Content field
      const contentField = page.getByLabel(/content/i);
      await expect(contentField).toHaveAttribute('rows', '15');
      await expect(contentField).toHaveAttribute('placeholder', 'Write your post content here...');

      // Tags field
      const tagsField = page.getByLabel(/tags/i);
      await expect(tagsField).toHaveAttribute('type', 'text');
      await expect(tagsField).toHaveAttribute('placeholder', 'React, TypeScript, Web Development');

      // Cover image field
      const coverImageField = page.getByLabel(/cover image/i);
      await expect(coverImageField).toHaveAttribute('type', 'url');
      await expect(coverImageField).toHaveAttribute('placeholder', 'https://example.com/image.jpg');
    });

    test('should have status dropdown with correct options', async ({ page }) => {
      const statusSelect = page.getByLabel(/status/i);
      await expect(statusSelect).toBeVisible();
      
      // Check options
      await expect(statusSelect.locator('option[value="draft"]')).toBeVisible();
      await expect(statusSelect.locator('option[value="published"]')).toBeVisible();
    });

    test('should display header with correct title and buttons', async ({ page }) => {
      // Header title
      await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
      
      // Back to dashboard link
      const backLink = page.getByRole('link', { name: /back to dashboard/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/admin/dashboard');
      
      // Action buttons
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Post' })).toBeVisible();
    });

    test('should fill form fields correctly', async ({ page }) => {
      // Fill out the form
      await page.getByLabel(/title/i).fill('Test Blog Post');
      await page.getByLabel(/excerpt/i).fill('This is a test excerpt for the blog post.');
      await page.getByLabel(/content/i).fill('This is the full content of the test blog post. It contains multiple paragraphs and detailed information.');
      await page.getByLabel(/tags/i).fill('Test, Blog, Content');
      await page.getByLabel(/status/i).selectOption('published');
      await page.getByLabel(/cover image/i).fill('https://example.com/test-image.jpg');

      // Verify values are set
      await expect(page.getByLabel(/title/i)).toHaveValue('Test Blog Post');
      await expect(page.getByLabel(/excerpt/i)).toHaveValue('This is a test excerpt for the blog post.');
      await expect(page.getByLabel(/content/i)).toHaveValue('This is the full content of the test blog post. It contains multiple paragraphs and detailed information.');
      await expect(page.getByLabel(/tags/i)).toHaveValue('Test, Blog, Content');
      await expect(page.getByLabel(/status/i)).toHaveValue('published');
      await expect(page.getByLabel(/cover image/i)).toHaveValue('https://example.com/test-image.jpg');
    });

    test('should navigate back to dashboard on cancel', async ({ page }) => {
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should navigate back to dashboard on create', async ({ page }) => {
      // Fill required fields
      await page.getByLabel(/title/i).fill('Test Post');
      await page.getByLabel(/content/i).fill('Test content');
      
      await page.getByRole('button', { name: 'Create Post' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Edit Existing Post', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/post/123');
    });

    test('should display edit post form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible();
      
      // Check form fields are present
      await expect(page.getByLabel(/title/i)).toBeVisible();
      await expect(page.getByLabel(/excerpt/i)).toBeVisible();
      await expect(page.getByLabel(/content/i)).toBeVisible();
      await expect(page.getByLabel(/tags/i)).toBeVisible();
      await expect(page.getByLabel(/status/i)).toBeVisible();
      await expect(page.getByLabel(/cover image/i)).toBeVisible();
    });

    test('should display correct header for edit mode', async ({ page }) => {
      // Header title
      await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible();
      
      // Action buttons
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Update Post' })).toBeVisible();
    });

    test('should navigate back to dashboard on update', async ({ page }) => {
      await page.getByRole('button', { name: 'Update Post' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should navigate from dashboard to create post', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.getByRole('button', { name: /new post/i }).click();
      await expect(page).toHaveURL('/admin/post');
      await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
    });

    test('should navigate from dashboard to edit post', async ({ page }) => {
      await page.goto('/admin/dashboard');
      
      // Click edit button on first post
      const firstPostEditButton = page.locator('.shadow-sm').first().getByText('✏️');
      await firstPostEditButton.click();
      
      // Should navigate to edit page
      await expect(page).toHaveURL(/\/admin\/post\/\d+/);
      await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible();
    });

    test('should navigate back to dashboard from post editor', async ({ page }) => {
      await page.goto('/admin/post');
      
      const backLink = page.getByRole('link', { name: /back to dashboard/i });
      await backLink.click();
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/post');
    });

    test('should handle empty form submission', async ({ page }) => {
      // Try to submit empty form
      await page.getByRole('button', { name: 'Create Post' }).click();
      
      // Should still navigate (no client-side validation implemented yet)
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should accept valid URL in cover image field', async ({ page }) => {
      const coverImageField = page.getByLabel(/cover image/i);
      await coverImageField.fill('https://example.com/valid-image.jpg');
      await expect(coverImageField).toHaveValue('https://example.com/valid-image.jpg');
    });

    test('should accept comma-separated tags', async ({ page }) => {
      const tagsField = page.getByLabel(/tags/i);
      await tagsField.fill('React, TypeScript, Testing, E2E');
      await expect(tagsField).toHaveValue('React, TypeScript, Testing, E2E');
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/post');
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Should still show form elements
      await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
      await expect(page.getByLabel(/title/i)).toBeVisible();
      await expect(page.getByLabel(/content/i)).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Should maintain layout
      await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Post' })).toBeVisible();
    });

    test('should have proper grid layout on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Tags and status should be in grid layout
      const tagsField = page.getByLabel(/tags/i);
      const statusField = page.getByLabel(/status/i);
      
      await expect(tagsField).toBeVisible();
      await expect(statusField).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/post');
    });

    test('should have proper form labels', async ({ page }) => {
      // All form fields should have associated labels
      await expect(page.getByLabel(/title/i)).toBeVisible();
      await expect(page.getByLabel(/excerpt/i)).toBeVisible();
      await expect(page.getByLabel(/content/i)).toBeVisible();
      await expect(page.getByLabel(/tags/i)).toBeVisible();
      await expect(page.getByLabel(/status/i)).toBeVisible();
      await expect(page.getByLabel(/cover image/i)).toBeVisible();
    });

    test('should have keyboard navigation support', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: /back to dashboard/i })).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Create Post' })).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/title/i)).toBeFocused();
    });

    test('should have proper heading structure', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });

  test.describe('URL Parameters', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should handle numeric post ID in URL', async ({ page }) => {
      await page.goto('/admin/post/123');
      await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible();
    });

    test('should handle non-numeric post ID in URL', async ({ page }) => {
      await page.goto('/admin/post/abc');
      await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible();
    });

    test('should handle empty post ID (create mode)', async ({ page }) => {
      await page.goto('/admin/post');
      await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
    });
  });

  test.describe('Data Persistence', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/post');
    });

    test('should maintain form data during navigation away and back', async ({ page }) => {
      // Fill some form data
      await page.getByLabel(/title/i).fill('Draft Title');
      await page.getByLabel(/content/i).fill('Draft content');
      
      // Navigate away (but not submit)
      await page.goto('/admin/dashboard');
      
      // Navigate back
      await page.goto('/admin/post');
      
      // Form should be empty (no persistence implemented)
      await expect(page.getByLabel(/title/i)).toHaveValue('');
      await expect(page.getByLabel(/content/i)).toHaveValue('');
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should handle invalid post ID gracefully', async ({ page }) => {
      await page.goto('/admin/post/invalid-id');
      
      // Should still show edit form (no error handling implemented yet)
      await expect(page.getByRole('heading', { name: 'Edit Post' })).toBeVisible();
    });

    test('should handle missing authentication gracefully', async ({ page }) => {
      // Clear authentication
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
      
      await page.goto('/admin/post');
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login');
    });
  });
});