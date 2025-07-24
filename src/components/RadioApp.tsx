
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
          fullBackground: 'bg-gradient-to-br from-gray-900 via-purple-900 to-black',
          container: 'bg-gradient-to-br from-gray-800/90 via-gray-900/95 to-black/90 border-2 border-green-400 shadow-2xl shadow-green-400/30 backdrop-blur-lg',
          text: 'text-green-400 font-mono',
          subText: 'text-green-300',
          button: 'bg-gray-800/80 hover:bg-gray-700/80 text-green-400 border border-green-400/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20',
          activeButton: 'bg-green-900/80 text-green-300 border-green-400 shadow-lg shadow-green-400/30 backdrop-blur-sm',
          backButton: 'bg-gray-800/80 hover:bg-gray-700/80 text-green-400 border border-green-400/50 backdrop-blur-sm',
          radioBody: 'bg-gray-800 border-green-400',
          display: 'bg-black/80 border-green-400/70'
        };
      case 'adventure-canyon':
        return {
          fullBackground: 'bg-gradient-to-br from-amber-100 via-orange-200 to-red-300',
          container: 'bg-gradient-to-br from-amber-50/90 via-orange-100/95 to-yellow-200/90 border-2 border-orange-600 shadow-2xl shadow-orange-600/30 backdrop-blur-lg',
          text: 'text-orange-900 font-mono',
          subText: 'text-orange-700',
          button: 'bg-orange-200/80 hover:bg-orange-300/80 text-orange-800 border border-orange-500 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-400/20',
          activeButton: 'bg-orange-400/80 text-orange-900 border-orange-600 shadow-lg shadow-orange-400/30 backdrop-blur-sm',
          backButton: 'bg-orange-200/80 hover:bg-orange-300/80 text-orange-800 border border-orange-500 backdrop-blur-sm',
          radioBody: 'bg-orange-700 border-amber-500',
          display: 'bg-amber-50/90 border-orange-400/70'
        };
      default: // space-mood - Modern cosmic design
        return {
          fullBackground: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          container: 'bg-gradient-to-br from-indigo-800/90 via-purple-800/95 to-blue-800/90 border-2 border-cyan-400 shadow-2xl shadow-cyan-400/30 backdrop-blur-lg',
          text: 'text-cyan-400 font-mono',
          subText: 'text-cyan-300',
          button: 'bg-indigo-800/80 hover:bg-indigo-700/80 text-cyan-400 border border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20',
          activeButton: 'bg-cyan-900/80 text-cyan-300 border-cyan-400 shadow-lg shadow-cyan-400/30 backdrop-blur-sm',
          backButton: 'bg-indigo-800/80 hover:bg-indigo-700/80 text-cyan-400 border border-cyan-400/50 backdrop-blur-sm',
          radioBody: 'bg-indigo-800 border-cyan-400',
          display: 'bg-indigo-950/90 border-cyan-400/70'
        };
    }
  };

  const styles = getThemeStyles();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${styles.fullBackground}`}>
      <div className={`w-full max-w-lg rounded-2xl p-8 relative ${styles.container}`}>
        {/* Modern Radio Design */}
        <div className="relative">
          {/* Radio Body */}
          <div className={`relative w-full h-64 rounded-3xl border-4 ${styles.radioBody} shadow-2xl`}>
            {/* Top Antenna */}
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-12 ${styles.radioBody.includes('gray') ? 'bg-green-400' : styles.radioBody.includes('orange') ? 'bg-amber-400' : 'bg-cyan-400'} rounded-full shadow-lg`} />
            
            {/* Speaker Grille */}
            <div className="absolute top-6 left-6 right-6 h-16 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center">
              <div className="grid grid-cols-8 gap-1 w-full h-full p-2">
                {Array.from({length: 32}).map((_, i) => (
                  <div key={i} className="bg-black/40 rounded-full" />
                ))}
              </div>
            </div>
            
            {/* Digital Display */}
            <div className={`absolute top-24 left-6 right-6 h-16 rounded-xl border-2 ${styles.display} p-3 shadow-inner`}>
              <div className={`text-center ${styles.text}`}>
                <div className="text-lg font-mono font-bold">
                  {musicFiles.length > 0 ? 'FM 88.5' : 'NO SIGNAL'}
                </div>
                <div className={`text-xs ${styles.subText} truncate`}>
                  {musicFiles.length > 0 && currentTrack < musicFiles.length ? 
                    musicFiles[currentTrack]?.title || 'Unknown Track' : 
                    'No music files found'
                  }
                </div>
              </div>
            </div>
            
            {/* Volume/Tuning Knobs */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between">
              <div className={`w-12 h-12 rounded-full border-4 ${styles.radioBody} shadow-lg flex items-center justify-center`}>
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className={`w-12 h-12 rounded-full border-4 ${styles.radioBody} shadow-lg flex items-center justify-center`}>
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            
            {/* Power LED */}
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-600'} border border-white/30`} />
          </div>
          
          {/* Control Panel */}
          <div className="mt-8 space-y-6">
            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={prevTrack}
                disabled={musicFiles.length === 0}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${styles.button} hover:scale-110 transform`}
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={togglePlayPause}
                disabled={musicFiles.length === 0 || isLoading}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${styles.activeButton} shadow-2xl hover:scale-110 transform`}
              >
                {isLoading ? (
                  <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10 ml-1" />
                )}
              </button>
              
              <button
                onClick={nextTrack}
                disabled={musicFiles.length === 0}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${styles.button} hover:scale-110 transform`}
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
            
            {/* Station Info */}
            <div className="text-center space-y-2">
              <h2 className={`text-3xl font-bold ${styles.text} tracking-wider`}>
                RETRO RADIO
              </h2>
              <p className={`text-sm ${styles.subText}`}>
                {musicFiles.length > 0 ? `Track ${currentTrack + 1} of ${musicFiles.length}` : 'Upload music files to start listening'}
              </p>
            </div>
            
            {/* Back Button */}
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 ${styles.backButton} hover:scale-105 transform`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">{t('Back to Desktop')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioApp;
