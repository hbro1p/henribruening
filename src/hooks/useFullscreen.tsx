
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
      console.log('Attempting to enter fullscreen for element:', element);
      
      // Check if fullscreen is supported
      if (!document.fullscreenEnabled && 
          !(document as any).webkitFullscreenEnabled && 
          !(document as any).mozFullScreenEnabled &&
          !(document as any).msFullscreenEnabled) {
        console.warn('Fullscreen not supported on this device');
        return;
      }

      // Try different fullscreen methods
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).webkitRequestFullScreen) {
        await (element as any).webkitRequestFullScreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      } else {
        console.warn('No fullscreen method available');
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      
      // Fallback: try to simulate fullscreen with CSS
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.width = '100vw';
      element.style.height = '100vh';
      element.style.zIndex = '9999';
      element.style.backgroundColor = 'black';
      setIsFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      console.log('Attempting to exit fullscreen');
      
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        await (document as any).webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      
      // Fallback: remove CSS fullscreen simulation
      const elements = document.querySelectorAll('[style*="position: fixed"]');
      elements.forEach(el => {
        const element = el as HTMLElement;
        if (element.style.zIndex === '9999') {
          element.style.position = '';
          element.style.top = '';
          element.style.left = '';
          element.style.width = '';
          element.style.height = '';
          element.style.zIndex = '';
          element.style.backgroundColor = '';
        }
      });
      setIsFullscreen(false);
    }
  }, []);

  const toggleFullscreen = useCallback(async (element: HTMLElement) => {
    if (!element) {
      console.warn('No element provided for fullscreen toggle');
      return;
    }

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
