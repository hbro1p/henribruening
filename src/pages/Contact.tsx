
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Contact = () => {
  const { theme, t } = useSettings();

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-pink-300 via-pink-400 to-pink-600',
        titleBar: 'bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800',
        windowContent: 'bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400',
        text: 'text-pink-900',
        button: 'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800 hover:from-pink-400 hover:via-pink-500 hover:to-pink-700 text-white',
        link: 'text-pink-800 hover:text-pink-900',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        button: 'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800 hover:from-pink-400 hover:via-pink-500 hover:to-pink-700 text-white',
        link: 'text-pink-400 hover:text-pink-300',
      };
    }
    
    if (theme === 'adventure-canyon') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
        link: 'text-blue-300 hover:text-blue-200',
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      button: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-black/30 text-black hover:from-gray-200 hover:via-gray-300 hover:to-gray-500',
      link: 'text-blue-800 hover:text-blue-900',
    };
  };

  const styles = getWindowStyles();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-pink' : ''}`}>
      {/* Window Frame with 3D effect */}
      <div className={`p-2 border-2 border-black/30 w-full max-w-lg shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Contact.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('Get In Touch')} ]</h1>
            <p className={`mb-8 text-lg drop-shadow-sm ${styles.text}`}>{t('Let\'s connect via Instagram or Email.')}</p>

            <div className="grid gap-3 w-full">
              <a
                href="https://www.instagram.com/henribruening/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-pixel transition-all duration-200 hover:scale-105 active:scale-95 ${styles.button}`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>@henribruening</span>
              </a>

              <a
                href="https://www.linkedin.com/in/henri-brüning-715731286"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-pixel transition-all duration-200 hover:scale-105 active:scale-95 ${styles.button}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href="mailto:Henri.coesfeld@gmail.com"
                className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-pixel transition-all duration-200 hover:scale-105 active:scale-95 ${styles.button}`}
              >
                <Mail className="w-5 h-5" />
                <span>Henri.coesfeld@gmail.com</span>
              </a>
            </div>

            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors font-pixel drop-shadow-sm ${styles.link}`}>
              &lt;- {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
