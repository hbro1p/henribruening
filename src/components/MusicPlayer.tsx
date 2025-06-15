
import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, Music, Rewind, FastForward } from 'lucide-react';

const playlist = [
  {
    url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    title: "Lofi Girl Radio"
  },
  {
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    title: "The Bootleg Boy"
  },
  {
    url: "https://www.youtube.com/watch?v=DW_An1T-I3s",
    title: "Chillhop Radio"
  },
];


const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    if (!isPlaying) setIsPlaying(true);
  };

  const playPreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    if (!isPlaying) setIsPlaying(true);
  };
  
  const currentTrack = playlist[currentTrackIndex];
  
  const handleEnded = () => {
    playNextTrack();
  }

  return (
    <div className="fixed bottom-8 right-8 bg-windows-gray p-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-72 shadow-2xl font-pixel">
      <div className='hidden'>
        <ReactPlayer
          url={currentTrack.url}
          playing={isPlaying}
          loop={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onError={(e) => console.error('ReactPlayer error:', e)}
          width="0"
          height="0"
        />
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0 text-black">
          <Music className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-black truncate">Now Playing:</p>
          <p className="text-xs text-black truncate">{currentTrack.title}</p>
        </div>
        <div className="flex items-center space-x-1">
            <div className={`flex items-end h-5 space-x-1 mr-1`}>
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
              onClick={playPreviousTrack}
              className="p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
            >
              <Rewind className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={togglePlayPause}
              className="p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black" />}
            </button>
            <button
              onClick={playNextTrack}
              className="p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
            >
              <FastForward className="w-4 h-4 text-black" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
