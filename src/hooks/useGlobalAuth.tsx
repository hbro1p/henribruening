
import { useState, useEffect } from 'react';

interface SessionData {
  token: string;
  authenticated: boolean;
  expiresAt: number;
  lastActivity: number;
  fingerprint?: string;
}

export const useGlobalAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isSessionValid = async (sessionData: SessionData): Promise<boolean> => {
    const now = Date.now();
    const sessionExpired = now > sessionData.expiresAt;
    const inactivityTimeout = now - sessionData.lastActivity > (20 * 60 * 1000); // Reduced to 20 minutes inactivity
    
    // Enhanced security: verify browser fingerprint
    if (sessionData.fingerprint) {
      const currentFingerprint = await generateBrowserFingerprint();
      if (currentFingerprint !== sessionData.fingerprint) {
        return false; // Session hijacking attempt detected
      }
    }
    
    return sessionData.authenticated && !sessionExpired && !inactivityTimeout;
  };

  const generateBrowserFingerprint = async (): Promise<string> => {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0
    ];
    
    const data = components.join('|');
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const updateLastActivity = (sessionData: SessionData) => {
    const updatedSession = {
      ...sessionData,
      lastActivity: Date.now()
    };
    sessionStorage.setItem('globalAuth', JSON.stringify(updatedSession));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const globalAuth = sessionStorage.getItem('globalAuth');
        if (!globalAuth) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const sessionData: SessionData = JSON.parse(globalAuth);
        
        if (await isSessionValid(sessionData)) {
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

    // Listen for custom globalAuthChange event (for same-tab changes)
    const handleGlobalAuthChange = (e: CustomEvent) => {
      checkAuth();
    };

    // Check session validity periodically
    const sessionCheckInterval = setInterval(checkAuth, 60000); // Check every minute

    // Update activity on user interactions
    const updateActivity = async () => {
      const globalAuth = sessionStorage.getItem('globalAuth');
      if (globalAuth) {
        try {
          const sessionData: SessionData = JSON.parse(globalAuth);
          if (await isSessionValid(sessionData)) {
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
    window.addEventListener('globalAuthChange', handleGlobalAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('globalAuthChange', handleGlobalAuthChange as EventListener);
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
