
import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Tv, ArrowLeft } from 'lucide-react';
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

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
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
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        button: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 hover:from-purple-400 hover:via-purple-500 hover:to-purple-700 text-white',
        input: 'bg-gray-800 border-white/30 text-white',
        link: 'text-purple-400 hover:text-purple-300',
        cardBg: 'bg-gray-800 border-white/20',
        playerBg: 'bg-gradient-to-br from-gray-800 via-gray-700 to-black',
        accent: 'purple-400',
      };
    }
    
    if (theme === 'retro-chrome') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
        input: 'bg-slate-800 border-blue-400/30 text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
        cardBg: 'bg-slate-800 border-blue-400/30',
        playerBg: 'bg-gradient-to-br from-slate-700 via-blue-800 to-slate-900',
        accent: 'blue-400',
      };
    }
    
    // Default fallback
    return {
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

  const styles = getWindowStyles();

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-purple' : ''}`}>
        <div className={`p-2 border-2 border-black/30 w-full max-w-md shadow-2xl rounded-lg ${styles.windowFrame}`}>
          <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
              <span className="text-white font-pixel text-sm ml-2">TV.exe - LOCKED</span>
            </div>
          </div>
          
          <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg border-2 border-black/20 flex items-center justify-center mb-4`}>
                <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                <Tv className={`w-8 h-8 text-white drop-shadow-lg relative z-10`} />
              </div>
              
              <h1 className={`text-2xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('Retro TV')} ]</h1>
              <p className={`mb-6 font-pixel drop-shadow-sm ${styles.text}`}>
                {t('language') === 'deutsch' ? 'Ups... dieser Bereich benötigt ein Passwort 😅' : 'Oops... looks like this section requires a password 😅'}
              </p>
              <p className={`mb-6 font-pixel drop-shadow-sm ${styles.text}`}>
                {t('language') === 'deutsch' ? 'Geben Sie das Passwort ein, um fortzufahren.' : 'Enter the password to continue.'}
              </p>
              
              <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className={`w-full p-4 border-3 border-black/40 rounded-lg shadow-inner font-pixel text-lg focus:outline-none transition-all duration-200 ${styles.input}`}
                    placeholder={t('language') === 'deutsch' ? 'Passwort eingeben...' : 'Enter password...'}
                  />
                  <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded pointer-events-none"></div>
                </div>
                
                {passwordError && (
                  <div className="bg-red-100 border-2 border-red-400 p-3 rounded-lg">
                    <p className="text-red-700 text-sm font-pixel drop-shadow-sm">
                      {passwordError}
                    </p>
                  </div>
                )}
                
                <button
                  type="submit"
                  className={`w-full p-4 active:scale-95 font-bold font-pixel text-lg transition-all rounded-lg shadow-lg hover:shadow-xl relative ${styles.button}`}
                >
                  <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded pointer-events-none"></div>
                  <span className="relative z-10">
                    {t('language') === 'deutsch' ? 'Entsperren' : 'Unlock'}
                  </span>
                </button>
              </form>

              <button
                onClick={onClose}
                className={`mt-6 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}
              >
                <ArrowLeft className="w-5 h-5" />
                {t('Back to Desktop')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-purple' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">TV.exe</span>
          </div>
        </div>
        
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text} text-center`}>[ {t('Retro TV')} ]</h1>
            
            {/* Video Player */}
            <div className={`w-full max-w-2xl ${styles.playerBg} p-6 border-2 border-black/30 rounded-lg shadow-lg mb-6`}>
              <div className="relative">
                {videos.length > 0 ? (
                  <div className="relative w-full aspect-video bg-black rounded border border-gray-700 overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain rounded"
                      loop
                      muted
                      autoPlay
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={handleVideoEnded}
                    >
                      {videos[currentVideo] && <source src={videos[currentVideo].url} type="video/mp4" />}
                    </video>
                    
                    {/* Video overlay info */}
                    <div className={`absolute bottom-4 left-4 bg-black/80 rounded px-3 py-1 border border-${styles.accent}/30`}>
                      <p className={`${styles.text} font-pixel text-sm`}>
                        {videos[currentVideo]?.title || 'Unknown Channel'}
                      </p>
                    </div>
                    
                    {/* Channel number overlay */}
                    <div className={`absolute top-4 right-4 bg-black/80 rounded px-2 py-1 border border-${styles.accent}/30`}>
                      <p className={`${styles.text} font-pixel text-xs`}>
                        CH {currentVideo + 1}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-black rounded border border-gray-700 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center relative z-10">
                      <div className="text-6xl mb-4">📡</div>
                      <p className={`${styles.text} font-pixel text-lg`}>NO SIGNAL</p>
                      <p className={`${styles.text} font-pixel text-sm mt-2 opacity-70`}>
                        Upload videos to /tv/ folder
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center space-x-6 mt-6">
                <button
                  onClick={prevVideo}
                  disabled={videos.length === 0}
                  className={`w-12 h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 font-pixel text-xs shadow-lg`}
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  disabled={videos.length === 0}
                  className={`w-16 h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 shadow-lg`}
                >
                  {isPlaying ? 
                    <Pause className="w-6 h-6" /> : 
                    <Play className="w-6 h-6 ml-0.5" />
                  }
                </button>
                
                <button
                  onClick={nextVideo}
                  disabled={videos.length === 0}
                  className={`w-12 h-12 rounded ${styles.button} flex items-center justify-center transition-all disabled:opacity-50 font-pixel text-xs shadow-lg`}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              
              {/* Channel info */}
              <div className="flex justify-center mt-4">
                <div className={`${styles.cardBg} rounded px-3 py-1 border-2`}>
                  <span className={`${styles.text} font-pixel text-xs`}>
                    {loading ? 'SEARCHING CHANNELS...' : videos.length > 0 ? `CH ${currentVideo + 1}/${videos.length}` : 'NO SIGNAL'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}
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
