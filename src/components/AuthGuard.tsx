
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
    
    // Protected routes that require authentication
    const protectedRoutes = ['/desktop', '/pictures', '/videos', '/projects', '/about', '/contact', '/settings'];
    const isProtectedRoute = protectedRoutes.includes(location.pathname);
    
    // If not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && isProtectedRoute) {
      secureLogger.info('Unauthorized access attempt to protected route', { 
        route: location.pathname 
      });
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-blue-900 font-pixel">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and trying to access protected routes, show nothing (will redirect)
  const protectedRoutes = ['/desktop', '/pictures', '/videos', '/projects', '/about', '/contact', '/settings'];
  const isProtectedRoute = protectedRoutes.includes(location.pathname);
  
  if (!isAuthenticated && isProtectedRoute) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
