import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, ExternalLink, Plus } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useStorageLinks } from '@/hooks/useStorageLinks';

const MyProjects = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const { theme, t } = useSettings();
  const { links: projectLinks, loading: linksLoading } = useStorageLinks('project-links');

  const correctPassword = 'henribrueningprojects#2025!';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsUnlocked(true);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600',
        titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
        windowContent: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400',
        text: 'text-orange-900',
        link: 'text-orange-800 hover:text-orange-900',
        button: 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 border-2 border-black/30 text-orange-900 hover:from-orange-200 hover:via-orange-300 hover:to-orange-500',
        icon: 'text-orange-800',
        iconBg: 'bg-gradient-to-br from-orange-500 to-orange-700',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        link: 'text-orange-400 hover:text-orange-300',
        button: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 border-2 border-white/30 text-white hover:from-gray-500 hover:via-gray-600 hover:to-gray-700',
        icon: 'text-white',
        iconBg: 'bg-gradient-to-br from-orange-500 to-orange-700',
      };
    }
    
    if (theme === 'retro-chrome') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
        button: 'bg-gradient-to-br from-slate-500 via-blue-600 to-slate-700 border-2 border-blue-300/30 text-white hover:from-slate-400 hover:via-blue-500 hover:to-slate-600',
        icon: 'text-white',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-green-600 via-green-700 to-teal-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-green-800 hover:text-green-900',
      button: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-3 border-black/40 hover:from-gray-200 hover:via-gray-300 hover:to-gray-500 text-black',
      icon: 'text-white',
      iconBg: 'bg-gradient-to-br from-green-500 to-teal-600',
    };
  };

  const styles = getWindowStyles();

  if (!isUnlocked) {
    return (
      <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-orange' : ''}`}>
        {/* Window Frame with 3D effect */}
        <div className={`p-2 border-2 border-black/30 w-full max-w-md shadow-2xl rounded-lg ${styles.windowFrame}`}>
          {/* Title bar */}
          <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
              <span className="text-white font-pixel text-sm ml-2">Projects.exe - LOCKED</span>
            </div>
          </div>
          
          {/* Window content */}
          <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`w-16 h-16 ${styles.iconBg} rounded-lg shadow-lg border-2 border-black/20 flex items-center justify-center mb-4`}>
                <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                <Code className={`w-8 h-8 ${styles.icon} drop-shadow-lg relative z-10`} />
              </div>
              
              <h1 className={`text-2xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Projects')} ]</h1>
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
                    className="w-full p-4 border-3 border-black/40 bg-white text-black rounded-lg shadow-inner font-pixel text-lg focus:outline-none focus:border-blue-500 focus:bg-blue-50 focus:shadow-lg transition-all duration-200"
                    placeholder={t('language') === 'deutsch' ? 'Passwort eingeben...' : 'Enter password...'}
                    style={{ 
                      zIndex: 10,
                      position: 'relative',
                      pointerEvents: 'auto'
                    }}
                  />
                  <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded pointer-events-none"></div>
                </div>
                
                {showError && (
                  <div className="bg-red-100 border-2 border-red-400 p-3 rounded-lg">
                    <p className="text-red-700 text-sm font-pixel drop-shadow-sm">
                      {t('language') === 'deutsch' ? 'Falsches Passwort. Versuchen Sie es erneut.' : 'Incorrect password. Try again.'}
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
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-orange' : ''}`}>
      {/* Window Frame with 3D effect */}
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Projects.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Projects')} ]</h1>
            
            <div className="grid gap-8 text-left w-full max-w-2xl">
              <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 border-2 border-black/30 rounded-lg shadow-lg">
                <div className="absolute inset-x-2 top-2 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel drop-shadow-sm ${styles.text}`}>
                  Internly
                </h3>
                <p className={`mb-4 drop-shadow-sm ${styles.text}`}>
                  {t('language') === 'deutsch' 
                    ? 'Entwickle derzeit eine Plattform, um Studenten mit Praktika zu verbinden'
                    : 'Currently developing a platform to connect students with internships'
                  }
                </p>
                <div className="space-y-2">
                  <a href="https://internly.replit.app" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel drop-shadow-sm ${styles.link}`}>
                    Website <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/internly.de/" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel drop-shadow-sm ${styles.link}`}>
                    Instagram <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 border-2 border-black/30 rounded-lg shadow-lg relative">
                <div className="absolute inset-x-2 top-2 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel drop-shadow-sm ${styles.text}`}>
                  Echo Coesfeld
                </h3>
                <p className={`mb-4 drop-shadow-sm ${styles.text}`}>
                  {t('language') === 'deutsch'
                    ? 'Ein öffentliches Stimmprojekt mit QR-Codes & Interviews, um echte Meinungen von Menschen in Coesfeld zu sammeln'
                    : 'A public voice project using QR codes & interviews to gather real opinions from people in Coesfeld'
                  }
                </p>
                <div className="space-y-2">
                  <a href="https://www.instagram.com/echo.coesfeld/" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel drop-shadow-sm ${styles.link}`}>
                    Instagram <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="https://www.tiktok.com/@echo.coesfeld" target="_blank" rel="noopener noreferrer" 
                     className={`flex items-center gap-2 underline font-pixel drop-shadow-sm ${styles.link}`}>
                    TikTok <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* More section */}
              <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 border-2 border-black/30 rounded-lg shadow-lg relative">
                <div className="absolute inset-x-2 top-2 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 font-pixel drop-shadow-sm ${styles.text}`}>
                  <Plus className="w-5 h-5" />
                  More
                </h3>
                <p className={`mb-4 drop-shadow-sm ${styles.text}`}>
                  {t('language') === 'deutsch' ? 'Zusätzliche Projekte und Links' : 'Additional projects and links'}
                </p>
                {linksLoading ? (
                  <p className={`text-sm font-pixel drop-shadow-sm ${styles.text}`}>
                    {t('language') === 'deutsch' ? 'Lade Links...' : 'Loading links...'}
                  </p>
                ) : projectLinks.length > 0 ? (
                  <div className="space-y-2">
                    {projectLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center gap-2 underline font-pixel drop-shadow-sm ${styles.link}`}
                      >
                        {link.name} <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className={`text-sm font-pixel drop-shadow-sm ${styles.text}`}>
                    <p className="mb-2">
                      {t('language') === 'deutsch' ? 'Noch keine zusätzlichen Links verfügbar.' : 'No additional links available yet.'}
                    </p>
                    <p className="text-xs opacity-70">
                      {t('language') === 'deutsch' 
                        ? 'Tipp: Lade eine .txt Datei mit einer URL in den project-links Bucket hoch, um sie hier anzuzeigen.' 
                        : 'Tip: Upload a .txt file with a URL to the project-links bucket to display it here.'}
                    </p>
                  </div>
                )}
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

export default MyProjects;
