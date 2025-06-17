
import React from 'react';
import { Radio, Pause, Play, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface MiniMusicPlayerProps {
  currentTrack: string;
  onOpenRadio: () => void;
  onClose: () => void;
  onTogglePlayPause: () => void;
  isPlaying: boolean;
}

const MiniMusicPlayer: React.FC<MiniMusicPlayerProps> = ({ 
  currentTrack, 
  onOpenRadio, 
  onClose, 
  onTogglePlayPause, 
  isPlaying 
}) => {
  const { theme } = useSettings();

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return {
          container: 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 border-green-400/60 text-green-400 shadow-green-400/30',
          accent: 'bg-green-400',
          textPrimary: 'text-green-400',
          textSecondary: 'text-green-300/80',
          glow: 'shadow-green-400/20',
          radioContainer: 'bg-gray-800 border-green-400/50',
          button: 'hover:bg-green-400/20 text-green-400'
        };
      case 'retro-chrome':
        return {
          container: 'bg-gradient-to-r from-blue-200/95 via-blue-100/95 to-blue-200/95 border-blue-500/60 text-blue-800 shadow-blue-500/30',
          accent: 'bg-blue-500',
          textPrimary: 'text-blue-800',
          textSecondary: 'text-blue-700/80',
          glow: 'shadow-blue-500/20',
          radioContainer: 'bg-blue-300 border-blue-500/50',
          button: 'hover:bg-blue-500/20 text-blue-800'
        };
      default: // space-mood - RED theme to match Radio app
        return {
          container: 'bg-gradient-to-r from-red-200/95 via-red-100/95 to-red-200/95 border-red-500/60 text-red-800 shadow-red-500/30',
          accent: 'bg-red-500',
          textPrimary: 'text-red-800',
          textSecondary: 'text-red-700/80',
          glow: 'shadow-red-500/20',
          radioContainer: 'bg-red-300 border-red-500/50',
          button: 'hover:bg-red-500/20 text-red-800'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div 
      className={`fixed bottom-32 right-4 ${styles.container} border-2 rounded-lg px-4 py-3 cursor-pointer hover:scale-105 transition-all duration-300 backdrop-blur-sm z-40 max-w-80 ${styles.glow} shadow-lg`}
      onClick={(e) => {
        // Only open radio if clicking on the main area, not buttons
        if ((e.target as HTMLElement).closest('button')) return;
        onOpenRadio();
      }}
    >
      <div className="flex items-center space-x-3">
        {/* Radio Icon with Signal Animation */}
        <div className="relative flex-shrink-0">
          <div className={`w-10 h-8 ${styles.radioContainer} rounded border flex items-center justify-center relative overflow-hidden`}>
            {/* Retro radio design */}
            <div className={`absolute top-0.5 left-1 right-1 h-0.5 ${styles.accent} rounded-full opacity-60`} />
            <Radio className="w-4 h-4 relative z-10" />
            <div className={`absolute bottom-0.5 left-1 right-1 h-0.5 ${styles.accent} rounded-full opacity-40`} />
          </div>
          
          {/* Animated signal indicator */}
          {isPlaying && (
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${styles.accent} rounded-full animate-pulse opacity-80`}>
              <div className={`absolute inset-0 ${styles.accent} rounded-full animate-ping opacity-50`} />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`text-xs font-mono ${styles.textSecondary} tracking-wide`}>
              NOW PLAYING
            </div>
            {/* Mini equalizer bars */}
            {isPlaying && (
              <div className="flex space-x-0.5">
                {[1,2,3].map((i) => (
                  <div
                    key={i}
                    className={`w-0.5 ${styles.accent} animate-pulse rounded-full`}
                    style={{
                      height: `${6 + i * 2}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${0.8 + Math.random() * 0.4}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <p className={`text-sm font-bold truncate ${styles.textPrimary} leading-tight`}>
            {currentTrack || 'Unknown Track'}
          </p>
        </div>

        {/* Control buttons */}
        <div className="flex items-center space-x-1">
          {/* Play/Pause button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlayPause();
            }}
            className={`w-8 h-8 rounded flex items-center justify-center ${styles.button} transition-colors`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
          
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`w-8 h-8 rounded flex items-center justify-center ${styles.button} transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${styles.accent} opacity-60 rounded-b-lg`} />
    </div>
  );
};

export default MiniMusicPlayer;
