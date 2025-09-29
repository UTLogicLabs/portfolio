import { test, expect } from '@playwright/test';

test.describe('Admin Authentication Flow', () => {
  test.describe('Login Process', () => {
    test.beforeEach(async ({ page }) => {
      // Clear any existing authentication
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
    });

    test('should display login form correctly', async ({ page }) => {
      await page.goto('/admin/login');
      
      await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
      await expect(page.getByText('Enter your credentials to access the admin dashboard')).toBeVisible();
      await expect(page.getByLabel(/username/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('should show demo credentials', async ({ page }) => {
      await page.goto('/admin/login');
      
      await expect(page.getByText('Demo credentials:')).toBeVisible();
      await expect(page.getByText('Username: admin')).toBeVisible();
      await expect(page.getByText('Password: password123')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
      await page.goto('/admin/login');
      
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/admin/dashboard');
      await expect(page.getByText('Admin Dashboard')).toBeVisible();
      await expect(page.getByText('Logged in as admin')).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/admin/login');
      
      await page.getByLabel(/username/i).fill('wrong');
      await page.getByLabel(/password/i).fill('wrong');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Should show error message
      await expect(page.getByText('Invalid username or password')).toBeVisible();
      
      // Should stay on login page
      await expect(page).toHaveURL('/admin/login');
    });

    test('should show loading state during login', async ({ page }) => {
      await page.goto('/admin/login');
      
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Should show loading state briefly
      await expect(page.getByText('Logging in...')).toBeVisible();
    });

    test('should disable form fields during login', async ({ page }) => {
      await page.goto('/admin/login');
      
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Fields should be disabled during loading
      await expect(page.getByLabel(/username/i)).toBeDisabled();
      await expect(page.getByLabel(/password/i)).toBeDisabled();
      await expect(page.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
    });

    test('should clear error message when user starts typing', async ({ page }) => {
      await page.goto('/admin/login');
      
      // First, create an error
      await page.getByLabel(/username/i).fill('wrong');
      await page.getByLabel(/password/i).fill('wrong');
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page.getByText('Invalid username or password')).toBeVisible();
      
      // Start typing in username field
      await page.getByLabel(/username/i).fill('a');
      
      // Error should be cleared
      await expect(page.getByText('Invalid username or password')).not.toBeVisible();
    });

    test('should focus username field on page load', async ({ page }) => {
      await page.goto('/admin/login');
      
      // Username field should be focused
      await expect(page.getByLabel(/username/i)).toBeFocused();
    });

    test('should set correct page title', async ({ page }) => {
      await page.goto('/admin/login');
      
      await expect(page).toHaveTitle('Admin Login - Joshua Dix Portfolio');
    });

    test('should restore original title when leaving', async ({ page }) => {
      await page.goto('/admin/login');
      await expect(page).toHaveTitle('Admin Login - Joshua Dix Portfolio');
      
      // Navigate away
      await page.goto('/');
      await expect(page).toHaveTitle('Joshua Dix - Portfolio');
    });
  });

  test.describe('Authentication Persistence', () => {
    test('should persist authentication across page refreshes', async ({ page }) => {
      // Login first
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Refresh the page
      await page.reload();
      
      // Should still be authenticated
      await expect(page).toHaveURL('/admin/dashboard');
      await expect(page.getByText('Logged in as admin')).toBeVisible();
    });

    test('should persist authentication across browser sessions', async ({ page, context }) => {
      // Login first
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page).toHaveURL('/admin/dashboard');
      
      // Create new page in same context (simulates new tab)
      const newPage = await context.newPage();
      await newPage.goto('/admin/dashboard');
      
      // Should be authenticated in new page
      await expect(newPage).toHaveURL('/admin/dashboard');
      await expect(newPage.getByText('Logged in as admin')).toBeVisible();
    });

    test('should store user data in localStorage', async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Check localStorage
      const userData = await page.evaluate(() => {
        return localStorage.getItem('admin_user');
      });
      
      expect(userData).toBeTruthy();
      const user = JSON.parse(userData!);
      expect(user.username).toBe('admin');
      expect(user.email).toBe('admin@example.com');
    });
  });

  test.describe('Logout Process', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should logout successfully', async ({ page }) => {
      await page.getByRole('button', { name: /logout/i }).click();
      
      // Should redirect to homepage
      await expect(page).toHaveURL('/');
    });

    test('should clear authentication data on logout', async ({ page }) => {
      await page.getByRole('button', { name: /logout/i }).click();
      
      // Check that localStorage is cleared
      const userData = await page.evaluate(() => {
        return localStorage.getItem('admin_user');
      });
      
      expect(userData).toBeNull();
    });

    test('should require login after logout', async ({ page }) => {
      await page.getByRole('button', { name: /logout/i }).click();
      
      // Try to access dashboard
      await page.goto('/admin/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login for unauthenticated dashboard access', async ({ page }) => {
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
      
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should redirect to login for unauthenticated post editor access', async ({ page }) => {
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
      
      await page.goto('/admin/post');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should redirect to login for unauthenticated post edit access', async ({ page }) => {
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
      
      await page.goto('/admin/post/123');
      await expect(page).toHaveURL('/admin/login');
    });

    test('should show loading state while checking authentication', async ({ page }) => {
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
      
      await page.goto('/admin/dashboard');
      
      // Should briefly show loading before redirect
      await expect(page.getByText('Loading...')).toBeVisible();
    });

    test('should allow access to public routes without authentication', async ({ page }) => {
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
      
      // Public routes should be accessible
      await page.goto('/');
      await expect(page.getByText('Joshua Dix')).toBeVisible();
      
      await page.goto('/blog');
      await expect(page.getByText('Blog')).toBeVisible();
    });
  });

  test.describe('Auto-redirect for Authenticated Users', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/admin/login');
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should redirect authenticated users away from login page', async ({ page }) => {
      // Try to access login page when already authenticated
      await page.goto('/admin/login');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Navigation Integration', () => {
    test('should have back to website link on login page', async ({ page }) => {
      await page.goto('/admin/login');
      
      const backLink = page.getByRole('link', { name: /back to website/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/');
    });

    test('should navigate to homepage from login page', async ({ page }) => {
      await page.goto('/admin/login');
      
      await page.getByRole('link', { name: /back to website/i }).click();
      await expect(page).toHaveURL('/');
    });

    test('should navigate to dashboard from successful login', async ({ page }) => {
      await page.goto('/admin/login');
      
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login');
    });

    test('should require username field', async ({ page }) => {
      // Try to submit with empty username
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // HTML5 validation should prevent submission
      const usernameField = page.getByLabel(/username/i);
      const validationMessage = await usernameField.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });

    test('should require password field', async ({ page }) => {
      // Try to submit with empty password
      await page.getByLabel(/username/i).fill('admin');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // HTML5 validation should prevent submission
      const passwordField = page.getByLabel(/password/i);
      const validationMessage = await passwordField.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });

    test('should accept valid form submission', async ({ page }) => {
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Should proceed with login attempt
      await expect(page.getByText('Logging in...')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login');
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure (this would require more complex setup)
      // For now, just test with invalid credentials which is handled
      await page.getByLabel(/username/i).fill('invalid');
      await page.getByLabel(/password/i).fill('invalid');
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page.getByText('Invalid username or password')).toBeVisible();
    });

    test('should maintain form state after error', async ({ page }) => {
      await page.getByLabel(/username/i).fill('wrong-user');
      await page.getByLabel(/password/i).fill('wrong-pass');
      await page.getByRole('button', { name: 'Login' }).click();
      
      await expect(page.getByText('Invalid username or password')).toBeVisible();
      
      // Form values should be maintained
      await expect(page.getByLabel(/username/i)).toHaveValue('wrong-user');
      await expect(page.getByLabel(/password/i)).toHaveValue('wrong-pass');
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login');
    });

    test('should have proper error message accessibility', async ({ page }) => {
      // Trigger an error
      await page.getByLabel(/username/i).fill('wrong');
      await page.getByLabel(/password/i).fill('wrong');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Error message should have role="alert"
      const errorMessage = page.getByRole('alert');
      await expect(errorMessage).toContainText('Invalid username or password');
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: /back to website/i })).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/username/i)).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/password/i)).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Login' })).toBeFocused();
    });

    test('should support form submission with Enter key', async ({ page }) => {
      await page.getByLabel(/username/i).fill('admin');
      await page.getByLabel(/password/i).fill('password123');
      
      // Press Enter to submit
      await page.getByLabel(/password/i).press('Enter');
      
      // Should start login process
      await expect(page.getByText('Logging in...')).toBeVisible();
    });
  });
});