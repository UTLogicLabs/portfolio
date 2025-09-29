import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminAuthProvider } from '@/components/AdminAuthProvider';

// Mock the Icon component
vi.mock('@/components/ui/Icon', () => ({
  Icon: ({ name, size, className }: any) => (
    <div data-testid={`icon-${name}`} data-size={size} className={className}>
      {name}
    </div>
  ),
}));

describe('AdminLogin', () => {
  beforeEach(() => {
    // Mock console.log to avoid noise in tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper function to render AdminLogin with Router and AdminAuth context
  const renderWithRouter = (initialEntries = ['/admin/login']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AdminAuthProvider>
          <AdminLogin />
        </AdminAuthProvider>
      </MemoryRouter>
    );
  };

  describe('Component Structure', () => {
    it('should render the login form', () => {
      renderWithRouter();
      
      expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
      expect(screen.getByText('Enter your credentials to access the admin dashboard')).toBeInTheDocument();
    });

    it('should render username and password fields', () => {
      renderWithRouter();
      
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should render login button', () => {
      renderWithRouter();
      
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should render back to website link', () => {
      renderWithRouter();
      
      const backLink = screen.getByRole('link', { name: /back to website/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('should render demo credentials', () => {
      renderWithRouter();
      
      expect(screen.getByText('Demo credentials:')).toBeInTheDocument();
      expect(screen.getByText('Username: admin')).toBeInTheDocument();
      expect(screen.getByText('Password: password123')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should render arrow-left icon in back link', () => {
      renderWithRouter();
      
      expect(screen.getByTestId('icon-arrow-left')).toBeInTheDocument();
    });

    it('should render person icon in username field', () => {
      renderWithRouter();
      
      expect(screen.getByTestId('icon-person')).toBeInTheDocument();
    });

    it('should render lock icon in password field', () => {
      renderWithRouter();
      
      expect(screen.getByTestId('icon-lock')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should update username field value', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i) as HTMLInputElement;
      
      await user.type(usernameField, 'testuser');
      
      expect(usernameField.value).toBe('testuser');
    });

    it('should update password field value', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const passwordField = screen.getByLabelText(/password/i) as HTMLInputElement;
      
      await user.type(passwordField, 'testpass');
      
      expect(passwordField.value).toBe('testpass');
    });

    it('should require both username and password fields', () => {
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      
      expect(usernameField).toBeRequired();
      expect(passwordField).toBeRequired();
    });
  });

  describe('Authentication', () => {
    it('should show loading state during login', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(usernameField, 'admin');
      await user.type(passwordField, 'password123');
      
      // Click login and check loading state
      await user.click(loginButton);
      
      expect(screen.getByText('Logging in...')).toBeInTheDocument();
      expect(loginButton).toBeDisabled();
    });

    it('should disable form fields during loading', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(usernameField, 'admin');
      await user.type(passwordField, 'password123');
      
      await user.click(loginButton);
      
      expect(usernameField).toBeDisabled();
      expect(passwordField).toBeDisabled();
      expect(loginButton).toBeDisabled();
    });

    it('should show success message for valid credentials', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(usernameField, 'admin');
      await user.type(passwordField, 'password123');
      await user.click(loginButton);
      
      // Wait for login to complete
      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });
      
      expect(console.log).toHaveBeenCalledWith('Login successful - would redirect to /admin');
    });

    it('should show error for invalid credentials', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(usernameField, 'wrong');
      await user.type(passwordField, 'credentials');
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      });
    });

    it('should clear previous errors on new login attempt', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      // First attempt with wrong credentials
      await user.type(usernameField, 'wrong');
      await user.type(passwordField, 'credentials');
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      });
      
      // Clear and try again
      await user.clear(usernameField);
      await user.clear(passwordField);
      await user.type(usernameField, 'admin');
      await user.type(passwordField, 'password123');
      await user.click(loginButton);
      
      // Error should be cleared
      expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error with proper styling', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(usernameField, 'wrong');
      await user.type(passwordField, 'credentials');
      await user.click(loginButton);
      
      await waitFor(() => {
        const errorElement = screen.getByText('Invalid username or password');
        expect(errorElement).toHaveClass('p-3', 'rounded-md', 'bg-red-50', 'text-red-600', 'text-sm');
        expect(errorElement).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      
      expect(usernameField).toHaveAttribute('id', 'username');
      expect(passwordField).toHaveAttribute('id', 'password');
    });

    it('should have role="alert" for error messages', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(usernameField, 'wrong');
      await user.type(passwordField, 'credentials');
      await user.click(loginButton);
      
      await waitFor(() => {
        const errorElement = screen.getByRole('alert');
        expect(errorElement).toHaveTextContent('Invalid username or password');
      });
    });

    it('should have proper input attributes', () => {
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      
      expect(usernameField).toHaveAttribute('type', 'text');
      expect(passwordField).toHaveAttribute('type', 'password');
      expect(usernameField).toHaveAttribute('placeholder', 'admin');
      expect(passwordField).toHaveAttribute('placeholder', '••••••••');
    });
  });

  describe('Form Submission', () => {
    describe('Form Submission', () => {
    it('should handle form submission correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      // Fill in valid credentials
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'password123');
      
      // Submit the form
      await user.click(loginButton);
      
      // Should show loading state
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });
  });
  });

  describe('Layout and Styling', () => {
    it('should have correct container classes', () => {
      renderWithRouter();
      
      const mainContainer = screen.getByText('Admin Login').closest('.min-h-screen');
      expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'flex-col', 'bg-background');
    });

    it('should center the login form', () => {
      renderWithRouter();
      
      const formContainer = screen.getByText('Admin Login').closest('.w-full');
      expect(formContainer).toHaveClass('w-full', 'max-w-md', 'space-y-6');
    });

    it('should style input fields consistently', () => {
      renderWithRouter();
      
      const usernameField = screen.getByLabelText(/username/i);
      const passwordField = screen.getByLabelText(/password/i);
      
      const expectedClasses = [
        'flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input',
        'bg-background', 'pl-10', 'pr-3', 'py-2', 'text-sm'
      ];
      
      expectedClasses.forEach(className => {
        expect(usernameField).toHaveClass(className);
        expect(passwordField).toHaveClass(className);
      });
    });
  });
});