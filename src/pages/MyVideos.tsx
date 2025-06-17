import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const MyVideos = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const { theme, t } = useSettings();

  const correctPassword = 'henribrueningvideos#2025!';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsUnlocked(true);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  // Get folder color scheme for space mood theme
  const getFolderTheme = () => {
    if (theme === 'space-mood') {
      return 'folder-green'; // Green theme for videos folder
    }
    return '';
  };

  const getWindowStyles = () => {
    const folderTheme = getFolderTheme();
    
    if (theme === 'space-mood' && folderTheme) {
      return {
        windowFrame: 'bg-gradient-to-br from-green-300 via-green-400 to-green-600',
        titleBar: 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-700',
        windowContent: 'bg-gradient-to-br from-green-200 via-green-300 to-green-400',
        text: 'text-green-900',
        button: 'bg-gradient-to-br from-green-500 via-green-600 to-green-800 hover:from-green-400 hover:via-green-500 hover:to-green-700 text-white',
        input: 'bg-green-50 border-green-600 text-green-900',
        link: 'text-green-800 hover:text-green-900',
        cardBg: 'bg-green-50 border-green-600',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        button: 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:via-red-500 hover:to-red-700 text-white',
        input: 'bg-gray-800 border-white/30 text-white',
        link: 'text-red-400 hover:text-red-300',
        cardBg: 'bg-gray-800 border-white/20',
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
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
      input: 'bg-white border-black text-black',
      link: 'text-blue-800 hover:text-blue-900',
      cardBg: 'bg-white border-black',
    };
  };

  const styles = getWindowStyles();

  if (!isUnlocked) {
    return (
      <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${getFolderTheme()}`}>
        <div className={`p-2 border-2 border-black/30 w-full max-w-md shadow-2xl rounded-lg ${styles.windowFrame}`}>
          <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
              <span className="text-white font-pixel text-sm ml-2">MyVideos.exe</span>
            </div>
          </div>
          <div className={`p-4 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <Video className={`w-16 h-16 mb-4 ${styles.text}`} />
              <h1 className={`text-2xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Videos')} ]</h1>
              <p className={`mb-6 font-pixel drop-shadow-sm ${styles.text}`}>{t('Oops... looks like this section requires a password')} 😅</p>
              <p className={`mb-6 font-pixel drop-shadow-sm ${styles.text}`}>{t('Enter the password to continue.')}</p>
              
              <form onSubmit={handlePasswordSubmit} className="w-full">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 mb-4 border-2 font-pixel ${styles.input}`}
                  placeholder={t('Password')}
                />
                {showError && (
                  <p className="text-red-600 mb-4 text-sm font-pixel">{t('Incorrect password. Try again.')}</p>
                )}
                <button
                  type="submit"
                  className={`w-full p-2 border-2 border-black/30 font-pixel transition-all active:scale-95 rounded ${styles.button}`}
                >
                  {t('Unlock')}
                </button>
              </form>

              <Link to="/desktop" className={`mt-6 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
                <ArrowLeft className="w-5 h-5" />
                {t('Back to Desktop')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${getFolderTheme()}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">MyVideos.exe</span>
          </div>
        </div>
        
        <div className={`p-4 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Videos')} ]</h1>
            
            <div className="grid gap-8 text-left w-full max-w-2xl">
              <div className={`p-6 border-2 ${styles.cardBg}`}>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel ${styles.text}`}>
                  Ute Uphues
                </h3>
                <p className={`mb-4 font-pixel ${styles.text}`}>{t('Teen coaching videos created for Ute\'s TikTok and Instagram')}</p>
                <div className="space-y-2">
                  <a href="https://www.tiktok.com/@ute.uphues" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel ${styles.link}`}>
                    TikTok <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="https://ute-uphues.replit.app" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel ${styles.link}`}>
                    {t('Website I built')} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className={`p-6 border-2 ${styles.cardBg}`}>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel ${styles.text}`}>
                  Real Estate Internship (Mallorca)
                </h3>
                <p className={`mb-4 font-pixel ${styles.text}`}>{t('A creative and content-focused internship at FALC Real Estate in Cala Millor')}</p>
                <div className="space-y-2">
                  <a href="https://www.instagram.com/p/DIjcdGZIAcr/" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel ${styles.link}`}>
                    Instagram <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className={`p-6 border-2 ${styles.cardBg}`}>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel ${styles.text}`}>
                  HenriAWB – Blackstories with a Hook
                </h3>
                <p className={`mb-4 font-pixel ${styles.text}`}>{t('Entertaining TikToks with surprising twists, hooks, and storytelling')}</p>
                <div className="space-y-2">
                  <a href="https://www.youtube.com/@Henriawb" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel ${styles.link}`}>
                    YouTube <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className={`p-6 border-2 ${styles.cardBg}`}>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel ${styles.text}`}>
                  ThisTimeFr
                </h3>
                <p className={`mb-4 font-pixel ${styles.text}`}>{t('My storytelling identity for vlogs, creative clips, and travel adventures')}</p>
                <div className="space-y-2">
                  <a href="https://www.tiktok.com/@thistimefrr" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel ${styles.link}`}>
                    TikTok <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="https://www.youtube.com/@Thistimefr" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel ${styles.link}`}>
                    YouTube <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
              <ArrowLeft className="w-5 h-5" />
              {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVideos;
