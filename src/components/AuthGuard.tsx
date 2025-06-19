
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
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;
    
    // Mark that we've checked auth at least once
    if (!hasCheckedAuth) {
      setHasCheckedAuth(true);
    }
    
    // If not authenticated and not on the landing page, redirect to login
    if (!isAuthenticated && location.pathname !== '/' && hasCheckedAuth) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, hasCheckedAuth]);

  // Show loading state while checking authentication
  if (isLoading || !hasCheckedAuth) {
    return null;
  }

  // If not authenticated and trying to access protected routes, show nothing
  if (!isAuthenticated && location.pathname !== '/') {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
