import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, Music, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

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
  const location = useLocation();
  const { t } = useSettings();

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

  return (
    <>
      {/* Always keep ReactPlayer mounted for continuous playback */}
      <div className='hidden'>
        <ReactPlayer
          url={playlist2000s[currentTrack]}
          playing={isPlaying}
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
          <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-2 rounded-xl shadow-2xl border-2 border-black/20">
            {/* Inner bezel */}
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg p-1 border border-gray-600">
              {/* Main player body */}
              <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-md p-4 border border-gray-500 shadow-inner">
                
                {/* Top section with display */}
                <div className="mb-4">
                  {/* LCD-style display */}
                  <div className="bg-gradient-to-b from-green-900 to-green-950 p-3 rounded border-2 border-black/50 shadow-inner">
                    <div className="flex items-center justify-between">
                      {/* Track info */}
                      <div className="flex-1">
                        <p className="text-green-400 font-pixel text-xs font-bold drop-shadow-sm">
                          🎵 2000S {t('VIBES')}
                        </p>
                        <p className="text-green-300 text-xs font-pixel">
                          {t('TRACK')} {String(currentTrack + 1).padStart(2, '0')}/{playlist2000s.length}
                        </p>
                      </div>
                      
                      {/* EQ visualization */}
                      <div className="flex items-end h-6 space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-green-400 rounded-full origin-bottom transition-all duration-200 ${
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

                {/* Controls section */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Previous button */}
                  <button
                    onClick={prevTrack}
                    className="relative w-10 h-10 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 rounded-full shadow-lg border-2 border-black/30 hover:from-gray-300 hover:via-gray-400 hover:to-gray-600 transition-all duration-200 active:scale-95"
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
                    <SkipBack className="w-4 h-4 text-gray-100 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
                    className="relative w-10 h-10 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 rounded-full shadow-lg border-2 border-black/30 hover:from-gray-300 hover:via-gray-400 hover:to-gray-600 transition-all duration-200 active:scale-95"
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
                    <SkipForward className="w-4 h-4 text-gray-100 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </button>
                </div>

                {/* Volume and status indicators */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-3 h-3 text-gray-300" />
                    <div className="flex space-x-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-1 h-3 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full shadow-sm"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status LED */}
                  <div className="w-2 h-2 bg-gradient-to-br from-lime-400 to-green-600 rounded-full shadow-sm animate-pulse"></div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full h-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full border border-black/50 shadow-inner overflow-hidden">
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
