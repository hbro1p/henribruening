
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { supabase } from '@/integrations/supabase/client';
import { Lock, ArrowRight, Eye, EyeOff, Monitor } from 'lucide-react';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Clear authentication on page load (forces re-login every time)
  useEffect(() => {
    sessionStorage.removeItem('globalAuth');
    localStorage.removeItem('globalAuth');
    
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
        setPassword('');
      } else {
        setPasswordError('Access denied. Invalid credentials.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      {loading ? (
        <div className="text-center z-10">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
              <Monitor className="w-10 h-10 text-white" />
            </div>
            <p className="text-2xl text-white/90 font-mono tracking-wider">
              System Initializing<BlinkingCursor />
            </p>
          </div>
          <ProgressBar />
        </div>
      ) : (
        <div className={`transition-all duration-1000 z-10 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 max-w-md mx-auto shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl shadow-lg border border-white/20 flex items-center justify-center mb-4 mx-auto">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl text-white font-mono mb-2 flex items-center justify-center gap-1">
                Hi, I'm Henri
                <BlinkingCursor />
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"></div>
            </div>

            {!isAuthenticated ? (
              <div className="space-y-6">
                {/* Security prompt */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20">
                    <Lock className="w-6 h-6 text-blue-300" />
                  </div>
                  <p className="text-white/80 text-sm font-mono">Access Required</p>
                </div>

                {/* Password Form */}
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isVerifying}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white text-center font-mono placeholder:text-white/40 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
                      placeholder="Enter access code..."
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {passwordError && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 backdrop-blur-sm">
                      <p className="text-red-300 text-sm font-mono text-center">{passwordError}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isVerifying || !password.trim()}
                    className="w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-white font-mono transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/25 border border-white/10"
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
              <div className="space-y-6 text-center">
                {/* Success State */}
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl border border-green-400/30">
                    <div className="w-6 h-6 text-green-400 flex items-center justify-center text-lg font-bold">✓</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-400 font-mono">Access Granted</p>
                    <p className="text-white/60 text-sm font-mono">Welcome to my digital workspace</p>
                  </div>
                </div>

                <button 
                  onClick={handleEnter}
                  className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-mono transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/25 border border-white/10"
                >
                  Enter Desktop
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="text-center mt-6">
            <p className="text-white/40 text-xs font-mono">Secure access to Henri's digital space</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
