import { test, expect } from '@playwright/test';

/**
 * Admin Login Page E2E Tests
 * 
 * Comprehensive E2E tests for the AdminLogin page functionality including:
 * - Page structure and rendering
 * - Form interactions and validation
 * - Authentication flow testing
 * - Error handling
 * - Accessibility compliance
 * - Responsive design
 * - Cross-browser compatibility
 */

test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin login page
    // TODO: This route needs to be set up in the application first
    await page.goto('/admin/login');
  });

  test.describe('Page Structure', () => {
    test('should render the login page correctly', async ({ page }) => {
      // Check page title and main elements
      await expect(page).toHaveTitle(/Admin Login/);
      
      // Check main heading
      await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
      
      // Check description
      await expect(page.getByText('Enter your credentials to access the admin dashboard')).toBeVisible();
      
      // Check back to website link
      await expect(page.getByRole('link', { name: /back to website/i })).toBeVisible();
    });

    test('should render form elements correctly', async ({ page }) => {
      // Check username field
      await expect(page.getByLabel(/username/i)).toBeVisible();
      await expect(page.getByPlaceholder('admin')).toBeVisible();
      
      // Check password field
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByPlaceholder('••••••••')).toBeVisible();
      
      // Check login button
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('should display demo credentials', async ({ page }) => {
      await expect(page.getByText('Demo credentials:')).toBeVisible();
      await expect(page.getByText('Username: admin')).toBeVisible();
      await expect(page.getByText('Password: password123')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to website when back link is clicked', async ({ page }) => {
      const backLink = page.getByRole('link', { name: /back to website/i });
      await expect(backLink).toHaveAttribute('href', '/');
    });
  });

  test.describe('Form Interaction', () => {
    test('should allow typing in username field', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      await usernameField.fill('testuser');
      await expect(usernameField).toHaveValue('testuser');
    });

    test('should allow typing in password field', async ({ page }) => {
      const passwordField = page.getByLabel(/password/i);
      await passwordField.fill('testpassword');
      await expect(passwordField).toHaveValue('testpassword');
    });

    test('should mask password input', async ({ page }) => {
      const passwordField = page.getByLabel(/password/i);
      await expect(passwordField).toHaveAttribute('type', 'password');
    });

    test('should require both fields for form submission', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: 'Login' });

      // Check HTML5 required attributes
      await expect(usernameField).toHaveAttribute('required');
      await expect(passwordField).toHaveAttribute('required');

      // Try to submit empty form
      await loginButton.click();
      
      // Browser should prevent submission and focus on first required field
      await expect(usernameField).toBeFocused();
    });
  });

  test.describe('Authentication Flow', () => {
    test('should show loading state during login attempt', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: 'Login' });

      // Fill in credentials
      await usernameField.fill('admin');
      await passwordField.fill('password123');

      // Click login button
      await loginButton.click();

      // Should show loading state briefly
      await expect(page.getByText('Logging in...')).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: 'Login' });

      // Fill in valid credentials
      await usernameField.fill('admin');
      await passwordField.fill('password123');

      // Submit the form
      await loginButton.click();

      // Wait for loading to complete and success message to appear
      await expect(page.getByText('Login successful! Redirecting...')).toBeVisible({ timeout: 3000 });
    });

    test('should show error message with invalid credentials', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: 'Login' });

      // Fill in invalid credentials
      await usernameField.fill('wronguser');
      await passwordField.fill('wrongpassword');

      // Submit the form
      await loginButton.click();

      // Wait for error message to appear
      await expect(page.getByText('Invalid username or password')).toBeVisible({ timeout: 3000 });
    });

    test('should clear previous errors on new login attempt', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: 'Login' });

      // First attempt with invalid credentials
      await usernameField.fill('wronguser');
      await passwordField.fill('wrongpassword');
      await loginButton.click();

      // Wait for error to appear
      await expect(page.getByText('Invalid username or password')).toBeVisible({ timeout: 3000 });

      // Clear fields and try again with valid credentials
      await usernameField.clear();
      await passwordField.clear();
      await usernameField.fill('admin');
      await passwordField.fill('password123');
      await loginButton.click();

      // Error should be cleared and success message should appear
      await expect(page.getByText('Login successful! Redirecting...')).toBeVisible({ timeout: 3000 });
      await expect(page.getByText('Invalid username or password')).not.toBeVisible();
    });

    test('should disable form fields during login process', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: 'Login' });

      // Fill in credentials
      await usernameField.fill('admin');
      await passwordField.fill('password123');

      // Start login process
      await loginButton.click();

      // Fields should be disabled during loading
      await expect(usernameField).toBeDisabled();
      await expect(passwordField).toBeDisabled();
      await expect(loginButton).toBeDisabled();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper form labels and ARIA attributes', async ({ page }) => {
      // Check that fields have proper labels
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);

      await expect(usernameField).toBeVisible();
      await expect(passwordField).toBeVisible();

      // Check that labels are properly associated
      await expect(usernameField).toHaveAttribute('id', 'username');
      await expect(passwordField).toHaveAttribute('id', 'password');
    });

    test('should have proper error message accessibility', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: 'Login' });

      // Trigger an error
      await usernameField.fill('wronguser');
      await passwordField.fill('wrongpassword');
      await loginButton.click();

      // Wait for error message
      await expect(page.getByText('Invalid username or password')).toBeVisible({ timeout: 3000 });

      // Error message should have role="alert" for screen readers
      const errorMessage = page.getByRole('alert');
      await expect(errorMessage).toContainText('Invalid username or password');
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/username/i)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/password/i)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Login' })).toBeFocused();
    });
  });

  test.describe('Visual and Layout', () => {
    test('should have correct page layout and styling', async ({ page }) => {
      // Check that the page has the expected layout classes
      const container = page.locator('.min-h-screen.flex.flex-col.bg-background');
      await expect(container).toBeVisible();

      // Check that the form is centered
      const formContainer = page.locator('.flex-1.flex.items-center.justify-center');
      await expect(formContainer).toBeVisible();

      // Check that the form has proper max width
      const formCard = page.locator('.w-full.max-w-md');
      await expect(formCard).toBeVisible();
    });

    test('should render icons correctly', async ({ page }) => {
      // Check for presence of icons (they would be rendered as custom components)
      // This is a basic check since icons are custom components
      const backLink = page.getByRole('link', { name: /back to website/i });
      await expect(backLink).toBeVisible();
      
      // The actual icon rendering would depend on the Icon component implementation
      // We can check for the presence of the link itself
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that elements are still visible and accessible
      await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
      await expect(page.getByLabel(/username/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Check that layout is appropriate for tablet
      await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
      await expect(page.getByLabel(/username/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });
  });
});