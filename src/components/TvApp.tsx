
import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { useSecureTvVideos } from '@/hooks/useSecureTvVideos';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';

interface TvAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const TvApp = ({ isOpen, onClose }: TvAppProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const isAuthenticated = useGlobalAuth();
  const { videos, loading, error } = useSecureTvVideos(isAuthenticated);

  const currentVideo = videos[currentVideoIndex];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentVideoIndex(prev => prev > 0 ? prev - 1 : videos.length - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentVideoIndex(prev => (prev + 1) % videos.length);
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isPlaying, videos.length, isFullscreen, onClose]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-white text-center">
          <p className="text-xl">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black ${isFullscreen ? 'z-[60]' : 'bg-opacity-90 z-50'} flex items-center justify-center`}>
      <div className={`bg-gray-900 rounded-lg overflow-hidden ${isFullscreen ? 'w-full h-full' : 'w-[90vw] h-[90vh] max-w-6xl'}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">TV</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex">
          {/* Video Player */}
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading content...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-red-400 mb-4">Content unavailable</p>
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white">
                <p>No content available</p>
              </div>
            ) : (
              <>
                {/* Video Display */}
                <div className="flex-1 bg-black relative">
                  {currentVideo && (
                    <video
                      key={currentVideo.url}
                      src={currentVideo.url}
                      className="w-full h-full object-contain"
                      controls={false}
                      autoPlay={isPlaying}
                      muted={isMuted}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  )}
                  
                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </button>
                      
                      <button
                        onClick={() => {
                          setCurrentVideoIndex(0);
                          setIsPlaying(false);
                        }}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <RotateCcw size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-white text-sm">
                        {currentVideoIndex + 1} / {videos.length}
                      </span>
                      
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Video Info */}
                <div className="p-4 bg-gray-800 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {currentVideo?.title || 'Video'}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentVideoIndex(prev => prev > 0 ? prev - 1 : videos.length - 1)}
                      disabled={videos.length <= 1}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentVideoIndex(prev => (prev + 1) % videos.length)}
                      disabled={videos.length <= 1}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Playlist Sidebar */}
          {!isFullscreen && videos.length > 0 && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Playlist ({videos.length})</h3>
              </div>
              <div className="space-y-1">
                {videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-full p-3 text-left transition-colors ${
                      index === currentVideoIndex
                        ? 'bg-gray-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="font-medium truncate">{video.title}</div>
                    <div className="text-sm text-gray-400 truncate">{video.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TvApp;
