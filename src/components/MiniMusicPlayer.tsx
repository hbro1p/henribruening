import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useGlobalMusicPlayer } from '../hooks/useGlobalMusicPlayer';
import { useSettings } from '../contexts/SettingsContext';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const MiniMusicPlayer: React.FC = () => {
  const { 
    isPlaying, 
    currentTrack, 
    volume, 
    musicFiles, 
    togglePlayPause, 
    setVolume 
  } = useGlobalMusicPlayer();
  const { t } = useSettings();

  if (musicFiles.length === 0) {
    return null;
  }

  const currentSong = musicFiles[currentTrack];

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg min-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayPause}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">
            {currentSong?.title || t('music')}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Volume2 className="h-3 w-3 text-muted-foreground" />
        <div className="flex-1">
          <Slider
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniMusicPlayer;