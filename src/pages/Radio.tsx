
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, SkipForward, SkipBack, ArrowLeft } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useGlobalMusicPlayer } from '@/hooks/useGlobalMusicPlayer';

const Radio = () => {
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

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-red-300 via-red-400 to-red-600',
        titleBar: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
        windowContent: 'bg-gradient-to-br from-red-200 via-red-300 to-red-400',
        text: 'text-red-900',
        link: 'text-red-800 hover:text-red-900',
        button: 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:via-red-500 hover:to-red-700 text-white',
        input: 'bg-red-50 border-red-600 text-red-900',
        cardBg: 'bg-red-50 border-red-600',
        radioBody: 'bg-red-500 border-red-700',
        display: 'bg-red-100 border-red-700',
        led: isPlaying ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-600'
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-blue-800 hover:text-blue-900',
      button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
      input: 'bg-white border-black text-black',
      cardBg: 'bg-white border-black',
      radioBody: 'bg-gray-500 border-gray-700',
      display: 'bg-gray-100 border-gray-700',
      led: isPlaying ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-600'
    };
  };

  const styles = getWindowStyles();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-red' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Radio.exe</span>
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ RETRO RADIO ]</h1>
            
            {/* Radio Body */}
            <div className={`relative w-full max-w-md h-64 rounded-3xl border-4 ${styles.radioBody} shadow-2xl mb-8`}>
              {/* Top Antenna */}
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-red-600 rounded-full shadow-lg`} />
              
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
                  <div className="text-lg font-pixel font-bold">
                    {musicFiles.length > 0 ? 'FM 88.5' : 'NO SIGNAL'}
                  </div>
                  <div className={`text-xs ${styles.text} truncate`}>
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
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${styles.led} border border-white/30`} />
            </div>
            
            {/* Control Panel */}
            <div className="space-y-6 w-full max-w-md">
              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={prevTrack}
                  disabled={musicFiles.length === 0}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${styles.button} hover:scale-110 transform border-2 border-black/30`}
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  disabled={musicFiles.length === 0 || isLoading}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${styles.button} shadow-2xl hover:scale-110 transform border-2 border-black/30`}
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
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${styles.button} hover:scale-110 transform border-2 border-black/30`}
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
              
              {/* Station Info */}
              <div className={`p-4 border-2 ${styles.cardBg} rounded`}>
                <p className={`font-pixel text-sm ${styles.text}`}>
                  {musicFiles.length > 0 ? `Track ${currentTrack + 1} of ${musicFiles.length}` : 'Upload music files to start listening'}
                </p>
              </div>
            </div>

            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
              <ArrowLeft className="w-5 h-5" />
              {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Radio;
