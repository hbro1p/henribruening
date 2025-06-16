
import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { Slider } from '@/components/ui/slider';

const playlist2000s = [
  "https://www.youtube.com/watch?v=Uw_a2yH_Xpc",
  "https://www.youtube.com/watch?v=psuRGfAaju4",
  "https://www.youtube.com/watch?v=SR6iYWJxHqs",
  "https://www.youtube.com/watch?v=4JkIs37a2JE",
  "https://www.youtube.com/watch?v=F57P9C4SAW4",
  "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  "https://www.youtube.com/watch?v=YQHsXMglC9A",
  "https://www.youtube.com/watch?v=hLQl3WQQoQ0",
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const location = useLocation();
  const { t, theme } = useSettings();

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist2000s.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist2000s.length) % playlist2000s.length);
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'space-mood':
        return {
          outer: 'bg-gradient-to-br from-blue-900/40 via-purple-900/60 to-black border-blue-300/30',
          inner: 'bg-gradient-to-br from-black/80 via-blue-900/20 to-purple-900/20 border-blue-400/20',
          display: 'bg-gradient-to-b from-blue-900/60 to-black border-blue-300/40',
          text: 'text-blue-200',
          accent: 'text-blue-400',
          button: 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 border-blue-300/30 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700',
          led: isPlaying ? 'bg-gradient-to-br from-cyan-400 to-blue-600' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
      case 'dark-vhs':
        return {
          outer: 'bg-gradient-to-br from-gray-700 via-gray-800 to-black border-white/20',
          inner: 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border-white/30',
          display: 'bg-gradient-to-b from-gray-900 to-black border-white/30',
          text: 'text-white',
          accent: 'text-white',
          button: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 border-white/30 hover:from-gray-400 hover:via-gray-500 hover:to-gray-700',
          led: isPlaying ? 'bg-gradient-to-br from-white to-gray-300' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
      case 'matrix-terminal':
        return {
          outer: 'bg-gradient-to-br from-green-900/40 via-black to-green-800/40 border-green-500/20',
          inner: 'bg-gradient-to-br from-black via-green-900/20 to-black border-green-500/30',
          display: 'bg-gradient-to-b from-green-900/60 to-green-950 border-green-500/50',
          text: 'text-green-300',
          accent: 'text-green-400',
          button: 'bg-gradient-to-br from-green-600 via-green-700 to-black border-green-500/30 hover:from-green-500 hover:via-green-600 hover:to-green-800',
          led: isPlaying ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
      case 'retro-chrome':
        return {
          outer: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-black/20',
          inner: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-600',
          display: 'bg-gradient-to-b from-blue-900 to-blue-950 border-black/50',
          text: 'text-blue-200',
          accent: 'text-blue-300',
          button: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 border-black/30 hover:from-gray-300 hover:via-gray-400 hover:to-gray-600',
          led: isPlaying ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
      default:
        return {
          outer: 'bg-gradient-to-br from-blue-900/40 via-purple-900/60 to-black border-blue-300/30',
          inner: 'bg-gradient-to-br from-black/80 via-blue-900/20 to-purple-900/20 border-blue-400/20',
          display: 'bg-gradient-to-b from-blue-900/60 to-black border-blue-300/40',
          text: 'text-blue-200',
          accent: 'text-blue-400',
          button: 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 border-blue-300/30 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700',
          led: isPlaying ? 'bg-gradient-to-br from-cyan-400 to-blue-600' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <>
      <div className='hidden'>
        <ReactPlayer
          url={playlist2000s[currentTrack]}
          playing={isPlaying}
          volume={volume}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onError={(e) => console.error('ReactPlayer error:', e)}
          width="0"
          height="0"
        />
      </div>
      
      {location.pathname === '/desktop' && (
        <div className="absolute bottom-8 right-8 transform hover:scale-105 transition-all duration-300">
          <div className={`p-2 rounded-xl shadow-2xl border-2 ${styles.outer}`}>
            <div className={`rounded-lg p-1 border ${styles.inner}`}>
              <div className={`rounded-md p-4 border shadow-inner ${styles.inner}`}>
                
                {/* Display */}
                <div className="mb-4">
                  <div className={`p-3 rounded border-2 shadow-inner ${styles.display}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`font-pixel text-xs font-bold drop-shadow-sm ${styles.accent}`}>
                          🎵 2000S {t('VIBES')}
                        </p>
                        <p className={`text-xs font-pixel ${styles.text}`}>
                          {t('TRACK')} {String(currentTrack + 1).padStart(2, '0')}/{playlist2000s.length}
                        </p>
                      </div>
                      
                      {/* EQ visualization */}
                      <div className="flex items-end h-6 space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full origin-bottom transition-all duration-200 ${styles.accent.replace('text-', 'bg-')} ${
                              isPlaying ? 'animate-equalizer' : 'h-2'
                            }`}
                            style={{
                              animationDelay: `${i * 100}ms`,
                              height: isPlaying ? `${Math.random() * 16 + 8}px` : '8px',
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-2">
                  <button onClick={prevTrack} className={`relative w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 active:scale-95 ${styles.button}`}>
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <SkipBack className={`w-4 h-4 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${styles.text}`} />
                  </button>
                  
                  <button onClick={togglePlayPause} className="relative w-12 h-12 bg-gradient-to-br from-red-400 via-red-500 to-red-700 rounded-full shadow-xl border-2 border-black/30 hover:from-red-300 hover:via-red-400 hover:to-red-600 transition-all duration-200 active:scale-95">
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    {isPlaying ? 
                      <Pause className="w-5 h-5 text-white drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : 
                      <Play className="w-5 h-5 text-white drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-0.5" />
                    }
                  </button>
                  
                  <button onClick={nextTrack} className={`relative w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 active:scale-95 ${styles.button}`}>
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <SkipForward className={`w-4 h-4 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${styles.text}`} />
                  </button>
                </div>

                {/* Volume and status */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <Volume2 className={`w-3 h-3 ${styles.accent}`} />
                    <div className="flex-1 max-w-20">
                      <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        max={1}
                        min={0}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className={`w-2 h-2 rounded-full shadow-sm animate-pulse ${styles.led}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
