
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';
import { useSettings } from '@/contexts/SettingsContext';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const { theme } = useSettings();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleEnter = () => {
    navigate('/desktop');
  };

  const getTextStyling = () => {
    switch (theme) {
      case 'space-mood':
        return 'text-white drop-shadow-2xl';
      case 'dark-vhs':
        return 'text-white';
      case 'matrix-terminal':
        return 'text-green-400';
      case 'retro-chrome':
        return 'text-blue-900';
      default:
        return 'text-white drop-shadow-2xl';
    }
  };

  const getButtonStyling = () => {
    switch (theme) {
      case 'space-mood':
        return 'border-2 border-white bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black text-white shadow-lg';
      case 'dark-vhs':
        return 'border-2 border-white bg-black/60 hover:bg-white hover:text-black text-white';
      case 'matrix-terminal':
        return 'border-2 border-green-400 bg-black/60 hover:bg-green-400 hover:text-black text-green-400';
      case 'retro-chrome':
        return 'border-2 border-blue-900 bg-white/20 hover:bg-blue-900 hover:text-white text-blue-900';
      default:
        return 'border-2 border-white bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black text-white shadow-lg';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-center text-2xl">
      {loading ? (
        <div className={getTextStyling()}>
          <p className="mb-4 font-pixel">H.B. Personal System Initializing...</p>
          <ProgressBar />
        </div>
      ) : (
        <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'} ${getTextStyling()}`}>
          <h1 className="text-5xl flex items-center justify-center font-pixel">
            Hi, I'm Henri.
            <BlinkingCursor />
          </h1>
          <button 
            onClick={handleEnter}
            className={`mt-8 text-xl px-6 py-2 transition-colors font-pixel ${getButtonStyling()}`}
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
};

export default Landing;
