
import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Radio, ArrowLeft } from 'lucide-react';
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
    isLoading,
    musicFiles,
    togglePlayPause,
    nextTrack,
    prevTrack
  } = useGlobalMusicPlayer();

  const handleClose = () => {
    // Music continues playing when closing the app - just close the window
    onClose();
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return {
          fullBackground: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
          container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-green-400 shadow-lg shadow-green-400/20',
          text: 'text-green-400 font-mono',
          subText: 'text-green-300',
          button: 'bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-400/50',
          activeButton: 'bg-green-900 text-green-300 border-green-400',
          backButton: 'bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-400/50'
        };
      case 'adventure-canyon':
        return {
          fullBackground: 'bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300',
          container: 'bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300 border-2 border-orange-600 shadow-lg',
          text: 'text-orange-900 font-mono',
          subText: 'text-orange-700',
          button: 'bg-orange-200 hover:bg-orange-300 text-orange-800 border border-orange-500',
          activeButton: 'bg-orange-400 text-orange-800 border-orange-600',
          backButton: 'bg-orange-200 hover:bg-orange-300 text-orange-800 border border-orange-500'
        };
      default: // space-mood - RED theme to match desktop icon
        return {
          fullBackground: 'bg-gradient-to-br from-red-100 via-red-200 to-red-300',
          container: 'bg-gradient-to-br from-red-100 via-red-200 to-red-300 border-2 border-red-600 shadow-lg shadow-red-600/20',
          text: 'text-red-900 font-mono',
          subText: 'text-red-700',
          button: 'bg-red-200 hover:bg-red-300 text-red-800 border border-red-500',
          activeButton: 'bg-red-400 text-red-800 border-red-600',
          backButton: 'bg-red-200 hover:bg-red-300 text-red-800 border border-red-500'
        };
    }
  };

  const styles = getThemeStyles();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${styles.fullBackground}`}>
      <div className={`w-96 max-w-full rounded-lg p-6 relative ${styles.container}`}>
        {/* Header with Radio Icon and Title */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`relative w-20 h-16 rounded-lg flex items-center justify-center ${isPlaying ? 'bg-red-500' : 'bg-gray-600'} shadow-lg border-2`}>
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
            
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${styles.text}`}>
                RETRO RADIO
              </h2>
              <p className={`text-sm ${styles.subText}`}>
                {musicFiles.length > 0 ? 'FM 88.5' : 'NO SIGNAL'}
              </p>
            </div>
          </div>
        </div>

        {/* Station Info Display */}
        <div className="text-center mb-6">
          <div className={`bg-black/20 rounded-lg p-4 border-2 ${theme === 'adventure-canyon' ? 'border-orange-400/50 bg-white/20' : theme === 'space-mood' ? 'border-red-400/50 bg-red-50/20' : 'border-green-400/50'}`}>
            <p className={`text-lg font-bold mb-2 ${styles.text}`}>
              {musicFiles.length > 0 ? '♪ NOW PLAYING ♪' : 'NO SIGNAL'}
            </p>
            <p className={`text-sm ${styles.subText} truncate`}>
              {musicFiles.length > 0 && currentTrack < musicFiles.length ? 
                musicFiles[currentTrack]?.title || 'Unknown Track' : 
                'Upload music to /music/ folder'
              }
            </p>
            <p className={`text-xs mt-1 ${styles.subText}`}>
              {musicFiles.length > 0 ? `Track ${currentTrack + 1} of ${musicFiles.length}` : ''}
            </p>
          </div>
        </div>

        {/* Back to Desktop Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${styles.backButton}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('Back to Desktop')}</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={prevTrack}
            disabled={musicFiles.length === 0}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 ${styles.button} hover:scale-105`}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={musicFiles.length === 0 || isLoading}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${styles.activeButton} shadow-lg hover:scale-105`}
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
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 ${styles.button} hover:scale-105`}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadioApp;
