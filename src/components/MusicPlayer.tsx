
import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, Music, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
        <div className="absolute bottom-8 right-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-1 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-4">
              {/* Album art / Visualizer */}
              <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6 text-white drop-shadow-sm" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-pixel font-bold truncate drop-shadow-sm">
                  🎵 2000s Vibes
                </p>
                <p className="text-xs text-cyan-200 truncate font-pixel">
                  Track {currentTrack + 1} of {playlist2000s.length}
                </p>
              </div>
              
              {/* Controls and visualizer */}
              <div className="flex items-center space-x-3">
                {/* Equalizer bars */}
                <div className="flex items-end h-6 space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-gradient-to-t from-cyan-400 to-pink-400 rounded-full origin-bottom transition-all duration-200 ${
                        isPlaying ? 'animate-equalizer' : 'h-2'
                      }`}
                      style={{
                        animationDelay: `${i * 100}ms`,
                        height: isPlaying ? `${Math.random() * 16 + 8}px` : '8px',
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Control buttons */}
                <div className="flex space-x-1">
                  <button
                    onClick={prevTrack}
                    className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 transform-gpu border border-white/20"
                  >
                    <SkipBack className="w-4 h-4 text-white drop-shadow-sm" />
                  </button>
                  
                  <button
                    onClick={togglePlayPause}
                    className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 transform-gpu border border-white/20"
                  >
                    {isPlaying ? 
                      <Pause className="w-4 h-4 text-white drop-shadow-sm" /> : 
                      <Play className="w-4 h-4 text-white drop-shadow-sm ml-0.5" />
                    }
                  </button>
                  
                  <button
                    onClick={nextTrack}
                    className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 transform-gpu border border-white/20"
                  >
                    <SkipForward className="w-4 h-4 text-white drop-shadow-sm" />
                  </button>
                </div>
                
                {/* Volume indicator */}
                <div className="flex items-center">
                  <Volume2 className="w-4 h-4 text-cyan-300 drop-shadow-sm" />
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
