import React, { useState } from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import TvApp from '@/components/TvApp';
import MiniMusicPlayer from '@/components/MiniMusicPlayer';
import { Folder, User, Mail, Video, Code, Settings, Radio, Tv, Clock } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useThemeMusic } from '@/hooks/useThemeMusic';
import { useTvMusicControl } from '@/hooks/useTvMusicControl';
import { useGlobalMusicPlayer } from '@/hooks/useGlobalMusicPlayer';

const Desktop = () => {
  const { t, language } = useSettings();
  const [isTvOpen, setIsTvOpen] = useState(false);
  
  // Initialize theme music and TV music control
  useThemeMusic();
  useTvMusicControl(isTvOpen);
  
  const { isPlaying, musicFiles } = useGlobalMusicPlayer();

  // Desktop component rendered

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
              setIsTvOpen(true);
            }}
          />

          {/* Challenge App Icon */}
          <DesktopIcon 
            icon={Clock} 
            label={t('Challenge')}
            to="/challenges"
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
          setIsTvOpen(false);
        }}
      />
      
    </>
  );
};

export default Desktop;