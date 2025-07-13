
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Camera, Video, Edit3, Compass, Mountain, Zap, Sparkles, Aperture, Film, Play } from 'lucide-react';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useGlobalAuth();
  const navigate = useNavigate();

  // Handle authenticated user redirect - only redirect if authenticated and not loading
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log('User is authenticated, redirecting to desktop');
      navigate('/desktop', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');
    
    console.log('Attempting login with password:', password);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-password', {
        body: { 
          password: password,
          section: 'global' 
        }
      });
      
      console.log('Function response:', { data, error });
      
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
        
        // Dispatch custom event to notify auth hook of the change
        window.dispatchEvent(new CustomEvent('globalAuthChange', { detail: sessionData }));
        
        setPassword('');
        console.log('Login successful, session stored and event dispatched');
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

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Creative layered backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-pink-500/20"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/10 via-transparent to-green-400/10"></div>
        
        {/* Dynamic pixel grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        
        {/* Subtle floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-32 left-32 w-6 h-6 text-purple-300/40 animate-pulse" />
          <Camera className="absolute bottom-32 right-32 w-6 h-6 text-blue-300/40 animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-white/60 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-white/80 font-pixel">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Creative layered backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-pink-500/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/10 via-transparent to-green-400/10"></div>
      
      {/* Dynamic pixel grid with creative twist */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />
      
      {/* Floating creative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Content Creation Icons */}
        <Camera className="absolute top-20 left-16 w-8 h-8 text-blue-300/60 animate-bounce delay-100" style={{ animationDuration: '3s' }} />
        <Video className="absolute top-32 right-20 w-6 h-6 text-purple-300/60 animate-bounce delay-200" style={{ animationDuration: '4s' }} />
        <Aperture className="absolute bottom-40 left-32 w-7 h-7 text-cyan-300/60 animate-spin" style={{ animationDuration: '8s' }} />
        <Film className="absolute bottom-32 right-40 w-6 h-6 text-pink-300/60 animate-pulse delay-300" />
        <Edit3 className="absolute top-48 left-24 w-5 h-5 text-yellow-300/60 animate-bounce delay-400" style={{ animationDuration: '3.5s' }} />
        <Play className="absolute top-60 right-32 w-6 h-6 text-green-300/60 animate-pulse delay-500" />
        
        {/* Adventure Elements */}
        <Compass className="absolute top-36 right-16 w-8 h-8 text-orange-300/60 animate-spin delay-100" style={{ animationDuration: '6s' }} />
        <Mountain className="absolute bottom-48 right-24 w-7 h-7 text-blue-200/60 animate-pulse delay-200" />
        <Zap className="absolute top-56 left-40 w-6 h-6 text-yellow-400/60 animate-bounce delay-300" style={{ animationDuration: '2.5s' }} />
        <Sparkles className="absolute bottom-56 left-16 w-6 h-6 text-purple-200/60 animate-pulse delay-400" />
        
        {/* Abstract Creative Shapes */}
        <div className="absolute top-24 left-48 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full animate-bounce delay-500 opacity-60" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-36 right-48 w-3 h-8 bg-gradient-to-t from-cyan-400 to-blue-600 animate-pulse delay-600 opacity-50"></div>
        <div className="absolute top-40 left-64 w-6 h-6 bg-gradient-to-tr from-yellow-400 to-orange-600 rotate-45 animate-spin opacity-40" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-24 left-56 w-5 h-2 bg-gradient-to-r from-green-400 to-teal-600 animate-bounce delay-700 opacity-60" style={{ animationDuration: '3s' }}></div>
        
        {/* Floating orbs of creativity */}
        <div className="absolute top-16 right-56 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute bottom-16 left-48 w-16 h-16 bg-gradient-to-tr from-pink-400/15 to-yellow-500/15 rounded-full animate-bounce blur-md delay-800" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-52 right-64 w-8 h-8 bg-gradient-to-bl from-cyan-400/25 to-green-500/25 rounded-full animate-pulse delay-900 blur-sm"></div>
        
        {/* Exploration trails */}
        <div className="absolute top-28 left-36 w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute bottom-44 right-36 w-32 h-px bg-gradient-to-l from-transparent via-blue-300/40 to-transparent animate-pulse delay-1100"></div>
        
        {/* Pixelated adventure elements */}
        <div className="absolute top-44 right-44 grid grid-cols-3 gap-1 opacity-40">
          <div className="w-2 h-2 bg-cyan-400 animate-pulse delay-1200"></div>
          <div className="w-2 h-2 bg-purple-400 animate-pulse delay-1300"></div>
          <div className="w-2 h-2 bg-pink-400 animate-pulse delay-1400"></div>
        </div>
        <div className="absolute bottom-52 left-44 grid grid-cols-2 gap-1 opacity-50">
          <div className="w-3 h-3 bg-yellow-400 animate-bounce delay-1500" style={{ animationDuration: '2s' }}></div>
          <div className="w-3 h-3 bg-orange-400 animate-bounce delay-1600" style={{ animationDuration: '2.2s' }}></div>
        </div>
      </div>
      
      {/* Ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>

      {loading ? (
        <div className="text-center z-10">
          <div className="mb-8">
            <p className="text-3xl text-white/90 font-pixel tracking-wider">
              BOOTING UP<BlinkingCursor />
            </p>
          </div>
          <ProgressBar />
        </div>
      ) : (
        <div className={`transition-all duration-1000 z-10 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] p-8 max-w-md mx-auto">
            <div className="text-center mb-8">
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
