
import { useState, useEffect } from 'react';

export const useGlobalAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const globalAuth = sessionStorage.getItem('globalAuth');
      setIsAuthenticated(globalAuth === 'authenticated');
    };

    checkAuth();

    // Listen for storage changes (in case auth state changes in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    sessionStorage.removeItem('globalAuth');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, logout };
};
