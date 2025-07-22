import { useEffect, useRef } from 'react';
import { useGlobalMusicPlayer } from './useGlobalMusicPlayer';

export const useTvMusicControl = (isTvOpen: boolean) => {
  const { isPlaying, togglePlayPause } = useGlobalMusicPlayer();
  const wasPlayingBeforeTvRef = useRef<boolean>(false);

  useEffect(() => {
    if (isTvOpen) {
      // TV opened - pause music if playing and remember state
      if (isPlaying) {
        wasPlayingBeforeTvRef.current = true;
        togglePlayPause();
      }
    } else {
      // TV closed - resume music if it was playing before
      if (wasPlayingBeforeTvRef.current && !isPlaying) {
        setTimeout(() => {
          togglePlayPause();
        }, 300);
        wasPlayingBeforeTvRef.current = false;
      }
    }
  }, [isTvOpen, isPlaying, togglePlayPause]);
};