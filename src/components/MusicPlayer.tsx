import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, Music, SkipForward, SkipBack } from 'lucide-react';
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
        <div className="absolute bottom-8 right-8 bg-windows-gray p-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-80 shadow-2xl font-pixel">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-black">
              <Music className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-black truncate font-bold">Vibe: 2000s mix playing</p>
              <p className="text-xs text-black truncate">Nostalgic hits collection</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-end h-5 space-x-1`}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-black origin-bottom ${isPlaying ? 'animate-equalizer' : ''}`}
                    style={{
                      animationDelay: `${i * 150}ms`,
                      transform: `scaleY(${isPlaying ? 1 : 0.3})`,
                      transition: 'transform 0.2s ease-out'
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={prevTrack}
                  className="p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
                >
                  <SkipBack className="w-4 h-4 text-black" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black" />}
                </button>
                <button
                  onClick={nextTrack}
                  className="p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
                >
                  <SkipForward className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
