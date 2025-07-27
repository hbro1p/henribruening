
import React from 'react';
import { Maximize, X } from 'lucide-react';
import { useFullscreen } from '@/hooks/useFullscreen';

interface FullscreenButtonProps {
  targetElement: HTMLElement | null;
  className?: string;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ targetElement, className = '' }) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Fullscreen button interaction logged securely
    
    if (!targetElement) {
      console.warn('No target element provided for fullscreen');
      return;
    }

    try {
      await toggleFullscreen(targetElement);
      // Fullscreen operation completed
    } catch (error) {
      // Fullscreen operation failed
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 bg-black/80 hover:bg-black rounded transition-all duration-200 text-white touch-manipulation select-none ${className}`}
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      type="button"
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        touchAction: 'manipulation'
      }}
    >
      {isFullscreen ? <X className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
    </button>
  );
};

export default FullscreenButton;
