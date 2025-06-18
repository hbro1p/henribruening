
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { supabase } from '@/integrations/supabase/client';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated in this session
    const globalAuth = sessionStorage.getItem('globalAuth');
    if (globalAuth === 'authenticated') {
      setIsAuthenticated(true);
    }

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
        setPassword(''); // Clear password from memory
      } else {
        setPasswordError('Access denied. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {loading ? (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-2xl border-4 border-white/10 flex items-center justify-center mb-6 mx-auto animate-pulse">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
            <p className="text-2xl text-white/90 font-light tracking-wide">
              System Initializing...
            </p>
          </div>
          <ProgressBar />
        </div>
      ) : (
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="text-center max-w-md mx-auto px-6">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl text-white font-light mb-2 flex items-center justify-center">
                Hi, I'm Henri
                <BlinkingCursor />
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {!isAuthenticated ? (
              <div className="space-y-8">
                {/* Security Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Lock className="w-8 h-8 text-purple-300" />
                  </div>
                </div>

                {/* Password Form */}
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-white/70 text-sm font-medium">
                      Access Required
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isVerifying}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-lg focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 placeholder:text-white/30"
                        placeholder="Enter access code..."
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {passwordError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-red-300 text-sm">{passwordError}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isVerifying || !password.trim()}
                    className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-medium text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/20"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </>
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
              <div className="space-y-8">
                {/* Success State */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full border border-green-400/30 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-8 h-8 text-green-400 flex items-center justify-center text-xl font-bold">✓</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-green-400 text-lg font-medium">Access Granted</p>
                  <p className="text-white/60 text-sm">Welcome to my digital space</p>
                </div>

                <button 
                  onClick={handleEnter}
                  className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-medium text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/20"
                >
                  Enter
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
