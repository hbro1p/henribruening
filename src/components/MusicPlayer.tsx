import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, SkipForward, SkipBack, Volume2, RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useMusicFiles } from '@/hooks/useMusicFiles';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLooping, setIsLooping] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const location = useLocation();
  const { t, theme } = useSettings();
  const { musicFiles, loading, error } = useMusicFiles();

  // Reset current track if it's out of bounds when files change
  useEffect(() => {
    if (musicFiles.length > 0 && currentTrack >= musicFiles.length) {
      setCurrentTrack(0);
    }
  }, [musicFiles, currentTrack]);

  const togglePlayPause = () => {
    if (!audioRef.current || musicFiles.length === 0) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const nextTrack = () => {
    if (musicFiles.length === 0) return;
    setCurrentTrack((prev) => (prev + 1) % musicFiles.length);
  };

  const prevTrack = () => {
    if (musicFiles.length === 0) return;
    setCurrentTrack((prev) => (prev - 1 + musicFiles.length) % musicFiles.length);
  };

  const handleEnded = () => {
    if (isLooping) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current && musicFiles.length > 0) {
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        audioRef.current.pause();
      }
      
      audioRef.current.src = musicFiles[currentTrack]?.url || '';
      audioRef.current.volume = volume;
      
      if (wasPlaying && musicFiles[currentTrack]?.url) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack, musicFiles]);

  const getThemeStyles = () => {
    const baseStyles = {
      container: 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 shadow-lg',
      text: 'text-blue-900',
      subText: 'text-blue-700',
      button: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-400',
      playButton: 'bg-blue-500 hover:bg-blue-600 text-white',
      activeButton: 'bg-blue-300 text-blue-800 border-blue-500',
      slider: 'accent-blue-500'
    };

    switch (theme) {
      case 'dark-vhs':
        return {
          container: 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 shadow-lg',
          text: 'text-white',
          subText: 'text-gray-300',
          button: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-500',
          playButton: 'bg-red-600 hover:bg-red-500 text-white',
          activeButton: 'bg-red-800 text-red-300 border-red-500',
          slider: 'accent-red-500'
        };
      case 'retro-chrome':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg',
          text: 'text-blue-900',
          subText: 'text-blue-700',
          button: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-400',
          playButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          activeButton: 'bg-blue-200 text-blue-700 border-blue-500',
          slider: 'accent-blue-600'
        };
      default:
        return baseStyles;
    }
  };

  const styles = getThemeStyles();

  // Don't render if no music files and not loading
  if (!loading && musicFiles.length === 0) {
    return null;
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onError={(e) => console.error('Audio error:', e)}
        preload="metadata"
      />
      
      {/* Folder-style Music Player */}
      {location.pathname === '/desktop' && (
        <div className="fixed bottom-16 right-4 z-40">
          <div className={`w-72 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] ${styles.container}`}>
            
            {/* Music Icon Header */}
            <div className="flex items-center justify-center mb-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPlaying ? 'bg-green-500' : 'bg-gray-500'} shadow-md`}>
                <Music className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-3">
              <p className={`font-bold text-sm mb-1 truncate ${styles.text}`}>
                {loading ? 'Loading...' : musicFiles.length > 0 ? musicFiles[currentTrack]?.title || 'Unknown Track' : 'No Music'}
              </p>
              <p className={`text-xs ${styles.subText}`}>
                {musicFiles.length > 0 ? `${currentTrack + 1}/${musicFiles.length}` : 'Chill Out'}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-3 mb-3">
              <button
                onClick={prevTrack}
                disabled={musicFiles.length === 0}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={togglePlayPause}
                disabled={musicFiles.length === 0}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-all disabled:opacity-50 ${styles.playButton}`}
              >
                {isPlaying ? 
                  <Pause className="w-5 h-5" /> : 
                  <Play className="w-5 h-5 ml-0.5" />
                }
              </button>
              
              <button
                onClick={nextTrack}
                disabled={musicFiles.length === 0}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                  isLooping ? styles.activeButton : styles.button
                }`}
                title={isLooping ? 'Loop On' : 'Loop Off'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 className={`w-4 h-4 ${styles.text}`} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${styles.slider}`}
              />
              <span className={`text-xs font-mono w-8 text-center ${styles.subText}`}>
                {Math.round(volume * 100)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
