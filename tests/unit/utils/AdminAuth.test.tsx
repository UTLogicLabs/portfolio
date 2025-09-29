import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReactNode } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/utils/AdminAuth';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console.error to avoid noise in tests
const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <AdminAuthProvider>{children}</AdminAuthProvider>
);

describe('AdminAuth Context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorMock.mockClear();
  });

  describe('AdminAuthProvider Initialization', () => {
    it('should initialize with unauthenticated state when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('adminAuth');
    });

    it('should restore authenticated state from localStorage', async () => {
      const storedAuthData = {
        isAuthenticated: true,
        user: { username: 'admin' }
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedAuthData));

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual({ username: 'admin' });
      });
    });

    it('should handle invalid JSON in localStorage gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBe(null);
        expect(consoleErrorMock).toHaveBeenCalledWith('Error parsing auth data:', expect.any(SyntaxError));
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('adminAuth');
      });
    });

    it('should handle incomplete auth data in localStorage', async () => {
      const incompleteAuthData = {
        isAuthenticated: true
        // missing user field
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(incompleteAuthData));

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBe(null);
      });
    });

    it('should handle auth data without isAuthenticated flag', async () => {
      const authDataWithoutFlag = {
        user: { username: 'admin' }
        // missing isAuthenticated field
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(authDataWithoutFlag));

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBe(null);
      });
    });
  });

  describe('useAdminAuth Hook', () => {
    it('should provide all required context methods and properties', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
    });

    it('should have correct initial values', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  describe('Login Functionality', () => {
    it('should authenticate with correct credentials', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('admin', 'password123');
      });

      expect(loginResult!).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ username: 'admin' });
    });

    it('should reject invalid username', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('wronguser', 'password123');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should reject invalid password', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('admin', 'wrongpassword');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should reject both invalid username and password', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('wronguser', 'wrongpassword');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should handle empty credentials', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('', '');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should be case-sensitive for username', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('Admin', 'password123');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should be case-sensitive for password', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('admin', 'Password123');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  describe('Logout Functionality', () => {
    it('should logout and clear authentication state', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // First login
      await act(async () => {
        await result.current.login('admin', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ username: 'admin' });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should handle logout when not authenticated', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // Logout without being logged in
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('adminAuth');
    });
  });

  describe('LocalStorage Integration', () => {
    it('should save authentication state to localStorage on login', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.login('admin', 'password123');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'adminAuth',
        JSON.stringify({
          isAuthenticated: true,
          user: { username: 'admin' }
        })
      );
    });

    it('should remove authentication data from localStorage on logout', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // Login first
      await act(async () => {
        await result.current.login('admin', 'password123');
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('adminAuth');
    });

    it('should not save to localStorage on failed login', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.login('wrong', 'credentials');
      });

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Authentication Flow', () => {
    it('should complete full authentication cycle', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // Initial state
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);

      // Login
      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('admin', 'password123');
      });

      expect(loginResult!).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ username: 'admin' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'adminAuth',
        JSON.stringify({
          isAuthenticated: true,
          user: { username: 'admin' }
        })
      );

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('adminAuth');
    });

    it('should handle multiple login attempts', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // First failed attempt
      let loginResult1: boolean;
      await act(async () => {
        loginResult1 = await result.current.login('wrong', 'credentials');
      });

      expect(loginResult1!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);

      // Second failed attempt
      let loginResult2: boolean;
      await act(async () => {
        loginResult2 = await result.current.login('admin', 'wrongpassword');
      });

      expect(loginResult2!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);

      // Successful attempt
      let loginResult3: boolean;
      await act(async () => {
        loginResult3 = await result.current.login('admin', 'password123');
      });

      expect(loginResult3!).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ username: 'admin' });
    });

    it('should overwrite previous session on new login', async () => {
      const existingAuthData = {
        isAuthenticated: true,
        user: { username: 'admin' }
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingAuthData));

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Login again (should work and update localStorage)
      await act(async () => {
        await result.current.login('admin', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ username: 'admin' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'adminAuth',
        JSON.stringify({
          isAuthenticated: true,
          user: { username: 'admin' }
        })
      );
    });
  });

  describe('User Data Management', () => {
    it('should store correct user data on login', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.login('admin', 'password123');
      });

      expect(result.current.user).toEqual({
        username: 'admin'
      });
      expect(result.current.user).toHaveProperty('username');
      expect(result.current.user?.username).toBe('admin');
    });

    it('should clear user data on logout', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // Login first
      await act(async () => {
        await result.current.login('admin', 'password123');
      });

      expect(result.current.user).not.toBe(null);

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBe(null);
    });

    it('should restore user data from localStorage', async () => {
      const storedAuthData = {
        isAuthenticated: true,
        user: { username: 'admin' }
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedAuthData));

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual({ username: 'admin' });
        expect(result.current.user?.username).toBe('admin');
      });
    });
  });

  describe('Security Considerations', () => {
    it('should use exact string matching for credentials', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      // Test with spaces
      let loginResult1: boolean;
      await act(async () => {
        loginResult1 = await result.current.login(' admin ', ' password123 ');
      });
      expect(loginResult1!).toBe(false);

      // Test with tabs
      let loginResult2: boolean;
      await act(async () => {
        loginResult2 = await result.current.login('admin\t', 'password123');
      });
      expect(loginResult2!).toBe(false);

      // Test with newlines
      let loginResult3: boolean;
      await act(async () => {
        loginResult3 = await result.current.login('admin\n', 'password123');
      });
      expect(loginResult3!).toBe(false);
    });

    it('should handle special characters in credentials attempts', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAdminAuth(), {
        wrapper: TestWrapper,
      });

      const specialCharCredentials = [
        ['admin"', 'password123'],
        ['admin', 'password123"'],
        ["admin'", 'password123'],
        ['admin', "password123'"],
        ['admin<script>', 'password123'],
        ['admin', 'password123<script>']
      ];

      for (const [username, password] of specialCharCredentials) {
        let loginResult: boolean;
        await act(async () => {
          loginResult = await result.current.login(username, password);
        });
        expect(loginResult!).toBe(false);
      }
    });
  });
});