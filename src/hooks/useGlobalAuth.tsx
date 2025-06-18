
import { useState, useEffect } from 'react';

export const useGlobalAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Only check sessionStorage, not localStorage for security
      const globalAuth = sessionStorage.getItem('globalAuth');
      setIsAuthenticated(globalAuth === 'authenticated');
    };

    checkAuth();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    // Clear auth when page is unloaded (user leaves website)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('globalAuth');
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
  };

  return { isAuthenticated, logout };
};
