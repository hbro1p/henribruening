
import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, Music } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube playlist URL as requested
  const audioSrc = "https://www.youtube.com/watch?v=Uw_a2yH_Xpc&list=RDUw_a2yH_Xpc&start_radio=1";

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-8 right-8 bg-windows-gray p-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-64 shadow-2xl font-pixel">
      <div className='hidden'>
        <ReactPlayer
          url={audioSrc}
          playing={isPlaying}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => console.error('ReactPlayer error:', e)}
          width="0"
          height="0"
        />
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 text-black">
          <Music className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-black truncate">Now Playing:</p>
          <p className="text-sm text-black truncate">2000s Throwback</p>
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
            <button
            onClick={togglePlayPause}
            className="p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
            >
            {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
