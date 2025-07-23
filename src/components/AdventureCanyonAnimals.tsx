import React, { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const AdventureCanyonAnimals: React.FC = () => {
  const { theme } = useSettings();

  useEffect(() => {
    console.log('AdventureCanyonAnimals: Current theme is', theme);
  }, [theme]);

  if (theme !== 'adventure-canyon') {
    console.log('AdventureCanyonAnimals: Not rendering, theme is not adventure-canyon');
    return null;
  }

  console.log('AdventureCanyonAnimals: Rendering animals for adventure-canyon theme');

  return (
    <div className="canyon-animals">
      <div className="eagle">🦅</div>
      <div className="fox">🦊</div>
      <div className="parrot">🦜</div>
    </div>
  );
};

export default AdventureCanyonAnimals;