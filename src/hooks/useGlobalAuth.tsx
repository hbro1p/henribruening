
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

    // Clear auth when page is unloaded (user leaves website)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('globalAuth');
      localStorage.removeItem('globalAuth');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
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
