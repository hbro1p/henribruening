
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Contact = () => {
  const { theme } = useSettings();

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-red-300 via-red-400 to-red-600',
        titleBar: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
        windowContent: 'bg-gradient-to-br from-red-200 via-red-300 to-red-400',
        text: 'text-red-900',
        button: 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:via-red-500 hover:to-red-700 text-white',
        link: 'text-red-800 hover:text-red-900',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        button: 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:via-red-500 hover:to-red-700 text-white',
        link: 'text-red-400 hover:text-red-300',
      };
    }
    
    if (theme === 'retro-chrome') {
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
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-red' : ''}`}>
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
            <h1 className={`text-4xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>[ Get In Touch ]</h1>
            <p className={`mb-8 text-lg drop-shadow-sm ${styles.text}`}>Let's connect via Instagram or Email.</p>

            <div className="space-y-4 w-full">
              <a
                href="https://www.instagram.com/henribruening/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center transition-all duration-200 rounded-lg shadow-lg active:scale-95 w-full ${styles.button}`}
              >
                <div className="flex items-center px-6 py-3 relative">
                  {/* Button highlights */}
                  <div className="absolute inset-x-1 top-1 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                  <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/20 to-transparent rounded-b"></div>
                  
                  <MessageSquare className="mr-3 h-6 w-6 drop-shadow-sm" />
                  <span className="text-xl font-pixel drop-shadow-sm">@henribruening</span>
                </div>
              </a>

              <a
                href="mailto:Henri.coesfeld@gmail.com"
                className={`inline-flex items-center justify-center transition-all duration-200 rounded-lg shadow-lg active:scale-95 w-full ${styles.button}`}
              >
                <div className="flex items-center px-6 py-3 relative">
                  {/* Button highlights */}
                  <div className="absolute inset-x-1 top-1 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                  <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/20 to-transparent rounded-b"></div>
                  
                  <Mail className="mr-3 h-6 w-6 drop-shadow-sm" />
                  <span className="text-xl font-pixel drop-shadow-sm">Henri.coesfeld@gmail.com</span>
                </div>
              </a>
            </div>

            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors font-pixel drop-shadow-sm ${styles.link}`}>
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
