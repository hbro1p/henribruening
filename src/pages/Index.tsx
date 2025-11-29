
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useSettings } from '@/contexts/SettingsContext';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import { validateInput, securityMonitor } from '@/utils/securityMonitor';
import { clientRateLimiter } from '@/utils/rateLimiter';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import henriProfile from '@/assets/henri-profile.jpg';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useGlobalAuth();
  const { language, setLanguage, t } = useSettings();
  const navigate = useNavigate();

  // Handle authenticated user redirect - only redirect if authenticated and not loading
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
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

  const sanitizeInput = (input: string): string => {
    return input.replace(/[<>'"&]/g, '');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');
    
    // Rate limiting check
    const clientId = 'login_attempt';
    const rateLimitCheck = clientRateLimiter.checkLimit(clientId);
    
    if (!rateLimitCheck.allowed) {
      setPasswordError('Too many attempts. Please try again later.');
      setIsVerifying(false);
      return;
    }

    // Input validation and sanitization
    const validation = validateInput.password(password);
    if (!validation.valid) {
      setPasswordError(validation.errors[0]);
      setIsVerifying(false);
      return;
    }

    const sanitizedPassword = validateInput.sanitizeText(password);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-password', {
        body: { 
          password: sanitizedPassword,
          section: 'global' 
        }
      });
      
      if (error) {
        throw new Error('Authentication failed');
      }
      
      if (data?.valid) {
        // Record successful attempt
        clientRateLimiter.recordAttempt(clientId, true);
        
        setPasswordError('');
        // Generate secure session token with browser fingerprinting
        const fingerprint = await generateBrowserFingerprint();
        const sessionToken = crypto.randomUUID() + '-' + Date.now();
        const expiresAt = Date.now() + (12 * 60 * 60 * 1000); // Reduced to 12 hours
        
        const sessionData = {
          token: sessionToken,
          authenticated: true,
          expiresAt: expiresAt,
          lastActivity: Date.now(),
          fingerprint: fingerprint
        };
        
        // Store in both sessionStorage and localStorage for persistence across browser restarts
        sessionStorage.setItem('globalAuth', JSON.stringify(sessionData));
        localStorage.setItem('globalAuth', JSON.stringify(sessionData));
        
        // Dispatch custom event to notify auth hook of the change
        window.dispatchEvent(new CustomEvent('globalAuthChange', { detail: sessionData }));
        
        setPassword('');
        
        securityMonitor.logSecurityEvent({
          type: 'AUTHENTICATION_ATTEMPT',
          severity: 'LOW',
          details: { success: true }
        });
      } else {
        // Record failed attempt
        clientRateLimiter.recordAttempt(clientId, false);
        
        securityMonitor.logSecurityEvent({
          type: 'AUTHENTICATION_ATTEMPT',
          severity: 'MEDIUM',
          details: { success: false, reason: 'Invalid password' }
        });
        
        setPasswordError('Wrong password!');
        setPassword('');
      }
    } catch (error) {
      // Record failed attempt
      clientRateLimiter.recordAttempt(clientId, false);
      
      securityMonitor.logSecurityEvent({
        type: 'AUTHENTICATION_ATTEMPT',
        severity: 'HIGH',
        details: { success: false, reason: 'System error' }
      });
      
      setPasswordError('Authentication failed. Please try again.');
      setPassword('');
    } finally {
      setIsVerifying(false);
    }
  };

  const generateBrowserFingerprint = async (): Promise<string> => {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0
    ];
    
    const data = components.join('|');
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleTranslate = () => {
    if (language === 'deutsch') {
      setLanguage('english');
    } else if (language === 'english') {
      setLanguage('español');
    } else {
      setLanguage('deutsch');
    }
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-blue-900 font-pixel">Loading...</p>
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
        <div className={`transition-all duration-1000 z-10 max-w-6xl mx-auto ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Desktop Layout: Side by side cards */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-center">
            {/* Main Login Card */}
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)] p-4 sm:p-8 w-80 sm:w-96 lg:w-[400px] h-80 sm:h-96 lg:h-[420px] flex-shrink-0">
              <div className="text-center mb-4 sm:mb-8 h-32 sm:h-40 lg:h-44">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl text-black font-pixel mb-2 sm:mb-4 flex flex-col items-center justify-center gap-1 sm:gap-2 h-20 sm:h-24 lg:h-28 w-full leading-tight">
                  <div className="flex items-center gap-2">
                    {language === 'deutsch' ? "Hallo, ich bin Henri" : language === 'español' ? "Hola, soy Henri" : "Hi, I'm Henri"}
                    <BlinkingCursor />
                  </div>
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
                      className={`w-full p-4 bg-gray-100 border-2 ${passwordError ? 'border-red-600' : 'border-black'} text-black text-center font-pixel ${passwordError ? 'placeholder:text-red-600' : 'placeholder:text-gray-500'} focus:outline-none focus:bg-white transition-all duration-300 disabled:opacity-50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]`}
                      placeholder={passwordError ? (language === 'deutsch' ? 'Falsches Passwort!' : language === 'español' ? '¡Contraseña incorrecta!' : 'Wrong password!') : (language === 'deutsch' ? 'Passwort eingeben...' : language === 'español' ? 'Ingresar contraseña...' : 'Enter password...')}
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
            
            {/* Information Card - now side by side on desktop */}
            <div className="bg-white/90 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] p-4 sm:p-6 w-80 sm:w-96 lg:w-[400px] h-52 sm:h-64 lg:h-[420px] flex-shrink-0">
              <div className="h-full flex flex-col justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-black font-pixel text-xs sm:text-sm lg:text-base leading-relaxed text-center">
                    {language === 'deutsch' ? (
                      <>
                        Diese Seite ist nicht für jeden.<br />
                        Hinter dieser Tür: Ideen, Gedanken – und ein bisschen Chaos.<br /><br />
                        Wenn du hierher gehörst, kennst du das Passwort.<br />
                        Wenn nicht – vielleicht irgendwann.
                      </>
                    ) : language === 'español' ? (
                      <>
                        Esta página no es para todos.<br />
                        Detrás de esta puerta: ideas, pensamientos y un poco de caos.<br /><br />
                        Si deberías estar aquí, conoces el código.<br />
                        Si no, tal vez algún día.
                      </>
                    ) : (
                      <>
                        This page isn't for everyone.<br />
                        Behind this door: ideas/thoughts and a bit of chaos.<br /><br />
                        If you're supposed to be here, you know the code.<br />
                        If not — well, maybe one day.
                      </>
                    )}
                  </p>
                </div>
                
                <button
                  onClick={handleTranslate}
                  className="w-full p-2 sm:p-3 lg:p-4 bg-gray-200 hover:bg-gray-300 border-2 border-black text-black font-pixel transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] active:transform active:translate-x-1 active:translate-y-1 h-10 sm:h-12 lg:h-14 text-xs sm:text-base lg:text-lg mt-4"
                >
                  Translate
                </button>
              </div>
            </div>
          </div>

          {/* Circular profile photo button */}
          <div className="mt-24 animate-fade-in flex justify-center" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <button
              onClick={() => setShowContactPopup(true)}
              className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/50 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <img 
                src={henriProfile} 
                alt="Henri" 
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          {/* Contact Popup Dialog */}
          <Dialog open={showContactPopup} onOpenChange={setShowContactPopup}>
            <DialogContent className="bg-white/90 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] max-w-sm p-0 gap-0">
              <div className="p-6">
                <p className="text-center font-pixel text-sm md:text-base mb-4 leading-relaxed">
                  {t('askingIsFree')}
                </p>
                <a
                  href="https://ig.me/m/Henribruening"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 text-white hover:bg-blue-600 font-pixel py-3 px-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-center"
                  onClick={() => setShowContactPopup(false)}
                >
                  {t('message')}
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Landing;
