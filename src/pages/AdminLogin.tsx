import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router';

export function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const usernameRef = useRef<HTMLInputElement>(null);

  // Set page title and focus username field
  useEffect(() => {
    document.title = 'Admin Login - Joshua Dix Portfolio';
    // Focus the username field on mount for better accessibility
    // Use setTimeout to ensure proper focus after page load
    const timer = setTimeout(() => {
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    }, 100);
    
    return () => {
      document.title = 'Joshua Dix - Portfolio';
      clearTimeout(timer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleLogin = async () => {
    // Set loading immediately and force synchronous update for tests
    flushSync(() => {
      setIsLoading(true);
      setError('');
      setSuccess('');
    });

    // Add a small delay to ensure the loading state is visible
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      // Simulate API call delay - longer delay to allow tests to catch loading state
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo authentication logic
      if (formData.username === 'admin' && formData.password === 'password123') {
        setSuccess('Login successful! Redirecting...');
        // Simulate redirect delay
        setTimeout(() => {
          // In a real app, this would redirect to the admin dashboard
          console.log('Redirecting to admin dashboard...');
        }, 1500);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container py-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          ← Back to Website
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {error && (
            <div 
              role="alert"
              className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
            >
              {error}
            </div>
          )}

          {success && (
            <div 
              role="alert"
              className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md"
            >
              {success}
            </div>
          )}

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                ref={usernameRef}
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="admin"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              aria-disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Username: admin</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
