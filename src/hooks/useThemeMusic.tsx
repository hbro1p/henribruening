import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useGlobalMusicPlayer } from './useGlobalMusicPlayer';

export const useThemeMusic = () => {
  const { theme } = useSettings();
  const { isPlaying, togglePlayPause, musicFiles } = useGlobalMusicPlayer();
  const previousThemeRef = useRef<string>(theme);
  const wasPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    // Always enable music for adventure-canyon theme, disable ambient sounds
    if (previousThemeRef.current !== theme) {
      wasPlayingRef.current = isPlaying;
      previousThemeRef.current = theme;
      
      // For adventure-canyon, start normal music instead of ambient sounds
      if (theme === 'adventure-canyon') {
        if (!isPlaying && musicFiles.length > 0) {
          setTimeout(() => {
            togglePlayPause();
          }, 500);
        }
      } else if (theme === 'space-mood') {
        // Auto-start music for space-mood theme too
        if (!isPlaying && musicFiles.length > 0) {
          setTimeout(() => {
            togglePlayPause();
          }, 500);
        }
      }
    }
  }, [theme, isPlaying, togglePlayPause, musicFiles.length]);

  return {
    themeMusic: [],
    isThemeMusicAvailable: true
  };
};