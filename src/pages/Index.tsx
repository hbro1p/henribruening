
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { supabase } from '@/integrations/supabase/client';
import { 
  Eye, EyeOff, Camera, Video, Edit3, Compass, Mountain, Zap, 
  Sparkles, Aperture, Film, Play, Bike, TreePine, Heart, 
  Users, Globe, Briefcase, Star, Sun, Wind, MapPin, Instagram,
  Youtube, Linkedin
} from 'lucide-react';

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
      <div className="min-h-screen theme-space-mood relative overflow-hidden flex items-center justify-center">
        {/* Windows XP style grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Subtle floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-32 left-32 w-6 h-6 text-blue-600/30 animate-pulse" />
          <Camera className="absolute bottom-32 right-32 w-6 h-6 text-blue-700/30 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-blue-900 font-pixel">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-space-mood relative overflow-hidden flex items-center justify-center p-4">
      {/* Windows XP style grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Henri's Passionate World - Floating Story Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Adventure & Bike Tours */}
        <Bike className="absolute top-16 left-16 w-10 h-10 text-blue-600/50 animate-bounce delay-100" style={{ animationDuration: '4s' }} />
        <Mountain className="absolute top-24 right-20 w-8 h-8 text-blue-700/40 animate-pulse delay-200" />
        <TreePine className="absolute bottom-32 left-24 w-9 h-9 text-green-600/45 animate-pulse delay-300" />
        <Compass className="absolute top-48 right-32 w-7 h-7 text-orange-600/50 animate-spin delay-100" style={{ animationDuration: '8s' }} />
        <Sun className="absolute top-20 left-64 w-8 h-8 text-yellow-600/50 animate-pulse delay-400" />
        <Wind className="absolute bottom-48 right-48 w-6 h-6 text-cyan-600/40 animate-bounce delay-500" style={{ animationDuration: '3s' }} />
        <MapPin className="absolute top-60 left-32 w-6 h-6 text-red-600/50 animate-pulse delay-600" />
        
        {/* Content Creation & Videography */}
        <Camera className="absolute top-32 left-48 w-9 h-9 text-blue-800/50 animate-bounce delay-200" style={{ animationDuration: '3.5s' }} />
        <Video className="absolute bottom-24 right-64 w-8 h-8 text-purple-600/50 animate-pulse delay-300" />
        <Film className="absolute top-56 right-16 w-7 h-7 text-indigo-600/45 animate-bounce delay-400" style={{ animationDuration: '4s' }} />
        <Aperture className="absolute bottom-56 left-48 w-8 h-8 text-teal-600/50 animate-spin delay-500" style={{ animationDuration: '10s' }} />
        <Edit3 className="absolute top-40 left-20 w-6 h-6 text-green-700/50 animate-bounce delay-600" style={{ animationDuration: '2.8s' }} />
        <Play className="absolute bottom-40 right-20 w-7 h-7 text-pink-600/50 animate-pulse delay-700" />
        
        {/* Social Media & Connections */}
        <Instagram className="absolute top-44 left-60 w-7 h-7 text-pink-700/50 animate-bounce delay-800" style={{ animationDuration: '3.2s' }} />
        <Youtube className="absolute bottom-60 right-40 w-8 h-8 text-red-600/50 animate-pulse delay-900" />
        <Linkedin className="absolute top-28 right-56 w-6 h-6 text-blue-800/50 animate-bounce delay-1000" style={{ animationDuration: '3.8s' }} />
        <Users className="absolute bottom-44 left-56 w-8 h-8 text-blue-700/45 animate-pulse delay-1100" />
        <Globe className="absolute top-52 left-8 w-7 h-7 text-green-600/50 animate-spin delay-1200" style={{ animationDuration: '12s' }} />
        
        {/* Business & Creativity */}
        <Briefcase className="absolute top-36 left-72 w-7 h-7 text-gray-700/50 animate-bounce delay-1300" style={{ animationDuration: '4.2s' }} />
        <Star className="absolute bottom-28 left-40 w-6 h-6 text-yellow-700/50 animate-pulse delay-1400" />
        <Sparkles className="absolute top-64 right-56 w-8 h-8 text-purple-600/50 animate-pulse delay-1500" />
        <Heart className="absolute bottom-52 right-28 w-7 h-7 text-red-500/50 animate-bounce delay-1600" style={{ animationDuration: '2.5s' }} />
        <Zap className="absolute top-24 left-36 w-6 h-6 text-yellow-600/50 animate-bounce delay-1700" style={{ animationDuration: '2.2s' }} />
        
        {/* Creative Abstract Elements - Story Telling */}
        <div className="absolute top-20 right-40 w-6 h-6 bg-blue-600/30 rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-36 left-64 w-4 h-12 bg-gradient-to-t from-green-500/30 to-blue-600/30 animate-bounce delay-200" style={{ animationDuration: '3.5s' }}></div>
        <div className="absolute top-48 left-56 w-8 h-8 bg-gradient-to-br from-purple-500/25 to-pink-600/25 rotate-45 animate-spin delay-300" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-20 right-52 w-12 h-3 bg-gradient-to-r from-cyan-500/30 to-blue-700/30 animate-pulse delay-400"></div>
        
        {/* Adventure Trail Lines */}
        <div className="absolute top-32 left-28 w-32 h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent animate-pulse delay-500"></div>
        <div className="absolute bottom-48 right-32 w-40 h-px bg-gradient-to-l from-transparent via-green-600/30 to-transparent animate-pulse delay-600"></div>
        <div className="absolute top-56 right-48 w-28 h-px bg-gradient-to-r from-transparent via-purple-600/30 to-transparent animate-pulse delay-700"></div>
        
        {/* Passion Pixels - Creative Clusters */}
        <div className="absolute top-40 right-60 grid grid-cols-3 gap-1 opacity-40">
          <div className="w-2 h-2 bg-blue-600 animate-pulse delay-800"></div>
          <div className="w-2 h-2 bg-green-600 animate-pulse delay-900"></div>
          <div className="w-2 h-2 bg-purple-600 animate-pulse delay-1000"></div>
          <div className="w-2 h-2 bg-orange-600 animate-pulse delay-1100"></div>
          <div className="w-2 h-2 bg-red-600 animate-pulse delay-1200"></div>
          <div className="w-2 h-2 bg-cyan-600 animate-pulse delay-1300"></div>
        </div>
        
        <div className="absolute bottom-32 left-12 grid grid-cols-2 gap-1 opacity-50">
          <div className="w-3 h-3 bg-yellow-600 animate-bounce delay-1400" style={{ animationDuration: '2.1s' }}></div>
          <div className="w-3 h-3 bg-pink-600 animate-bounce delay-1500" style={{ animationDuration: '2.3s' }}></div>
          <div className="w-3 h-3 bg-indigo-600 animate-bounce delay-1600" style={{ animationDuration: '1.9s' }}></div>
          <div className="w-3 h-3 bg-teal-600 animate-bounce delay-1700" style={{ animationDuration: '2.4s' }}></div>
        </div>
        
        {/* Floating Story Bubbles */}
        <div className="absolute top-12 left-52 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute bottom-12 right-16 w-20 h-20 bg-green-500/10 rounded-full animate-bounce blur-md delay-800" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-44 right-72 w-12 h-12 bg-purple-500/15 rounded-full animate-pulse delay-900 blur-sm"></div>
        <div className="absolute bottom-56 left-68 w-14 h-14 bg-orange-500/12 rounded-full animate-bounce delay-1000 blur-sm" style={{ animationDuration: '5s' }}></div>
      </div>

      {loading ? (
        <div className="text-center z-10">
          <div className="mb-8">
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
