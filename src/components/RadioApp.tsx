import React from 'react';
import { X, Power, Volume2, SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useGlobalMusicPlayer } from '@/hooks/useGlobalMusicPlayer';
import { useAppTheme } from '@/components/shared/AppColorSystem';

interface RadioAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const RadioApp: React.FC<RadioAppProps> = ({ isOpen, onClose }) => {
  const { t } = useSettings();
  const { 
    isPlaying, 
    currentTrack, 
    volume, 
    musicFiles, 
    togglePlayPause, 
    nextTrack, 
    prevTrack,
    setVolume 
  } = useGlobalMusicPlayer();

  // Use red color for Radio app
  const styles = useAppTheme('red');

  const handleClose = () => {
    // Music continues playing when closing the app - just close the window
    onClose();
  };

  if (!isOpen) return null;

  const currentSong = musicFiles[currentTrack] || { title: t('No Music'), artist: t('Unknown') };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${styles.background}`}>
      <div className={`relative w-full max-w-md mx-4 max-h-[95vh] overflow-y-auto ${styles.container} rounded-2xl`}>
        {/* Window controls */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            className={`${styles.subText} hover:bg-white/10 rounded-full p-2 transition-all duration-200`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Radio Design */}
        <div className="p-8">
          {/* Speaker grille */}
          <div className="grid grid-cols-12 gap-1 mb-6 opacity-60">
            {Array.from({ length: 120 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 ${styles.text} rounded-full opacity-30`} />
            ))}
          </div>

          {/* Digital Display */}
          <div className={`${styles.card} rounded-lg p-4 mb-6 text-center border`}>
            <div className={`text-lg font-mono ${styles.text} mb-2`}>
              {t('Now Playing')}
            </div>
            <div className={`text-sm ${styles.subText} truncate`}>
              {currentSong.title}
            </div>
            <div className={`text-xs ${styles.subText} opacity-75 mt-1`}>
              {musicFiles.length > 0 && `${t('Track')} ${currentTrack + 1} ${t('of')} ${musicFiles.length}`}
            </div>
          </div>

          {/* Control Knobs */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={prevTrack}
              className={`${styles.button} rounded-full p-3 transition-all duration-200 hover:scale-105`}
              disabled={musicFiles.length === 0}
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              className={`${styles.button} rounded-full p-4 transition-all duration-200 hover:scale-110`}
              disabled={musicFiles.length === 0}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={nextTrack}
              className={`${styles.button} rounded-full p-3 transition-all duration-200 hover:scale-105`}
              disabled={musicFiles.length === 0}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className={`w-4 h-4 ${styles.accent}`} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 accent-red-500"
            />
          </div>

          {/* Power LED */}
          <div className="flex justify-center">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-400'} transition-all duration-300`} />
          </div>
        </div>

        {/* Back to Desktop */}
        <div className="p-4 border-t border-red-400/30">
          <button
            onClick={handleClose}
            className={`w-full ${styles.button} rounded-lg py-3 transition-all duration-200 hover:scale-[1.02]`}
          >
            {t('Back to Desktop')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadioApp;