
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
        {/* Clean Windows XP style grid pattern */}
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
        
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-blue-900 font-pixel">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-space-mood relative overflow-hidden flex items-center justify-center p-4">
      {/* Clean Windows XP style grid pattern */}
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
      
      {/* Flying Nature Photos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Nature Photo 1 */}
        <div className="absolute top-16 left-16 w-20 h-16 rounded-lg overflow-hidden shadow-lg opacity-60 animate-bounce" style={{ animationDuration: '6s', animationDelay: '0s' }}>
          <img 
            src="/lovable-uploads/0321fd14-b0f2-474f-8227-bb3c92cfbbb4.png" 
            alt="Nature" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Nature Photo 2 */}
        <div className="absolute top-32 right-20 w-24 h-18 rounded-lg overflow-hidden shadow-lg opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>
          <img 
            src="/lovable-uploads/6ec47f29-1fb9-49bb-8516-e14f19cf4543.png" 
            alt="Nature" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Nature Photo 3 */}
        <div className="absolute bottom-24 left-32 w-18 h-24 rounded-lg overflow-hidden shadow-lg opacity-70 animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}>
          <img 
            src="/lovable-uploads/bddcd903-c8b2-4227-ae73-e02ef74677e8.png" 
            alt="Nature" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Nature Photo 4 */}
        <div className="absolute bottom-40 right-28 w-22 h-16 rounded-lg overflow-hidden shadow-lg opacity-55 animate-pulse" style={{ animationDelay: '3s' }}>
          <img 
            src="/lovable-uploads/b3a7242d-f61a-4825-8f49-a55299aecc3e.png" 
            alt="Nature" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Flying Inspirational Texts */}
        <div className="absolute top-24 left-48 text-blue-800/60 font-pixel text-sm animate-bounce opacity-70" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
          Adventure Awaits
        </div>
        
        <div className="absolute top-48 right-32 text-green-700/60 font-pixel text-xs animate-pulse opacity-60" style={{ animationDelay: '1.5s' }}>
          Explore • Create • Connect
        </div>
        
        <div className="absolute bottom-32 left-48 text-purple-700/60 font-pixel text-sm animate-bounce opacity-70" style={{ animationDuration: '4.5s', animationDelay: '2.5s' }}>
          Capturing Moments
        </div>
        
        <div className="absolute bottom-56 right-48 text-orange-700/60 font-pixel text-xs animate-pulse opacity-65" style={{ animationDelay: '3.5s' }}>
          Bike Tours • Photography • Life
        </div>
        
        <div className="absolute top-40 left-20 text-teal-700/60 font-pixel text-sm animate-bounce opacity-60" style={{ animationDuration: '6s', animationDelay: '4s' }}>
          Stories to Tell
        </div>
        
        <div className="absolute top-60 right-16 text-indigo-700/60 font-pixel text-xs animate-pulse opacity-55" style={{ animationDelay: '4.5s' }}>
          Nature • Business • Creativity
        </div>
        
        {/* Simplified Creative Icons */}
        <Camera className="absolute top-20 left-64 w-6 h-6 text-blue-600/40 animate-pulse delay-100" />
        <Bike className="absolute bottom-48 left-16 w-7 h-7 text-green-600/40 animate-bounce delay-200" style={{ animationDuration: '5s' }} />
        <Mountain className="absolute top-52 right-24 w-6 h-6 text-gray-600/40 animate-pulse delay-300" />
        <TreePine className="absolute bottom-16 right-64 w-6 h-6 text-green-700/40 animate-bounce delay-400" style={{ animationDuration: '4s' }} />
        <Heart className="absolute top-36 right-56 w-5 h-5 text-red-500/40 animate-pulse delay-500" />
        <Sparkles className="absolute bottom-52 left-56 w-6 h-6 text-purple-600/40 animate-pulse delay-600" />
        
        {/* Clean geometric elements */}
        <div className="absolute top-28 left-72 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-36 right-12 w-6 h-6 bg-green-500/20 rounded-full animate-bounce delay-800" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-44 left-8 w-3 h-8 bg-purple-500/20 animate-pulse delay-900"></div>
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
