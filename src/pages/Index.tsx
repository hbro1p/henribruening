
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { supabase } from '@/integrations/supabase/client';
import { Lock, ArrowRight } from 'lucide-react';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated in this session
    const globalAuth = sessionStorage.getItem('globalAuth');
    if (globalAuth === 'authenticated') {
      setIsAuthenticated(true);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Fake loading time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500); // Short delay before showing content
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-password', {
        body: { password, section: 'global' }
      });
      
      if (error) throw error;
      
      if (data.valid) {
        setIsAuthenticated(true);
        setPasswordError('');
        sessionStorage.setItem('globalAuth', 'authenticated');
      } else {
        setPasswordError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Password verification failed:', error);
      setPasswordError('Authentication failed. Please try again.');
      setPassword('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEnter = () => {
    navigate('/desktop');
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-center text-2xl">
      {loading ? (
        <div>
          <p className="mb-4">H.B. Personal System Initializing...</p>
          <ProgressBar />
        </div>
      ) : (
        <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg border-4 border-white/20 flex items-center justify-center mb-6 mx-auto">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl mb-4 font-bold">
                  Secure Access Required
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                  Enter the access code to continue
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isVerifying}
                    className="w-full p-4 bg-gray-800/50 border-2 border-gray-600 rounded-lg text-white text-center text-xl focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                    placeholder="Enter access code..."
                    autoComplete="current-password"
                  />
                </div>
                
                {passwordError && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{passwordError}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isVerifying || !password}
                  className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    'Verifying...'
                  ) : (
                    <>
                      Authenticate
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h1 className="text-5xl flex items-center justify-center mb-4">
                Hi, I'm Henri.
                <BlinkingCursor />
              </h1>
              <p className="text-lg text-green-400 mb-8">Access Granted ✓</p>
              <button 
                onClick={handleEnter}
                className="text-xl border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
              >
                Enter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Landing;
