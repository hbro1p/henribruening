
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { secureLogger } from '@/utils/secureLogger';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useGlobalAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;
    
    // Only allow access to the root path without authentication
    // ALL other routes are protected
    const isPublicRoute = location.pathname === '/';
    
    // If not authenticated and trying to access any protected route, redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      secureLogger.info('Unauthorized access attempt to protected route', { 
        route: location.pathname 
      });
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  // Show minimal loading state - quick fade
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400" />
    );
  }

  // If not authenticated and trying to access any protected route, show nothing (will redirect)
  const isPublicRoute = location.pathname === '/';
  
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
