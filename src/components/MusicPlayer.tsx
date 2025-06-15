
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // A royalty-free lofi track to match the vibe
  const audioSrc = "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // We'll try to autoplay. If the browser blocks it, the user can start it with the play button.
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
          console.log("Audio autoplay was prevented by the browser. User must interact to start playback.");
        });
      }
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 bg-windows-gray p-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-64 shadow-2xl font-pixel">
      <audio ref={audioRef} src={audioSrc} loop />
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 text-black">
          <Music className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-black truncate">Now Playing:</p>
          <p className="text-sm text-black truncate">"Lost in 35mm"</p>
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
