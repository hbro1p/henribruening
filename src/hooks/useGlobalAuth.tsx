
import { useState, useEffect } from 'react';

export const useGlobalAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Only check sessionStorage, not localStorage for security
      const globalAuth = sessionStorage.getItem('globalAuth');
      const authStatus = globalAuth === 'authenticated';
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'globalAuth' || e.storageArea === sessionStorage) {
        checkAuth();
      }
    };

    // Listen for focus events to recheck auth when user returns to tab
    const handleFocus = () => {
      checkAuth();
    };

    // Clear auth when page is unloaded (user leaves website)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('globalAuth');
      localStorage.removeItem('globalAuth');
    };

    // Set up interval to periodically check auth status
    const authCheckInterval = setInterval(checkAuth, 5000); // Check every 5 seconds

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(authCheckInterval);
    };
  }, []);

  const logout = () => {
    sessionStorage.removeItem('globalAuth');
    localStorage.removeItem('globalAuth');
    setIsAuthenticated(false);
    // Force page reload to clear any cached data
    window.location.href = '/';
  };

  return { isAuthenticated, isLoading, logout };
};
