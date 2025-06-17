
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Radio, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useMusicFiles } from '@/hooks/useMusicFiles';

interface RadioAppProps {
  isOpen: boolean;
  onClose: () => void;
  onMusicStateChange: (isPlaying: boolean, trackTitle: string) => void;
}

const RadioApp: React.FC<RadioAppProps> = ({ isOpen, onClose, onMusicStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { t, theme } = useSettings();
  const { musicFiles, loading } = useMusicFiles();

  // Initialize audio when component mounts or track changes
  useEffect(() => {
    if (musicFiles.length > 0 && audioRef.current) {
      const audio = audioRef.current;
      audio.volume = volume;
      
      if (currentTrack < musicFiles.length) {
        audio.src = musicFiles[currentTrack].url;
        audio.load();
      }
    }
  }, [musicFiles, currentTrack, volume]);

  // Notify parent about music state changes
  useEffect(() => {
    const trackTitle = musicFiles[currentTrack]?.title || '';
    onMusicStateChange(isPlaying, trackTitle);
  }, [isPlaying, currentTrack, musicFiles, onMusicStateChange]);

  const togglePlayPause = async () => {
    if (!audioRef.current || musicFiles.length === 0) return;

    const audio = audioRef.current;
    
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        
        // Ensure audio is loaded and ready
        if (audio.readyState < 2) {
          await new Promise((resolve, reject) => {
            const handleCanPlay = () => {
              audio.removeEventListener('canplay', handleCanPlay);
              audio.removeEventListener('error', handleError);
              resolve(undefined);
            };
            const handleError = () => {
              audio.removeEventListener('canplay', handleCanPlay);
              audio.removeEventListener('error', handleError);
              reject(new Error('Audio load failed'));
            };
            audio.addEventListener('canplay', handleCanPlay);
            audio.addEventListener('error', handleError);
            
            // Trigger load if needed
            if (audio.src !== musicFiles[currentTrack]?.url) {
              audio.src = musicFiles[currentTrack].url;
              audio.load();
            }
          });
        }
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const nextTrack = () => {
    if (musicFiles.length === 0) return;
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    
    setCurrentTrack((prev) => {
      const nextIndex = (prev + 1) % musicFiles.length;
      return nextIndex;
    });
    
    if (wasPlaying) {
      setTimeout(() => togglePlayPause(), 200);
    }
  };

  const prevTrack = () => {
    if (musicFiles.length === 0) return;
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    
    setCurrentTrack((prev) => {
      const prevIndex = (prev - 1 + musicFiles.length) % musicFiles.length;
      return prevIndex;
    });
    
    if (wasPlaying) {
      setTimeout(() => togglePlayPause(), 200);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return {
          container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-green-400 shadow-lg shadow-green-400/20',
          text: 'text-green-400 font-mono',
          subText: 'text-green-300',
          button: 'bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-400/50',
          activeButton: 'bg-green-900 text-green-300 border-green-400',
          accent: 'bg-green-400',
          volumeSlider: 'accent-green-400'
        };
      case 'retro-chrome':
        return {
          container: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-2 border-blue-600 shadow-lg',
          text: 'text-blue-900 font-mono',
          subText: 'text-blue-700',
          button: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-500',
          activeButton: 'bg-blue-400 text-blue-800 border-blue-600',
          accent: 'bg-blue-500',
          volumeSlider: 'accent-blue-500'
        };
      default: // space-mood
        return {
          container: 'bg-gradient-to-br from-gray-900 via-blue-900 to-black border-2 border-cyan-400 shadow-lg shadow-cyan-400/30',
          text: 'text-cyan-400 font-mono',
          subText: 'text-cyan-300',
          button: 'bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-400/50',
          activeButton: 'bg-cyan-900 text-cyan-300 border-cyan-400',
          accent: 'bg-cyan-400',
          volumeSlider: 'accent-cyan-400'
        };
    }
  };

  const styles = getThemeStyles();

  if (!isOpen) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onError={(e) => console.error('Audio error:', e)}
        preload="metadata"
      />
      
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`w-96 max-w-full rounded-lg p-6 relative ${styles.container}`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 w-8 h-8 rounded flex items-center justify-center ${styles.button}`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Radio Header with Boombox Design */}
          <div className="flex items-center justify-center mb-6">
            <div className={`relative w-20 h-16 rounded-lg flex items-center justify-center ${isPlaying ? styles.accent : 'bg-gray-600'} shadow-lg border-2`}>
              {/* Speaker grilles */}
              <div className="absolute left-1 top-2 bottom-2 w-2 bg-black/30 rounded-sm flex flex-col justify-around">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-0.5 bg-white/20 rounded" />
                ))}
              </div>
              <div className="absolute right-1 top-2 bottom-2 w-2 bg-black/30 rounded-sm flex flex-col justify-around">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-0.5 bg-white/20 rounded" />
                ))}
              </div>
              
              {/* Center antenna */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400 rounded-full" />
              
              <Radio className="w-8 h-8 text-white z-10" />
              
              {/* Signal bars animation */}
              {isPlaying && (
                <div className="absolute -top-1 right-2 flex space-x-0.5">
                  {[1,2,3].map((i) => (
                    <div
                      key={i}
                      className={`w-0.5 ${styles.accent} animate-pulse rounded-full`}
                      style={{
                        height: `${4 + i * 2}px`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Station Info */}
          <div className="text-center mb-6">
            <h2 className={`text-xl font-bold mb-2 ${styles.text}`}>
              RETRO RADIO
            </h2>
            <div className={`bg-black/30 rounded p-3 border ${theme === 'retro-chrome' ? 'border-blue-400/30 bg-white/10' : 'border-current/30'}`}>
              <p className={`text-sm mb-1 ${styles.text}`}>
                {loading ? 'TUNING...' : musicFiles.length > 0 ? '♪ NOW PLAYING ♪' : 'NO SIGNAL'}
              </p>
              <p className={`text-xs ${styles.subText} truncate`}>
                {loading ? '---' : musicFiles.length > 0 ? musicFiles[currentTrack]?.title || 'Unknown Track' : 'Upload music to /music/ folder'}
              </p>
              
              {/* Equalizer visualization */}
              {isPlaying && (
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-1">
                    {[1,2,3,4,5,6,7].map((i) => (
                      <div
                        key={i}
                        className={`w-1 ${styles.accent} animate-pulse`}
                        style={{
                          height: `${Math.random() * 20 + 8}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${0.5 + Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={prevTrack}
              disabled={musicFiles.length === 0}
              className={`w-12 h-12 rounded flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlayPause}
              disabled={musicFiles.length === 0 || isLoading}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${styles.activeButton} shadow-lg`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              disabled={musicFiles.length === 0}
              className={`w-12 h-12 rounded flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Volume2 className={`w-4 h-4 ${styles.text}`} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className={`flex-1 h-2 rounded appearance-none cursor-pointer ${theme === 'retro-chrome' ? 'bg-blue-300' : 'bg-gray-600'} ${styles.volumeSlider}`}
            />
            <span className={`text-xs font-mono ${styles.subText}`}>
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Station Display */}
          <div className={`mt-4 text-center text-xs ${styles.subText}`}>
            {musicFiles.length > 0 ? `Track ${currentTrack + 1}/${musicFiles.length}` : 'No tracks loaded'}
          </div>
        </div>
      </div>
    </>
  );
};

export default RadioApp;
