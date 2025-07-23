import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useGlobalMusicPlayer } from './useGlobalMusicPlayer';

// Theme-specific music mapping
const THEME_MUSIC: Record<string, string[]> = {
  'adventure-canyon': [
    'Adventure Canyon Main Theme',
    'Desert Winds',
    'Ancient Mysteries'
  ],
  'space-mood': [
    'Cosmic Journey',
    'Stellar Dreams'
  ],
};

export const useThemeMusic = () => {
  const { theme } = useSettings();
  const { isPlaying, togglePlayPause, musicFiles } = useGlobalMusicPlayer();
  const previousThemeRef = useRef<string>(theme);
  const wasPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    // Store current playing state when theme changes
    if (previousThemeRef.current !== theme) {
      wasPlayingRef.current = isPlaying;
      previousThemeRef.current = theme;
      
      // Auto-start theme music if we have theme-specific tracks
      const themeMusic = THEME_MUSIC[theme];
      if (themeMusic && themeMusic.length > 0 && musicFiles.length > 0) {
        // Start playing if not already playing
        if (!isPlaying) {
          setTimeout(() => {
            togglePlayPause();
          }, 500);
        }
      }
    }
  }, [theme, isPlaying, togglePlayPause, musicFiles.length]);

  return {
    themeMusic: THEME_MUSIC[theme] || [],
    isThemeMusicAvailable: !!(THEME_MUSIC[theme] && THEME_MUSIC[theme].length > 0)
  };
};