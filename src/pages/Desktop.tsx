import React, { useState, useEffect } from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import TvApp from '@/components/TvApp';
import MiniMusicPlayer from '@/components/MiniMusicPlayer';
import { Folder, User, Mail, Video, Code, Settings, Radio, Tv, Clock, Star, Loader2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useThemeMusic } from '@/hooks/useThemeMusic';
import { useTvMusicControl } from '@/hooks/useTvMusicControl';
import { useGlobalMusicPlayer } from '@/hooks/useGlobalMusicPlayer';

const Desktop = () => {
  const { t, language } = useSettings();
  const [isTvOpen, setIsTvOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Initialize theme music and TV music control
  useThemeMusic();
  useTvMusicControl(isTvOpen);
  
  const { isPlaying, musicFiles } = useGlobalMusicPlayer();

  console.log('Desktop component rendered, isTvOpen:', isTvOpen);

  const loadingMessages = [
    t('Initializing creative workspace...'),
    t('Loading your personal interface...'),
    t('Setting up digital environment...'),
    t('Almost ready! Preparing final touches...')
  ];

  useEffect(() => {
    // Check if user has seen welcome before
    const hasSeenWelcome = sessionStorage.getItem('desktop-welcome-seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
      return;
    }

    // Animate through loading steps
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  const handleContinue = () => {
    setShowWelcome(false);
    sessionStorage.setItem('desktop-welcome-seen', 'true');
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
              {t('Welcome to Henri\'s Digital Playground')}
            </h1>
            
            <div className="flex items-center justify-center space-x-3 text-white/80">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-lg font-mono">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </div>

          {loadingStep >= loadingMessages.length - 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4 text-white/90">
                <p className="text-lg">
                  {t('Welcome! Explore my creative world through these applications.')}
                </p>
                <p className="text-base text-white/70">
                  {t('Click around, discover projects, watch videos, listen to music, and get to know me better.')}
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-xl font-semibold text-white">
                  {t('Ready to explore?')}
                </p>
                <button
                  onClick={handleContinue}
                  className="px-8 py-3 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 font-semibold backdrop-blur-sm"
                >
                  {t('Continue')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full flex items-start justify-start p-6">
        {/* Consistent grid layout with proper spacing */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full">
          <DesktopIcon icon={Folder} label={t('My Pictures')} to="/pictures" />
          <DesktopIcon icon={Video} label={t('My Videos')} to="/videos" />
          <DesktopIcon icon={Code} label={t('My Projects')} to="/projects" />
          
          {/* Radio App Icon */}
          <DesktopIcon 
            icon={Radio} 
            label={t('Radio')}
            to="/radio"
          />

          {/* TV App Icon */}
          <DesktopIcon 
            icon={Tv} 
            label={t('TV')}
            onClick={() => {
              console.log('TV icon clicked, opening TV app');
              setIsTvOpen(true);
            }}
          />

          {/* Challenge App Icon */}
          <DesktopIcon 
            icon={Clock} 
            label={t('Challenge')}
            to="/challenges"
          />

          {/* Rating/Idea App Icon */}
          <DesktopIcon 
            icon={Star} 
            label={language === 'deutsch' ? 'Ideen-Labor' : 'Idea Lab'}
            to="/idea-lab"
          />

          <DesktopIcon icon={User} label={t('About Me')} to="/about" />
          <DesktopIcon icon={Mail} label={t('Contact')} to="/contact" />
          <DesktopIcon icon={Settings} label={t('Settings')} to="/settings" />
        </div>
      </div>

      {/* TV App Modal */}
      <TvApp 
        isOpen={isTvOpen} 
        onClose={() => {
          console.log('Closing TV app');
          setIsTvOpen(false);
        }} 
      />
      
    </>
  );
};

export default Desktop;