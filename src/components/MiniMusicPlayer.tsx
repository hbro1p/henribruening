
import React from 'react';
import { Radio } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface MiniMusicPlayerProps {
  currentTrack: string;
  onOpenRadio: () => void;
}

const MiniMusicPlayer: React.FC<MiniMusicPlayerProps> = ({ currentTrack, onOpenRadio }) => {
  const { theme } = useSettings();

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return 'bg-gray-900/95 border-green-400/50 text-green-400';
      case 'retro-chrome':
        return 'bg-blue-100/95 border-blue-500/50 text-blue-800';
      default: // space-mood
        return 'bg-gray-900/95 border-cyan-400/50 text-cyan-400';
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 ${getThemeStyles()} border rounded-lg px-4 py-2 cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg backdrop-blur-sm z-40 max-w-64`}
      onClick={onOpenRadio}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Radio className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono opacity-80">NOW PLAYING</p>
          <p className="text-sm font-bold truncate">{currentTrack || 'Unknown Track'}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniMusicPlayer;
