
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { generateSecureHash } from '@/utils/encryption';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated in this session
    const sessionAuth = sessionStorage.getItem('app_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isVerifying) return;
    
    setIsVerifying(true);
    setError('');

    // Progressive delay based on failed attempts
    if (attempts > 0) {
      const delay = Math.min(2000 * Math.pow(2, attempts - 1), 30000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      const timestamp = Date.now();
      const passwordHash = generateSecureHash(password, timestamp);

      // Verify against the master password
      const { data, error: verifyError } = await supabase.functions.invoke('verify-password', {
        body: { 
          password,
          section: 'master' // New section for main app access
        }
      });

      if (verifyError || !data?.valid) {
        setAttempts(prev => prev + 1);
        setError('Access denied. Invalid credentials.');
        setPassword('');
        
        // Progressive lockout
        if (attempts >= 2) {
          const lockoutTime = Math.min(60000 * Math.pow(2, attempts - 2), 300000); // Max 5 minutes
          setError(`Too many failed attempts. Please wait ${Math.floor(lockoutTime / 1000)} seconds.`);
          setTimeout(() => setError(''), lockoutTime);
        }
        return;
      }

      // Success - store authentication in session
      sessionStorage.setItem('app_authenticated', 'true');
      setIsAuthenticated(true);
      setAttempts(0);
      setPassword('');
      
    } catch (err) {
      setError('Authentication service unavailable. Please try again.');
      setAttempts(prev => prev + 1);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEnter = () => {
    navigate('/desktop');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isVerifying) {
      handlePasswordSubmit(e as any);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-2xl">
        <div>
          <p className="mb-4">H.B. Personal System Initializing...</p>
          <ProgressBar />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div className="max-w-md w-full px-6">
          <h1 className="text-5xl mb-8 flex items-center justify-center">
            Hi, I'm Henri.
            <BlinkingCursor />
          </h1>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Access Code"
              disabled={isVerifying}
              className="text-center text-xl py-3 bg-transparent border-white text-white placeholder:text-gray-400"
              autoComplete="off"
              autoFocus
            />
            
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            
            <Button 
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="w-full text-xl border-2 border-white bg-transparent hover:bg-white hover:text-black transition-colors py-3"
            >
              {isVerifying ? 'Verifying...' : 'Enter'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-center text-2xl">
      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-5xl flex items-center justify-center">
          Welcome back.
          <BlinkingCursor />
        </h1>
        <button 
          onClick={handleEnter}
          className="mt-8 text-xl border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Landing;
