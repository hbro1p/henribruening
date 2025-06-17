
import { useState, useCallback, useEffect } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if we're currently in fullscreen
  const checkFullscreen = useCallback(() => {
    const fullscreenElement = document.fullscreenElement || 
                             (document as any).webkitFullscreenElement || 
                             (document as any).mozFullScreenElement || 
                             (document as any).msFullscreenElement;
    setIsFullscreen(!!fullscreenElement);
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      checkFullscreen();
    };

    // Add event listeners for all browser prefixes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Initial check
    checkFullscreen();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [checkFullscreen]);

  const enterFullscreen = useCallback(async (element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(async (element: HTMLElement) => {
    const fullscreenElement = document.fullscreenElement || 
                             (document as any).webkitFullscreenElement || 
                             (document as any).mozFullScreenElement || 
                             (document as any).msFullscreenElement;
    
    if (fullscreenElement) {
      await exitFullscreen();
    } else {
      await enterFullscreen(element);
    }
  }, [enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};
