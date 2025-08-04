import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

const Logo = () => {
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processLogo = async () => {
      try {
        // Load the original image
        const response = await fetch('/lovable-uploads/6da185e3-9534-4c09-8e93-063fcaab9450.png');
        const blob = await response.blob();
        const image = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(image);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        setLogoSrc(processedUrl);
        setIsProcessing(false);
      } catch (error) {
        console.error('Failed to process logo:', error);
        // Fallback to original image
        setLogoSrc('/lovable-uploads/6da185e3-9534-4c09-8e93-063fcaab9450.png');
        setIsProcessing(false);
      }
    };

    processLogo();
  }, []);

  const handleClick = () => {
    navigate('/');
  };

  if (isProcessing) {
    return (
      <div className="fixed top-4 left-4 z-50 w-12 h-12 bg-muted/20 rounded animate-pulse" />
    );
  }

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-50 w-12 h-12 transition-all duration-300 hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg retro-logo"
      aria-label="Zurück zur Startseite"
    >
      {logoSrc && (
        <img 
          src={logoSrc} 
          alt="Retro Computer Logo" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      )}
    </button>
  );
};

export default Logo;