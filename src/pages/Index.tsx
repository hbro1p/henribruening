
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { supabase } from '@/integrations/supabase/client';
import { Monitor, Eye, EyeOff } from 'lucide-react';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useGlobalAuth();
  const navigate = useNavigate();

  // Memoize the navigation function to prevent unnecessary re-renders
  const handleAuthenticatedRedirect = useCallback(() => {
    if (!authLoading && isAuthenticated && !redirecting) {
      setRedirecting(true);
      navigate('/desktop', { replace: true });
    }
  }, [isAuthenticated, authLoading, redirecting, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Handle authenticated user redirect with proper guards
  useEffect(() => {
    handleAuthenticatedRedirect();
  }, [handleAuthenticatedRedirect]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-password', {
        body: { 
          password: password,
          section: 'global' 
        }
      });
      
      if (error) throw error;
      
      if (data.valid) {
        setPasswordError('');
        // Generate secure session token with expiration
        const sessionToken = crypto.randomUUID() + '-' + Date.now();
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        
        const sessionData = {
          token: sessionToken,
          authenticated: true,
          expiresAt: expiresAt,
          lastActivity: Date.now()
        };
        
        sessionStorage.setItem('globalAuth', JSON.stringify(sessionData));
        setPassword('');
        setRedirecting(true);
        navigate('/desktop', { replace: true });
      } else {
        setPasswordError('Wrong password!');
        setPassword('');
      }
    } catch (error) {
      setPasswordError('Try again!');
      setPassword('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  // Show loading state while redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-blue-900 font-pixel">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Retro pixel grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-600 animate-bounce delay-100"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-800 animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-blue-700 animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-blue-900 animate-bounce delay-700"></div>
      </div>

      {loading ? (
        <div className="text-center z-10">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center mb-6 mx-auto">
              <Monitor className="w-12 h-12 text-white" />
            </div>
            <p className="text-3xl text-blue-900 font-pixel tracking-wider">
              BOOTING UP<BlinkingCursor />
            </p>
          </div>
          <ProgressBar />
        </div>
      ) : (
        <div className={`transition-all duration-1000 z-10 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] p-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center mb-4 mx-auto">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl text-black font-pixel mb-4 flex items-center justify-center gap-2">
                Hi, I'm Henri
                <BlinkingCursor />
              </h1>
            </div>

            <div className="space-y-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isVerifying}
                    className="w-full p-4 bg-gray-100 border-2 border-black text-black text-center font-pixel placeholder:text-gray-500 focus:outline-none focus:bg-white transition-all duration-300 disabled:opacity-50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]"
                    placeholder="Enter password..."
                    autoComplete="new-password"
                    data-form-type="other"
                    spellCheck="false"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {passwordError && (
                  <div className="bg-red-200 border-2 border-red-600 p-3 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.3)]">
                    <p className="text-red-800 font-pixel text-center">{passwordError}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isVerifying || !password.trim()}
                  className="w-full p-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 border-2 border-black text-white font-pixel transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] active:transform active:translate-x-1 active:translate-y-1"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                      CHECKING...
                    </span>
                  ) : (
                    'LOGIN'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
