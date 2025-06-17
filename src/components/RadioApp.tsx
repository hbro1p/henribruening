
import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Radio, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useGlobalMusicPlayer } from '@/hooks/useGlobalMusicPlayer';

interface RadioAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const RadioApp: React.FC<RadioAppProps> = ({ isOpen, onClose }) => {
  const { t, theme } = useSettings();
  const {
    isPlaying,
    currentTrack,
    volume,
    isLoading,
    musicFiles,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setVolume
  } = useGlobalMusicPlayer();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleClose = () => {
    // Music continues playing when closing the app - just close the window
    onClose();
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return {
          container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-green-400 shadow-lg shadow-green-400/20',
          text: 'text-green-400 font-mono',
          subText: 'text-green-300',
          button: 'bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-400/50',
          activeButton: 'bg-green-900 text-green-300 border-green-400',
          accent: 'bg-green-400',
          volumeSlider: 'accent-green-400',
          closeButton: 'bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-400/50'
        };
      case 'retro-chrome':
        return {
          container: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-2 border-blue-600 shadow-lg',
          text: 'text-blue-900 font-mono',
          subText: 'text-blue-700',
          button: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-500',
          activeButton: 'bg-blue-400 text-blue-800 border-blue-600',
          accent: 'bg-blue-500',
          volumeSlider: 'accent-blue-500',
          closeButton: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-500'
        };
      default: // space-mood - RED theme to match desktop icon
        return {
          container: 'bg-gradient-to-br from-red-100 via-red-200 to-red-300 border-2 border-red-600 shadow-lg shadow-red-600/20',
          text: 'text-red-900 font-mono',
          subText: 'text-red-700',
          button: 'bg-red-200 hover:bg-red-300 text-red-800 border border-red-500',
          activeButton: 'bg-red-400 text-red-800 border-red-600',
          accent: 'bg-red-500',
          volumeSlider: 'accent-red-500',
          closeButton: 'bg-red-200 hover:bg-red-300 text-red-800 border border-red-500'
        };
    }
  };

  const styles = getThemeStyles();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-96 max-w-full rounded-lg p-6 relative ${styles.container}`}>
        {/* Header with Close button only */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`relative w-20 h-16 rounded-lg flex items-center justify-center ${isPlaying ? styles.accent : 'bg-gray-600'} shadow-lg border-2`}>
              {/* Speaker grilles */}
              <div className="absolute left-1 top-2 bottom-2 w-2 bg-black/30 rounded-sm flex flex-col justify-around">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-0.5 bg-white/20 rounded" />
                ))}
              </div>
              <div className="absolute right-1 top-2 bottom-2 w-2 bg-black/30 rounded-sm flex flex-col justify-around">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-0.5 bg-white/20 rounded" />
                ))}
              </div>
              
              {/* Center antenna */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400 rounded-full" />
              
              <Radio className="w-8 h-8 text-white z-10" />
            </div>
            
            <div>
              <h2 className={`text-xl font-bold ${styles.text}`}>
                RETRO RADIO
              </h2>
              <p className={`text-sm ${styles.subText}`}>
                {musicFiles.length > 0 ? 'FM 88.5' : 'NO SIGNAL'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className={`w-8 h-8 rounded flex items-center justify-center ${styles.closeButton}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Station Info - Static, no animations */}
        <div className="text-center mb-6">
          <div className={`bg-black/30 rounded p-3 border ${theme === 'retro-chrome' ? 'border-blue-400/30 bg-white/10' : theme === 'space-mood' ? 'border-red-400/30 bg-red-50/10' : 'border-current/30'}`}>
            <p className={`text-sm mb-1 ${styles.text}`}>
              {musicFiles.length > 0 ? '♪ NOW PLAYING ♪' : 'NO SIGNAL'}
            </p>
            <p className={`text-xs ${styles.subText} truncate`}>
              {musicFiles.length > 0 ? musicFiles[currentTrack]?.title || 'Unknown Track' : 'Upload music to /music/ folder'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={prevTrack}
            disabled={musicFiles.length === 0}
            className={`w-12 h-12 rounded flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={musicFiles.length === 0 || isLoading}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${styles.activeButton} shadow-lg`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          
          <button
            onClick={nextTrack}
            disabled={musicFiles.length === 0}
            className={`w-12 h-12 rounded flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Volume2 className={`w-4 h-4 ${styles.text}`} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className={`flex-1 h-2 rounded appearance-none cursor-pointer ${theme === 'retro-chrome' ? 'bg-blue-300' : theme === 'space-mood' ? 'bg-red-300' : 'bg-gray-600'} ${styles.volumeSlider}`}
          />
          <span className={`text-xs font-mono ${styles.subText}`}>
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Station Display */}
        <div className={`mt-4 text-center text-xs ${styles.subText}`}>
          {musicFiles.length > 0 ? `Track ${currentTrack + 1}/${musicFiles.length}` : 'No tracks loaded'}
        </div>
      </div>
    </div>
  );
};

export default RadioApp;
