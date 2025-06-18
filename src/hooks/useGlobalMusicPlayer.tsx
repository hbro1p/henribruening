import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useMusicFiles } from './useMusicFiles';

interface GlobalMusicContextType {
  isPlaying: boolean;
  currentTrack: number;
  volume: number;
  isLoading: boolean;
  musicFiles: Array<{ name: string; url: string; title: string }>;
  togglePlayPause: () => Promise<void>;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
}

const GlobalMusicContext = createContext<GlobalMusicContextType | null>(null);

export const GlobalMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { musicFiles } = useMusicFiles();

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Set up event listeners
      audioRef.current.addEventListener('ended', () => {
        // Continuously loop through tracks - never stop
        if (musicFiles.length > 0) {
          setCurrentTrack((prev) => {
            const nextIndex = (prev + 1) % musicFiles.length;
            return nextIndex;
          });
          // Keep playing state active
          setIsPlaying(true);
        }
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        // Don't stop playing on error, try next track
        if (musicFiles.length > 1) {
          setCurrentTrack((prev) => {
            const nextIndex = (prev + 1) % musicFiles.length;
            return nextIndex;
          });
        } else {
          setIsPlaying(false);
          setIsLoading(false);
        }
      });
    }

    return () => {
      // Don't clean up audio on unmount - we want it to persist
    };
  }, [musicFiles.length]);

  // Update audio source when track changes and auto-play if was playing
  useEffect(() => {
    if (musicFiles.length > 0 && audioRef.current) {
      const audio = audioRef.current;
      audio.volume = volume;
      
      if (currentTrack < musicFiles.length) {
        const wasPlaying = isPlaying;
        audio.src = musicFiles[currentTrack].url;
        audio.load();
        
        // If we were playing, continue playing the new track
        if (wasPlaying) {
          audio.play().catch(console.error);
        }
      }
    }
  }, [musicFiles, currentTrack, volume]);

  const togglePlayPause = async () => {
    if (!audioRef.current || musicFiles.length === 0) return;

    const audio = audioRef.current;
    
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        
        // Ensure audio is ready to play
        if (audio.readyState < 2) {
          audio.src = musicFiles[currentTrack].url;
          audio.load();
          
          // Wait for the audio to be ready
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              reject(new Error('Audio load timeout'));
            }, 5000);

            const onCanPlay = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              resolve(undefined);
            };

            const onError = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              reject(new Error('Audio load failed'));
            };

            audio.addEventListener('canplaythrough', onCanPlay);
            audio.addEventListener('error', onError);
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
    if (wasPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    
    setCurrentTrack((prev) => {
      const nextIndex = (prev + 1) % musicFiles.length;
      return nextIndex;
    });
    
    // Always continue playing when manually switching tracks
    if (wasPlaying) {
      setTimeout(() => togglePlayPause(), 300);
    }
  };

  const prevTrack = () => {
    if (musicFiles.length === 0) return;
    const wasPlaying = isPlaying;
    if (wasPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    
    setCurrentTrack((prev) => {
      const prevIndex = (prev - 1 + musicFiles.length) % musicFiles.length;
      return prevIndex;
    });
    
    // Always continue playing when manually switching tracks
    if (wasPlaying) {
      setTimeout(() => togglePlayPause(), 300);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <GlobalMusicContext.Provider value={{
      isPlaying,
      currentTrack,
      volume,
      isLoading,
      musicFiles,
      togglePlayPause,
      nextTrack,
      prevTrack,
      setVolume
    }}>
      {children}
    </GlobalMusicContext.Provider>
  );
};

export const useGlobalMusicPlayer = () => {
  const context = useContext(GlobalMusicContext);
  if (!context) {
    throw new Error('useGlobalMusicPlayer must be used within GlobalMusicProvider');
  }
  return context;
};
