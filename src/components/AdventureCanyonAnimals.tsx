import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const AdventureCanyonAnimals: React.FC = () => {
  const { theme } = useSettings();

  if (theme !== 'adventure-canyon') return null;

  return (
    <div className="canyon-animals">
      <div className="eagle">🦅</div>
      <div className="fox">🦊</div>
      <div className="parrot">🦜</div>
    </div>
  );
};

export default AdventureCanyonAnimals;