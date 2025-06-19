
import { useState, useEffect } from 'react';

interface SessionData {
  token: string;
  authenticated: boolean;
  expiresAt: number;
  lastActivity: number;
}

export const useGlobalAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isSessionValid = (sessionData: SessionData): boolean => {
    const now = Date.now();
    const sessionExpired = now > sessionData.expiresAt;
    const inactivityTimeout = now - sessionData.lastActivity > (30 * 60 * 1000); // 30 minutes inactivity
    
    return sessionData.authenticated && !sessionExpired && !inactivityTimeout;
  };

  const updateLastActivity = (sessionData: SessionData) => {
    const updatedSession = {
      ...sessionData,
      lastActivity: Date.now()
    };
    sessionStorage.setItem('globalAuth', JSON.stringify(updatedSession));
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        const globalAuth = sessionStorage.getItem('globalAuth');
        if (!globalAuth) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const sessionData: SessionData = JSON.parse(globalAuth);
        
        if (isSessionValid(sessionData)) {
          setIsAuthenticated(true);
          updateLastActivity(sessionData);
        } else {
          // Session expired or invalid, clean up
          sessionStorage.removeItem('globalAuth');
          localStorage.removeItem('globalAuth');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Invalid session data, clean up
        sessionStorage.removeItem('globalAuth');
        localStorage.removeItem('globalAuth');
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    // Initial check
    checkAuth();

    // Listen for storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'globalAuth') {
        checkAuth();
      }
    };

    // Check session validity periodically
    const sessionCheckInterval = setInterval(checkAuth, 60000); // Check every minute

    // Update activity on user interactions
    const updateActivity = () => {
      const globalAuth = sessionStorage.getItem('globalAuth');
      if (globalAuth) {
        try {
          const sessionData: SessionData = JSON.parse(globalAuth);
          if (isSessionValid(sessionData)) {
            updateLastActivity(sessionData);
          }
        } catch (error) {
          // Invalid session data, ignore
        }
      }
    };

    // Activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(sessionCheckInterval);
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
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
