
import { useState, useCallback, useEffect } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if we're currently in fullscreen
  const checkFullscreen = useCallback(() => {
    const fullscreenElement = document.fullscreenElement || 
                             (document as any).webkitFullscreenElement || 
                             (document as any).mozFullScreenElement || 
                             (document as any).msFullscreenElement;
    
    const isCurrentlyFullscreen = !!fullscreenElement;
    // Fullscreen state checked
    setIsFullscreen(isCurrentlyFullscreen);
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Fullscreen state changed
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
      // Entering fullscreen mode
      
      // Enhanced fullscreen support check
      const isSupported = document.fullscreenEnabled || 
                         (document as any).webkitFullscreenEnabled || 
                         (document as any).mozFullScreenEnabled ||
                         (document as any).msFullscreenEnabled;

      if (!isSupported) {
        console.warn('Fullscreen API not supported on this device/browser');
        // Fallback for unsupported devices
        element.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          background: black !important;
          object-fit: contain !important;
        `;
        setIsFullscreen(true);
        return;
      }

      // Try different fullscreen methods with better error handling
      let success = false;
      
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        success = true;
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
        success = true;
      } else if ((element as any).webkitRequestFullScreen) {
        await (element as any).webkitRequestFullScreen();
        success = true;
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
        success = true;
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
        success = true;
      }

      if (!success) {
        console.warn('No fullscreen method available, using CSS fallback');
        // CSS fallback
        element.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          background: black !important;
          object-fit: contain !important;
        `;
        setIsFullscreen(true);
      }
      
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      // Always fall back to CSS method
      element.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        background: black !important;
        object-fit: contain !important;
      `;
      setIsFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      // Exiting fullscreen mode
      
      // First try native fullscreen exit
      let success = false;
      
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        success = true;
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
        success = true;
      } else if ((document as any).webkitCancelFullScreen) {
        await (document as any).webkitCancelFullScreen();
        success = true;
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
        success = true;
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
        success = true;
      }

      // Always also clean up CSS fallback styles
      const elementsWithFullscreenStyles = document.querySelectorAll('[style*="position: fixed"]');
      elementsWithFullscreenStyles.forEach(el => {
        const element = el as HTMLElement;
        if (element.style.zIndex === '9999') {
          element.style.cssText = '';
        }
      });

      if (!success) {
        // Fallback fullscreen exit completed
      }
      
      setIsFullscreen(false);
      
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      // Force cleanup of CSS styles
      const elementsWithFullscreenStyles = document.querySelectorAll('[style*="position: fixed"]');
      elementsWithFullscreenStyles.forEach(el => {
        const element = el as HTMLElement;
        if (element.style.zIndex === '9999') {
          element.style.cssText = '';
        }
      });
      setIsFullscreen(false);
    }
  }, []);

  const toggleFullscreen = useCallback(async (element: HTMLElement | null) => {
    // Toggling fullscreen mode
    
    if (!element) {
      console.warn('No element provided for fullscreen toggle');
      return;
    }

    // Check current fullscreen state
    const fullscreenElement = document.fullscreenElement || 
                             (document as any).webkitFullscreenElement || 
                             (document as any).mozFullScreenElement || 
                             (document as any).msFullscreenElement;
    
    const hasFullscreenStyles = element.style.zIndex === '9999';
    
    if (fullscreenElement || hasFullscreenStyles || isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen(element);
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};
