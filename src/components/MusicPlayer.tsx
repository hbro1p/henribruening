import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, Music, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { Slider } from '@/components/ui/slider';

const playlist2000s = [
  "https://www.youtube.com/watch?v=Uw_a2yH_Xpc", // Hey Ya! - OutKast
  "https://www.youtube.com/watch?v=psuRGfAaju4", // Hips Don't Lie - Shakira
  "https://www.youtube.com/watch?v=SR6iYWJxHqs", // Crazy - Gnarls Barkley
  "https://www.youtube.com/watch?v=4JkIs37a2JE", // Since U Been Gone - Kelly Clarkson
  "https://www.youtube.com/watch?v=F57P9C4SAW4", // Hollaback Girl - Gwen Stefani
  "https://www.youtube.com/watch?v=fJ9rUzIMcZQ", // Complicated - Avril Lavigne
  "https://www.youtube.com/watch?v=YQHsXMglC9A", // Bring Me To Life - Evanescence
  "https://www.youtube.com/watch?v=hLQl3WQQoQ0", // SexyBack - Justin Timberlake
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

  return (
    <>
      {/* Always keep ReactPlayer mounted for continuous playback */}
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
      
      {/* Only show visual controls on desktop route */}
      {location.pathname === '/desktop' && (
        <div className="absolute bottom-8 right-8 transform hover:scale-105 transition-all duration-300">
          {/* Outer frame with metallic look */}
          <div className={`p-2 rounded-xl shadow-2xl border-2 ${
            theme === 'dark-vhs' 
              ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-black border-white/20'
              : theme === 'matrix-terminal'
              ? 'bg-gradient-to-br from-green-900 via-black to-green-800 border-green-500/20'
              : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-black/20'
          }`}>
            {/* Inner bezel */}
            <div className={`rounded-lg p-1 border ${
              theme === 'dark-vhs'
                ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border-white/30'
                : theme === 'matrix-terminal'
                ? 'bg-gradient-to-br from-black via-green-900 to-black border-green-500/30'
                : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-600'
            }`}>
              {/* Main player body */}
              <div className={`rounded-md p-4 border shadow-inner ${
                theme === 'dark-vhs'
                  ? 'bg-gradient-to-br from-gray-800 via-black to-gray-900 border-white/20'
                  : theme === 'matrix-terminal'
                  ? 'bg-gradient-to-br from-black via-green-900 to-black border-green-500/20'
                  : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-gray-500'
              }`}>
                
                {/* Top section with display */}
                <div className="mb-4">
                  {/* LCD-style display */}
                  <div className={`p-3 rounded border-2 shadow-inner ${
                    theme === 'dark-vhs'
                      ? 'bg-gradient-to-b from-gray-900 to-black border-white/30'
                      : theme === 'matrix-terminal'
                      ? 'bg-gradient-to-b from-green-900 to-green-950 border-green-500/50'
                      : 'bg-gradient-to-b from-green-900 to-green-950 border-black/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      {/* Track info */}
                      <div className="flex-1">
                        <p className={`font-pixel text-xs font-bold drop-shadow-sm ${
                          theme === 'dark-vhs'
                            ? 'text-white'
                            : 'text-green-400'
                        }`}>
                          🎵 2000S {t('VIBES')}
                        </p>
                        <p className={`text-xs font-pixel ${
                          theme === 'dark-vhs'
                            ? 'text-gray-300'
                            : 'text-green-300'
                        }`}>
                          {t('TRACK')} {String(currentTrack + 1).padStart(2, '0')}/{playlist2000s.length}
                        </p>
                      </div>
                      
                      {/* EQ visualization */}
                      <div className="flex items-end h-6 space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full origin-bottom transition-all duration-200 ${
                              theme === 'dark-vhs' ? 'bg-white' : 'bg-green-400'
                            } ${isPlaying ? 'animate-equalizer' : 'h-2'}`}
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

                {/* Controls section */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Previous button */}
                  <button
                    onClick={prevTrack}
                    className={`relative w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 active:scale-95 ${
                      theme === 'dark-vhs'
                        ? 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 border-white/30 hover:from-gray-400 hover:via-gray-500 hover:to-gray-700'
                        : theme === 'matrix-terminal'
                        ? 'bg-gradient-to-br from-green-600 via-green-700 to-black border-green-500/30 hover:from-green-500 hover:via-green-600 hover:to-green-800'
                        : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 border-black/30 hover:from-gray-300 hover:via-gray-400 hover:to-gray-600'
                    }`}
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
                    <SkipBack className={`w-4 h-4 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                      theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-300' : 'text-gray-100'
                    }`} />
                  </button>
                  
                  {/* Play/Pause button - larger and central */}
                  <button
                    onClick={togglePlayPause}
                    className="relative w-12 h-12 bg-gradient-to-br from-red-400 via-red-500 to-red-700 rounded-full shadow-xl border-2 border-black/30 hover:from-red-300 hover:via-red-400 hover:to-red-600 transition-all duration-200 active:scale-95"
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <div className="absolute inset-x-1 bottom-1 h-3 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
                    {isPlaying ? 
                      <Pause className="w-5 h-5 text-white drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : 
                      <Play className="w-5 h-5 text-white drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-0.5" />
                    }
                  </button>
                  
                  {/* Next button */}
                  <button
                    onClick={nextTrack}
                    className={`relative w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 active:scale-95 ${
                      theme === 'dark-vhs'
                        ? 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 border-white/30 hover:from-gray-400 hover:via-gray-500 hover:to-gray-700'
                        : theme === 'matrix-terminal'
                        ? 'bg-gradient-to-br from-green-600 via-green-700 to-black border-green-500/30 hover:from-green-500 hover:via-green-600 hover:to-green-800'
                        : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 border-black/30 hover:from-gray-300 hover:via-gray-400 hover:to-gray-600'
                    }`}
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
                    <SkipForward className={`w-4 h-4 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                      theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-300' : 'text-gray-100'
                    }`} />
                  </button>
                </div>

                {/* Volume and status indicators */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <Volume2 className={`w-3 h-3 ${
                      theme === 'dark-vhs' ? 'text-white' : theme === 'matrix-terminal' ? 'text-green-400' : 'text-gray-300'
                    }`} />
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
                  
                  {/* Status LED */}
                  <div className={`w-2 h-2 rounded-full shadow-sm animate-pulse ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-lime-400 to-green-600'
                      : 'bg-gradient-to-br from-red-400 to-red-600'
                  }`}></div>
                </div>

                {/* Progress bar */}
                <div className={`mt-3 w-full h-2 rounded-full border shadow-inner overflow-hidden ${
                  theme === 'dark-vhs'
                    ? 'bg-gradient-to-r from-gray-900 to-black border-white/20'
                    : theme === 'matrix-terminal'
                    ? 'bg-gradient-to-r from-black to-green-900 border-green-500/20'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 border-black/50'
                }`}>
                  <div className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-full animate-pulse shadow-sm" style={{ width: '60%' }}></div>
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
