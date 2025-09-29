import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: {
    username: string;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  user: null
});

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
  } | null>(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated && authData.user) {
          setIsAuthenticated(true);
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Simple authentication logic - in a real app, this would call an API
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const userData = {
        username
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', JSON.stringify({
        isAuthenticated: true,
        user: userData
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AuthContext);