
import React, { useState, useRef } from 'react';
import DesktopIcon from '@/components/DesktopIcon';
import RadioApp from '@/components/RadioApp';
import TvApp from '@/components/TvApp';
import MiniMusicPlayer from '@/components/MiniMusicPlayer';
import { Folder, User, Mail, Video, Code, Settings, Radio, Tv } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Desktop = () => {
  const { t } = useSettings();
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isTvOpen, setIsTvOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleMusicStateChange = (isPlaying: boolean, track: string) => {
    setIsMusicPlaying(isPlaying);
    setCurrentTrack(track);
  };

  const handleMiniPlayerClose = () => {
    // Stop music and hide mini player
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsMusicPlaying(false);
  };

  const handleMiniPlayerTogglePlayPause = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsMusicPlaying(true);
      }
    }
  };

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
            label="Radio" 
            onClick={() => setIsRadioOpen(true)}
          />

          {/* TV App Icon */}
          <DesktopIcon 
            icon={Tv} 
            label="TV" 
            onClick={() => setIsTvOpen(true)}
          />

          <DesktopIcon icon={User} label={t('About Me')} to="/about" />
          <DesktopIcon icon={Mail} label={t('Contact')} to="/contact" />
          <DesktopIcon icon={Settings} label={t('Settings')} to="/settings" />
        </div>
      </div>

      {/* Radio App Modal */}
      <RadioApp 
        isOpen={isRadioOpen} 
        onClose={() => setIsRadioOpen(false)}
        onMusicStateChange={handleMusicStateChange}
      />
      
      {/* TV App Modal */}
      <TvApp isOpen={isTvOpen} onClose={() => setIsTvOpen(false)} />

      {/* Mini Music Player - shows when music is playing and radio is closed */}
      {isMusicPlaying && !isRadioOpen && (
        <MiniMusicPlayer 
          currentTrack={currentTrack}
          onOpenRadio={() => setIsRadioOpen(true)}
          onClose={handleMiniPlayerClose}
          onTogglePlayPause={handleMiniPlayerTogglePlayPause}
          isPlaying={isMusicPlaying}
        />
      )}
    </>
  );
};

export default Desktop;
