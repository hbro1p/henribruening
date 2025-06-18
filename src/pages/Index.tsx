
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import BlinkingCursor from '@/components/BlinkingCursor';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Fake loading time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500); // Short delay before showing content
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleEnter = () => {
    navigate('/desktop');
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-center text-2xl">
      {loading ? (
        <div>
          <p className="mb-4">H.B. Personal System Initializing...</p>
          <ProgressBar />
        </div>
      ) : (
        <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl flex items-center justify-center">
            Hi, I’m Henri.
            <BlinkingCursor />
          </h1>
          <button 
            onClick={handleEnter}
            className="mt-8 text-xl border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
};

export default Landing;
