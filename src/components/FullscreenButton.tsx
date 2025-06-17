
import React from 'react';
import { Maximize, X } from 'lucide-react';
import { useFullscreen } from '@/hooks/useFullscreen';

interface FullscreenButtonProps {
  targetElement: HTMLElement | null;
  className?: string;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ targetElement, className = '' }) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (targetElement) {
      toggleFullscreen(targetElement);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 bg-black/60 hover:bg-black/80 rounded transition-all duration-200 text-white ${className}`}
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFullscreen ? <X className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
    </button>
  );
};

export default FullscreenButton;
