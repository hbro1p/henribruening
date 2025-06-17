
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Radio, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useMusicFiles } from '@/hooks/useMusicFiles';

interface RadioAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const RadioApp: React.FC<RadioAppProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { t, theme } = useSettings();
  const { musicFiles, loading } = useMusicFiles();

  useEffect(() => {
    if (musicFiles.length > 0 && currentTrack >= musicFiles.length) {
      setCurrentTrack(0);
    }
  }, [musicFiles, currentTrack]);

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
    nextTrack();
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return {
          container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-green-400 shadow-lg shadow-green-400/20',
          text: 'text-green-400 font-mono',
          subText: 'text-green-300',
          button: 'bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-400/50',
          activeButton: 'bg-green-900 text-green-300 border-green-400'
        };
      case 'retro-chrome':
        return {
          container: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-2 border-blue-600 shadow-lg',
          text: 'text-blue-900 font-mono',
          subText: 'text-blue-700',
          button: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-500',
          activeButton: 'bg-blue-400 text-blue-800 border-blue-600'
        };
      default: // space-mood
        return {
          container: 'bg-gradient-to-br from-gray-900 via-blue-900 to-black border-2 border-cyan-400 shadow-lg shadow-cyan-400/30',
          text: 'text-cyan-400 font-mono',
          subText: 'text-cyan-300',
          button: 'bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-400/50',
          activeButton: 'bg-cyan-900 text-cyan-300 border-cyan-400'
        };
    }
  };

  const styles = getThemeStyles();

  if (!isOpen) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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

          {/* Radio Header */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${isPlaying ? 'bg-red-600' : 'bg-gray-600'} shadow-lg border-2`}>
              <Radio className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Station Info */}
          <div className="text-center mb-6">
            <h2 className={`text-xl font-bold mb-2 ${styles.text}`}>
              📻 RETRO RADIO
            </h2>
            <div className={`bg-black/30 rounded p-3 border ${styles.text.includes('cyan') ? 'border-cyan-400/30' : styles.text.includes('green') ? 'border-green-400/30' : 'border-blue-400/30'}`}>
              <p className={`text-sm mb-1 ${styles.text}`}>
                {loading ? 'TUNING...' : musicFiles.length > 0 ? '♪ NOW PLAYING ♪' : 'NO SIGNAL'}
              </p>
              <p className={`text-xs ${styles.subText} truncate`}>
                {loading ? '---' : musicFiles.length > 0 ? musicFiles[currentTrack]?.title || 'Unknown Track' : 'Upload music to /music/ folder'}
              </p>
              {isPlaying && (
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map((i) => (
                      <div
                        key={i}
                        className={`w-1 bg-current animate-pulse ${styles.text}`}
                        style={{
                          height: `${Math.random() * 16 + 8}px`,
                          animationDelay: `${i * 0.1}s`
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
              className={`w-10 h-10 rounded flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            <button
              onClick={togglePlayPause}
              disabled={musicFiles.length === 0}
              className={`w-12 h-12 rounded flex items-center justify-center transition-all disabled:opacity-50 ${styles.activeButton}`}
            >
              {isPlaying ? 
                <Pause className="w-5 h-5" /> : 
                <Play className="w-5 h-5 ml-0.5" />
              }
            </button>
            
            <button
              onClick={nextTrack}
              disabled={musicFiles.length === 0}
              className={`w-10 h-10 rounded flex items-center justify-center transition-all disabled:opacity-50 ${styles.button}`}
            >
              <SkipForward className="w-4 h-4" />
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
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
              className="flex-1 h-2 rounded appearance-none cursor-pointer bg-gray-600"
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
