
import { useState, useEffect } from 'react';

export const useGlobalAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const globalAuth = sessionStorage.getItem('global_authenticated');
      setIsAuthenticated(globalAuth === 'true');
    };

    checkAuth();
    
    // Listen for storage changes in case authentication changes in another tab
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return isAuthenticated;
};
