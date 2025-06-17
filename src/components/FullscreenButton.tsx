
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
    
    if (!targetElement) {
      console.warn('No target element provided for fullscreen');
      return;
    }

    console.log('Fullscreen button clicked, current state:', isFullscreen);
    console.log('Target element:', targetElement);
    
    try {
      await toggleFullscreen(targetElement);
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  };

  // Don't render if no target element
  if (!targetElement) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 bg-black/60 hover:bg-black/80 rounded transition-all duration-200 text-white touch-manipulation ${className}`}
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      type="button"
    >
      {isFullscreen ? <X className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
    </button>
  );
};

export default FullscreenButton;
