import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const AdventureCanyonAnimals: React.FC = () => {
  const { theme } = useSettings();

  if (theme !== 'adventure-canyon') {
    return null;
  }

  return (
    <>
      {/* Subtle animated wildlife - no emojis, using CSS shapes */}
      <div className="canyon-animals">
        {/* Eagle silhouette */}
        <div className="eagle">
          <svg width="40" height="24" viewBox="0 0 40 24" className="text-orange-800/60">
            <path d="M5 12c0-3 3-6 8-6s8 3 8 6-3 6-8 6-8-3-8-6zm14 0c0-2 2-4 6-4s6 2 6 4-2 4-6 4-6-2-6-4z" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Fox silhouette */}
        <div className="fox">
          <svg width="32" height="20" viewBox="0 0 32 20" className="text-orange-900/70">
            <path d="M4 16c0-2 2-4 6-4s6 2 6 4-2 4-6 4-6-2-6-4zm12-2c0-1 1-2 4-2s4 1 4 2-1 2-4 2-4-1-4-2zm2-6l2-4 2 4-2 2-2-2z" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Bird silhouette */}
        <div className="parrot">
          <svg width="24" height="16" viewBox="0 0 24 16" className="text-red-800/60">
            <path d="M8 8c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4zm-4 2c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </>
  );
};

export default AdventureCanyonAnimals;