
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
    switch (theme) {
      case 'space-mood':
        return {
          outerFrame: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 border-gray-600/30 shadow-lg shadow-black/20',
          innerBezel: 'bg-gradient-to-br from-gray-800 via-black to-gray-700 border-gray-500/40',
          mainBody: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-gray-400/20',
          display: 'bg-gradient-to-b from-gray-950 to-black border-gray-500/50',
          text: 'text-gray-200',
          subText: 'text-gray-300',
          buttonPrimary: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 border-gray-400/30 hover:from-gray-400 hover:via-gray-500 hover:to-gray-700',
          buttonSecondary: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black border-gray-500/30 hover:from-gray-500 hover:via-gray-600 hover:to-gray-800',
          statusLed: isPlaying ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
      case 'dark-vhs':
        return {
          outerFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black border-white/20 shadow-lg shadow-white/10',
          innerBezel: 'bg-gradient-to-br from-gray-800 via-black to-gray-700 border-white/30',
          mainBody: 'bg-gradient-to-br from-gray-700 via-black to-gray-800 border-white/20',
          display: 'bg-gradient-to-b from-gray-950 to-black border-white/30',
          text: 'text-white',
          subText: 'text-gray-300',
          buttonPrimary: 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-white/30 hover:from-red-400 hover:via-red-500 hover:to-red-700',
          buttonSecondary: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 border-white/30 hover:from-gray-400 hover:via-gray-500 hover:to-gray-700',
          statusLed: isPlaying ? 'bg-gradient-to-br from-white to-gray-500' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
      case 'retro-chrome':
        return {
          outerFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600 border-blue-300/30 shadow-lg shadow-blue-500/20',
          innerBezel: 'bg-gradient-to-br from-slate-700 via-blue-800 to-slate-800 border-blue-400/40',
          mainBody: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800 border-blue-300/20',
          display: 'bg-gradient-to-b from-blue-950 to-slate-950 border-blue-400/50',
          text: 'text-blue-200',
          subText: 'text-blue-300',
          buttonPrimary: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 border-blue-300/30 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700',
          buttonSecondary: 'bg-gradient-to-br from-slate-500 via-blue-600 to-slate-700 border-blue-400/30 hover:from-slate-400 hover:via-blue-500 hover:to-slate-600',
          statusLed: isPlaying ? 'bg-gradient-to-br from-cyan-400 to-blue-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
        };
      default:
        return {
          outerFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-black/20',
          innerBezel: 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-600',
          mainBody: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-gray-500',
          display: 'bg-gradient-to-b from-green-900 to-green-950 border-black/50',
          text: 'text-green-400',
          subText: 'text-green-300',
          buttonPrimary: 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-black/30 hover:from-red-300 hover:via-red-400 hover:to-red-600',
          buttonSecondary: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 border-black/30 hover:from-gray-300 hover:via-gray-400 hover:to-gray-600',
          statusLed: isPlaying ? 'bg-gradient-to-br from-lime-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
        };
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
      
      {/* Only show visual controls on desktop route */}
      {location.pathname === '/desktop' && (
        <div className="absolute bottom-8 right-8 transform hover:scale-105 transition-all duration-300">
          {/* Outer frame with theme-appropriate styling */}
          <div className={`p-2 rounded-xl shadow-2xl border-2 ${styles.outerFrame}`}>
            {/* Inner bezel */}
            <div className={`rounded-lg p-1 border ${styles.innerBezel}`}>
              {/* Main player body */}
              <div className={`rounded-md p-4 border shadow-inner ${styles.mainBody}`}>
                
                {/* Top section with display */}
                <div className="mb-4">
                  {/* LCD-style display */}
                  <div className={`p-3 rounded border-2 shadow-inner ${styles.display}`}>
                    <div className="flex items-center justify-between">
                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-pixel text-xs font-bold drop-shadow-sm ${styles.text}`}>
                          🎵 {loading ? 'LOADING...' : musicFiles.length > 0 ? '2000S VIBES' : 'NO MUSIC'}
                        </p>
                        {musicFiles.length > 0 && (
                          <>
                            <p className={`text-xs font-pixel ${styles.subText} truncate`}>
                              {musicFiles[currentTrack]?.title || 'Unknown Track'}
                            </p>
                            <p className={`text-xs font-pixel ${styles.subText}`}>
                              {t('TRACK')} {String(currentTrack + 1).padStart(2, '0')}/{musicFiles.length}
                            </p>
                          </>
                        )}
                      </div>
                      
                      {/* Loop indicator */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setIsLooping(!isLooping)}
                          className={`p-1 rounded transition-colors ${isLooping ? 'bg-green-500/20' : 'bg-gray-500/20'}`}
                          title={isLooping ? 'Loop On' : 'Loop Off'}
                        >
                          <RotateCcw className={`w-3 h-3 ${isLooping ? styles.text : 'text-gray-500'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls section */}
                <div className="flex items-center justify-center space-x-3 mb-3">
                  {/* Previous button */}
                  <button
                    onClick={prevTrack}
                    disabled={musicFiles.length === 0}
                    className={`relative w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 active:scale-95 disabled:opacity-50 ${styles.buttonSecondary}`}
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
                    <SkipBack className={`w-4 h-4 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${styles.text}`} />
                  </button>
                  
                  {/* Play/Pause button */}
                  <button
                    onClick={togglePlayPause}
                    disabled={musicFiles.length === 0}
                    className={`relative w-12 h-12 rounded-full shadow-xl border-2 transition-all duration-200 active:scale-95 disabled:opacity-50 ${styles.buttonPrimary}`}
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
                    disabled={musicFiles.length === 0}
                    className={`relative w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-200 active:scale-95 disabled:opacity-50 ${styles.buttonSecondary}`}
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-full"></div>
                    <SkipForward className={`w-4 h-4 drop-shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${styles.text}`} />
                  </button>
                </div>

                {/* Volume and status section */}
                <div className="flex items-center justify-between">
                  {/* Volume control */}
                  <div className="flex items-center space-x-2 flex-1">
                    <Volume2 className={`w-3 h-3 ${styles.text}`} />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  {/* Status LED */}
                  <div className="flex items-center space-x-2">
                    <Music className={`w-4 h-4 ${styles.text}`} />
                    <div className={`w-3 h-3 rounded-full shadow-sm ${styles.statusLed} ${isPlaying ? 'animate-pulse' : ''}`}></div>
                  </div>
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
