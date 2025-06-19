
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useGlobalAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if not authenticated and not already on the landing page
    if (!isAuthenticated && location.pathname !== '/') {
      console.log('AuthGuard: Redirecting unauthenticated user from', location.pathname, 'to /');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, location.pathname]); // Removed navigate from dependencies to prevent infinite loop

  // If not authenticated and trying to access protected routes, show nothing
  if (!isAuthenticated && location.pathname !== '/') {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
