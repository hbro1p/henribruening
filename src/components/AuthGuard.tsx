
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useGlobalAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;
    
    // If not authenticated and not on the landing page, redirect to login
    if (!isAuthenticated && location.pathname !== '/' && !hasRedirected) {
      setHasRedirected(true);
      navigate('/', { replace: true });
    }
    
    // Reset redirect flag when we're back on the landing page
    if (location.pathname === '/') {
      setHasRedirected(false);
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, hasRedirected]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null;
  }

  // If not authenticated and trying to access protected routes, show nothing
  if (!isAuthenticated && location.pathname !== '/') {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
