
import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Tv, ArrowLeft } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTvVideos } from '@/hooks/useTvVideos';
import FullscreenButton from '@/components/FullscreenButton';

interface TvAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const TvApp: React.FC<TvAppProps> = ({ isOpen, onClose }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { t, theme } = useSettings();
  const { videos, loading } = useTvVideos();

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        fullBackground: 'folder-purple', // Purple theme for TV
        windowFrame: 'bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600',
        titleBar: 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700',
        windowContent: 'bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400',
        text: 'text-purple-900',
        button: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 hover:from-purple-400 hover:via-purple-500 hover:to-purple-700 text-white',
        input: 'bg-purple-50 border-purple-600 text-purple-900',
        link: 'text-purple-800 hover:text-purple-900',
        cardBg: 'bg-purple-50 border-purple-600',
        playerBg: 'bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300',
        accent: 'purple-600',
      };
    }
    
    
    // Default fallback
    return {
      fullBackground: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      button: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-black/30 text-black hover:from-gray-200 hover:via-gray-300 hover:to-gray-500',
      input: 'bg-white border-black text-black',
      link: 'text-purple-800 hover:text-purple-900',
      cardBg: 'bg-white border-black',
      playerBg: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300',
      accent: 'purple-600',
    };
  };

  useEffect(() => {
    if (videos.length > 0 && currentVideo >= videos.length) {
      setCurrentVideo(0);
    }
  }, [videos, currentVideo]);

  const nextVideo = () => {
    if (videos.length === 0) return;
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    if (videos.length === 0) return;
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const togglePlayPause = () => {
    if (!videoRef.current || videos.length === 0) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
  };

  const handleVideoEnded = () => {
    nextVideo();
  };

  useEffect(() => {
    if (videoRef.current && videos.length > 0) {
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        videoRef.current.pause();
      }
      
      videoRef.current.src = videos[currentVideo]?.url || '';
      
      if (wasPlaying && videos[currentVideo]?.url) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [currentVideo, videos]);

  if (!isOpen) return null;

  const styles = getWindowStyles();

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 ${styles.fullBackground}`}>
      <div className={`p-1 sm:p-2 border-2 border-black/30 w-full max-w-6xl shadow-2xl rounded-lg ${styles.windowFrame} max-h-[95vh] overflow-hidden`}>
        <div className={`p-1 sm:p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-xs sm:text-sm ml-2">TV.exe</span>
          </div>
        </div>
        
        <div className={`p-3 sm:p-6 lg:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent} overflow-y-auto max-h-[85vh] sm:max-h-none`}>
          <div className="flex flex-col items-center justify-center">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 lg:mb-8 font-pixel drop-shadow-lg ${styles.text} text-center`}>[ {t('Retro TV')} ]</h1>
            
            {/* Video Player */}
            <div className={`w-full max-w-4xl ${styles.playerBg} p-3 sm:p-4 lg:p-6 border-2 border-black/30 rounded-lg shadow-lg mb-4 sm:mb-6`}>
              <div className="relative">
                {videos.length > 0 ? (
                  <div 
                    ref={videoContainerRef}
                    className="relative w-full aspect-video bg-black rounded border border-gray-700 overflow-hidden"
                  >
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain rounded"
                      loop
                      autoPlay
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={handleVideoEnded}
                      controls={false}
                      playsInline // Important for mobile
                      muted // Auto-start on mobile
                    >
                      {videos[currentVideo] && <source src={videos[currentVideo].url} type="video/mp4" />}
                    </video>
                    
                    {/* Fullscreen button - Only show on desktop */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 hidden sm:block">
                      <FullscreenButton 
                        targetElement={videoContainerRef.current} 
                        className="opacity-70 hover:opacity-100"
                      />
                    </div>
                    
                    {/* Mobile play/pause overlay */}
                    <div className="absolute inset-0 flex items-center justify-center sm:hidden" onClick={togglePlayPause}>
                      <div className={`w-16 h-16 rounded-full ${styles.button} flex items-center justify-center opacity-80 transition-opacity`}>
                        {isPlaying ? 
                          <Pause className="w-8 h-8" /> : 
                          <Play className="w-8 h-8 ml-1" />
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-black rounded border border-gray-700 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center relative z-10">
                      <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">📡</div>
                      <p className={`${styles.text} font-pixel text-sm sm:text-lg`}>
                        {loading ? 'LOADING CHANNELS...' : 'NO SIGNAL'}
                      </p>
                      <p className={`${styles.text} font-pixel text-xs sm:text-sm mt-1 sm:mt-2 opacity-70`}>
                        {loading ? 'Searching for content...' : 'No videos uploaded yet'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-6 mt-4 sm:mt-6">
                <button
                  onClick={prevVideo}
                  disabled={videos.length === 0}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 font-pixel text-xs shadow-lg`}
                >
                  <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  disabled={videos.length === 0}
                  className={`w-12 h-10 sm:w-16 sm:h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 shadow-lg`}
                >
                  {isPlaying ? 
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : 
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                  }
                </button>
                
                <button
                  onClick={nextVideo}
                  disabled={videos.length === 0}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 font-pixel text-xs shadow-lg`}
                >
                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              {/* Channel info */}
              <div className="flex justify-center mt-3 sm:mt-4">
                <div className={`${styles.cardBg} rounded px-2 sm:px-3 py-1 border-2`}>
                  <span className={`${styles.text} font-pixel text-xs sm:text-sm`}>
                    {loading ? 'SEARCHING CHANNELS...' : videos.length > 0 ? `CH ${currentVideo + 1}/${videos.length}` : 'NO SIGNAL'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`text-lg sm:text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}
            >
              <ArrowLeft className="w-5 h-5" />
              {t('Back to Desktop')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvApp;
