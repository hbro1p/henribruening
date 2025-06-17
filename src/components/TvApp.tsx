
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
  const [showCursor, setShowCursor] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t, theme } = useSettings();
  const { videos, loading } = useTvVideos();

  const correctPassword = 'henritv#2025!';

  // Blinking cursor for password screen
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark-vhs':
        return {
          container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-4 border-green-400',
          header: 'bg-gradient-to-r from-gray-800 to-gray-700 border-b-2 border-green-400',
          button: 'bg-gray-700 hover:bg-gray-600 text-green-400 border border-green-500/50',
          activeButton: 'bg-green-900 hover:bg-green-800 text-green-300 border border-green-500',
          closeButton: 'bg-red-800 hover:bg-red-700 text-red-300 border border-red-500',
          text: 'text-green-400',
          subText: 'text-green-300',
          accent: 'green-400',
          passwordContainer: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-green-500 shadow-lg shadow-green-500/20',
          passwordButton: 'bg-green-900 hover:bg-green-800 text-green-300 font-mono border border-green-500',
          passwordInput: 'bg-gray-800 border border-green-500/50 text-green-400 placeholder-green-400/50',
          scanlines: 'before:bg-gradient-to-b before:from-green-400/5 before:via-transparent before:to-green-400/5'
        };
      case 'retro-chrome':
        return {
          container: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-4 border-blue-600',
          header: 'bg-gradient-to-r from-blue-300 to-blue-400 border-b-2 border-blue-600',
          button: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-500',
          activeButton: 'bg-blue-400 hover:bg-blue-500 text-blue-800 border border-blue-600',
          closeButton: 'bg-red-200 hover:bg-red-300 text-red-800 border border-red-500',
          text: 'text-blue-800',
          subText: 'text-blue-700',
          accent: 'blue-500',
          passwordContainer: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-2 border-blue-600 shadow-lg',
          passwordButton: 'bg-blue-400 hover:bg-blue-500 text-blue-800 font-mono border border-blue-600',
          passwordInput: 'bg-blue-50 border border-blue-500/50 text-blue-800 placeholder-blue-500/50',
          scanlines: 'before:bg-gradient-to-b before:from-blue-400/5 before:via-transparent before:to-blue-400/5'
        };
      default: // space-mood - PURPLE theme to match desktop icon
        return {
          container: 'bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 border-4 border-purple-500',
          header: 'bg-gradient-to-r from-purple-800/90 to-purple-700/90 border-b-2 border-purple-500',
          button: 'bg-purple-700/80 hover:bg-purple-600/80 text-purple-100 border border-purple-400/50',
          activeButton: 'bg-purple-600/90 hover:bg-purple-500/90 text-purple-100 border border-purple-400',
          closeButton: 'bg-red-700/80 hover:bg-red-600/80 text-red-100 border border-red-400/50',
          text: 'text-purple-100',
          subText: 'text-purple-200',
          accent: 'purple-400',
          passwordContainer: 'bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 border-2 border-purple-500 shadow-lg shadow-purple-500/20',
          passwordButton: 'bg-purple-600 hover:bg-purple-500 text-purple-100 font-mono border border-purple-400',
          passwordInput: 'bg-purple-900/50 border border-purple-500/50 text-purple-100 placeholder-purple-300/50',
          scanlines: 'before:bg-gradient-to-b before:from-purple-400/5 before:via-transparent before:to-purple-400/5'
        };
    }
  };

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
      setPasswordError('ACCESS DENIED');
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
    const styles = getThemeStyles();

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className={`${styles.passwordContainer} rounded-lg p-8 w-96 max-w-full relative ${styles.scanlines} relative before:absolute before:inset-0 before:pointer-events-none before:rounded-lg`}>
          {/* CRT scanlines effect */}
          <div 
            className="absolute inset-0 pointer-events-none z-10 opacity-20 rounded-lg"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)`,
              animation: 'scanlines 0.1s linear infinite'
            }}
          />
          
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 w-8 h-8 rounded flex items-center justify-center ${styles.closeButton} z-20`}
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="text-center mb-6 relative z-20">
            <div className={`w-16 h-16 mx-auto mb-4 bg-gray-900/80 rounded-lg flex items-center justify-center border-2 border-${styles.accent} relative`}>
              <Tv className={`w-8 h-8 text-${styles.accent}`} />
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-${styles.accent}/20 to-transparent opacity-50 rounded-lg`} />
            </div>
            <h2 className={`text-xl font-mono ${styles.text} mb-2 tracking-wider`}>
              ░ SECURE TV ACCESS ░
            </h2>
            <p className={`text-sm ${styles.subText} font-mono tracking-wide`}>
              █ ENTER AUTHORIZATION CODE █
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 relative z-20">
            <div className="relative">
              <div className={`w-full px-4 py-3 ${styles.passwordInput} rounded font-mono text-center tracking-widest placeholder-opacity-50 focus:outline-none focus:border-${styles.accent} text-lg relative`}>
                <div className="flex justify-center items-center">
                  <span className="text-opacity-50">{'*'.repeat(password.length)}</span>
                  {showCursor && <span className={`text-${styles.accent} animate-pulse ml-1`}>█</span>}
                </div>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full"
                autoFocus
                placeholder=""
              />
              {passwordError && (
                <div className={`${styles.text} text-xs font-mono mt-2 text-center animate-pulse`}>
                  ⚠ {passwordError} ⚠
                </div>
              )}
            </div>
            <button
              type="submit"
              className={`w-full py-3 ${styles.passwordButton} rounded transition-colors tracking-wider`}
            >
              ► DECRYPT SIGNAL ◄
            </button>
          </form>
          
          <div className={`text-center mt-4 ${styles.subText} font-mono text-xs opacity-60`}>
            RETRO-TV v2.5 • SECURITY LEVEL: MAX
          </div>
        </div>
      </div>
    );
  }

  const styles = getThemeStyles();

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-4xl h-full max-h-[80vh] ${styles.container} rounded-lg overflow-hidden shadow-2xl`}>
        {/* CRT TV Frame Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none z-10" />
        
        {/* TV Header */}
        <div className={`relative z-20 p-4 ${styles.header}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gray-900/80 rounded border-2 border-${styles.accent} flex items-center justify-center relative`}>
                <Tv className={`w-6 h-6 text-${styles.accent}`} />
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${styles.accent}/10 to-transparent animate-pulse rounded`} />
              </div>
              <div>
                <h2 className={`text-lg font-mono ${styles.text}`}>RETRO TV</h2>
                <p className={`text-xs font-mono ${styles.subText}`}>
                  {loading ? 'SEARCHING CHANNELS...' : videos.length > 0 ? `CH ${currentVideo + 1}/${videos.length}` : 'NO SIGNAL'}
                </p>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded ${styles.closeButton} flex items-center justify-center`}
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* VHS-style indicators */}
            <div className={`flex items-center space-x-4 ${styles.text} font-mono text-xs`}>
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
                  background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)`,
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
                {videos[currentVideo] && <source src={videos[currentVideo].url} type="video/mp4" />}
              </video>
              
              {/* Video overlay info */}
              <div className={`absolute bottom-4 left-4 bg-black/80 rounded px-3 py-1 border border-${styles.accent}/30`}>
                <p className={`${styles.text} font-mono text-sm`}>
                  {videos[currentVideo]?.title || 'Unknown Channel'}
                </p>
              </div>
              
              {/* Channel number overlay */}
              <div className={`absolute top-4 right-4 bg-black/80 rounded px-2 py-1 border border-${styles.accent}/30`}>
                <p className={`${styles.text} font-mono text-xs`}>
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
                <p className={`${styles.text} font-mono text-lg animate-pulse`}>NO SIGNAL</p>
                <p className={`${styles.subText} font-mono text-sm mt-2`}>
                  Upload videos to /tv/ folder
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced VHS-style Controls */}
        <div className={`relative z-20 p-4 ${styles.header}`}>
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={prevVideo}
              disabled={videos.length === 0}
              className={`w-12 h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 font-mono text-xs`}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <span className={`${styles.text} font-mono text-xs`}>|◂◂</span>
              <button
                onClick={togglePlayPause}
                disabled={videos.length === 0}
                className={`w-16 h-12 rounded ${styles.activeButton} flex items-center justify-center transition-all disabled:opacity-50 shadow-lg`}
              >
                {isPlaying ? 
                  <Pause className="w-6 h-6" /> : 
                  <Play className="w-6 h-6 ml-0.5" />
                }
              </button>
              <span className={`${styles.text} font-mono text-xs`}>▸▸|</span>
            </div>
            
            <button
              onClick={nextVideo}
              disabled={videos.length === 0}
              className={`w-12 h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 font-mono text-xs`}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          
          {/* VHS time display */}
          <div className="flex justify-center mt-2">
            <div className={`bg-black/50 rounded px-3 py-1 border border-${styles.accent}/30`}>
              <span className={`${styles.text} font-mono text-xs`}>
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
