
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, SkipForward, SkipBack, Volume2, RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useAppTheme } from '@/components/shared/AppColorSystem';
import { useMusicFiles } from '@/hooks/useMusicFiles';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLooping, setIsLooping] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const location = useLocation();
  const { t } = useSettings();
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

  const restartTrack = () => {
    if (audioRef.current && musicFiles.length > 0) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
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

  // Use green color for Music Player app
  const styles = useAppTheme('green');

  

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
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-40 px-4">
          <div className={`w-80 max-w-[calc(100vw-2rem)] rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] ${styles.container}`}>
            
            {/* Music Icon Header */}
            <div className="flex items-center justify-center mb-6">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isPlaying ? 'bg-green-500' : 'bg-gray-500'} shadow-lg border-2 border-white/20`}>
                <Music className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-6">
              <p className={`font-bold text-base mb-2 px-2 leading-tight ${styles.text}`} style={{
                fontSize: '14px',
                lineHeight: '1.2',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              }}>
                {loading ? t('Loading...') : musicFiles.length > 0 ? musicFiles[currentTrack]?.title || t('Unknown Track') : t('No Music')}
              </p>
              <p className={`text-sm font-medium ${styles.subText}`}>
                {musicFiles.length > 0 ? `${t('Track')} ${currentTrack + 1} ${t('of')} ${musicFiles.length}` : `🎵 ${t('Chill Out')}`}
              </p>
            </div>

            {/* Control Buttons - All Same Size */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={prevTrack}
                  disabled={musicFiles.length === 0}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 border-2 border-white/20 shadow-md hover:scale-105 active:scale-95 ${styles.button}`}
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  disabled={musicFiles.length === 0}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 border-2 border-white/30 shadow-lg hover:scale-105 active:scale-95 ${styles.playButton}`}
                >
                  {isPlaying ? 
                    <Pause className="w-6 h-6 drop-shadow-sm" /> : 
                    <Play className="w-6 h-6 ml-0.5 drop-shadow-sm" />
                  }
                </button>
                
                <button
                  onClick={nextTrack}
                  disabled={musicFiles.length === 0}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 border-2 border-white/20 shadow-md hover:scale-105 active:scale-95 ${styles.button}`}
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={restartTrack}
                  disabled={musicFiles.length === 0}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 border-2 border-white/20 shadow-md hover:scale-105 active:scale-95 ${styles.button}`}
                  title={t('Restart Track')}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Volume Control - Centered */}
            <div className="flex items-center justify-center space-x-3 px-2">
              <Volume2 className={`w-5 h-5 flex-shrink-0 ${styles.text}`} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={`flex-1 h-3 rounded-lg appearance-none cursor-pointer max-w-32 ${styles.slider}`}
                style={{
                  background: `linear-gradient(to right, currentColor 0%, currentColor ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
                }}
              />
              <span className={`text-sm font-mono w-10 text-center font-bold flex-shrink-0 ${styles.subText}`}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
