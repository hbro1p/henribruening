
import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Tv } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTvVideos } from '@/hooks/useTvVideos';

interface TvAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const TvApp: React.FC<TvAppProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t, theme } = useSettings();
  const { videos, loading } = useTvVideos();

  const correctPassword = 'henritv#2025!';

  useEffect(() => {
    if (videos.length > 0 && currentVideo >= videos.length) {
      setCurrentVideo(0);
    }
  }, [videos, currentVideo]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid password');
      setPassword('');
    }
  };

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
    if (videoRef.current && videos.length > 0 && isAuthenticated) {
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        videoRef.current.pause();
      }
      
      videoRef.current.src = videos[currentVideo]?.url || '';
      
      if (wasPlaying && videos[currentVideo]?.url) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [currentVideo, videos, isAuthenticated]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-red-500 rounded-lg p-8 w-96 max-w-full shadow-lg shadow-red-500/20 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-red-400 border border-red-500/50"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-red-500 relative">
              <Tv className="w-8 h-8 text-red-400" />
              {/* Static lines on the TV icon */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-400/20 to-transparent opacity-50" />
            </div>
            <h2 className="text-xl font-mono text-red-400 mb-2">SECURE TV ACCESS</h2>
            <p className="text-sm text-red-300 font-mono">PASSWORD REQUIRED</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3 py-2 bg-black/50 border border-red-500/50 rounded text-red-300 font-mono placeholder-red-500/50 focus:outline-none focus:border-red-400"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-xs font-mono mt-1">❌ {passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-red-900 hover:bg-red-800 text-red-300 font-mono border border-red-500 rounded transition-colors"
            >
              UNLOCK CHANNEL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl h-full max-h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black border-4 border-gray-600 rounded-lg overflow-hidden shadow-2xl">
        {/* CRT TV Frame Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none z-10" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded bg-red-800 hover:bg-red-700 text-red-300 border border-red-500 flex items-center justify-center z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TV Header with VHS controls */}
        <div className="relative z-20 p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b-2 border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-900 rounded border-2 border-gray-500 flex items-center justify-center relative">
                <Tv className="w-6 h-6 text-green-400" />
                {/* Screen glitch effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-mono text-green-400">RETRO TV</h2>
                <p className="text-xs font-mono text-green-300">
                  {loading ? 'SEARCHING CHANNELS...' : videos.length > 0 ? `CH ${currentVideo + 1}/${videos.length}` : 'NO SIGNAL'}
                </p>
              </div>
            </div>
            
            {/* VHS-style indicators */}
            <div className="flex items-center space-x-4 text-green-400 font-mono text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>REC</span>
              </div>
              <div className="w-px h-4 bg-gray-500" />
              <span>TRACKING: {isPlaying ? 'AUTO' : 'MANUAL'}</span>
              <div className="w-px h-4 bg-gray-500" />
              <span>SP</span>
            </div>
          </div>
        </div>

        {/* Video Container with Enhanced CRT effect */}
        <div className="relative flex-1 bg-black p-4" style={{ height: 'calc(100% - 140px)' }}>
          {videos.length > 0 ? (
            <div className="relative w-full h-full bg-black rounded border border-gray-700 overflow-hidden">
              {/* Enhanced scanlines effect */}
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
                  animation: 'scanlines 0.1s linear infinite'
                }}
              />
              
              {/* Static/glitch overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-10"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                  animation: 'static 0.05s infinite'
                }}
              />
              
              {/* CRT curvature effect */}
              <div className="absolute inset-2 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none z-10 rounded" />
              
              <video
                ref={videoRef}
                className="w-full h-full object-contain rounded"
                loop
                muted
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
                style={{ 
                  filter: 'contrast(1.1) brightness(0.9) saturate(1.2)',
                  transform: 'scale(0.98)' // Slight inset for CRT effect
                }}
              >
                <source src={videos[currentVideo]?.url} type="video/mp4" />
              </video>
              
              {/* Video overlay info */}
              <div className="absolute bottom-4 left-4 bg-black/80 rounded px-3 py-1 border border-green-500/30">
                <p className="text-green-400 font-mono text-sm">
                  {videos[currentVideo]?.title || 'Unknown Channel'}
                </p>
              </div>
              
              {/* Channel number overlay */}
              <div className="absolute top-4 right-4 bg-black/80 rounded px-2 py-1 border border-green-500/30">
                <p className="text-green-400 font-mono text-xs">
                  CH {currentVideo + 1}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-black rounded border border-gray-700 flex items-center justify-center relative overflow-hidden">
              {/* Static effect for no signal */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.8'/%3E%3C/svg%3E")`,
                  animation: 'static 0.1s infinite'
                }}
              />
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4">📡</div>
                <p className="text-green-400 font-mono text-lg animate-pulse">NO SIGNAL</p>
                <p className="text-green-300 font-mono text-sm mt-2">
                  Upload videos to /tv/ folder
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced VHS-style Controls */}
        <div className="relative z-20 p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-t-2 border-gray-600">
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={prevVideo}
              disabled={videos.length === 0}
              className="w-12 h-12 rounded bg-gray-700 hover:bg-gray-600 text-green-400 border border-green-500/50 flex items-center justify-center transition-all disabled:opacity-50 font-mono text-xs"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-mono text-xs">|◂◂</span>
              <button
                onClick={togglePlayPause}
                disabled={videos.length === 0}
                className="w-16 h-12 rounded bg-green-900 hover:bg-green-800 text-green-300 border border-green-500 flex items-center justify-center transition-all disabled:opacity-50 shadow-lg"
              >
                {isPlaying ? 
                  <Pause className="w-6 h-6" /> : 
                  <Play className="w-6 h-6 ml-0.5" />
                }
              </button>
              <span className="text-green-400 font-mono text-xs">▸▸|</span>
            </div>
            
            <button
              onClick={nextVideo}
              disabled={videos.length === 0}
              className="w-12 h-12 rounded bg-gray-700 hover:bg-gray-600 text-green-400 border border-green-500/50 flex items-center justify-center transition-all disabled:opacity-50 font-mono text-xs"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          
          {/* VHS time display */}
          <div className="flex justify-center mt-2">
            <div className="bg-black/50 rounded px-3 py-1 border border-green-500/30">
              <span className="text-green-400 font-mono text-xs">
                00:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvApp;
