import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

const About = () => {
  const { theme, t } = useSettings();

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-teal-300 via-teal-400 to-teal-600',
        titleBar: 'bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700',
        windowContent: 'bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400',
        text: 'text-teal-900',
        link: 'text-teal-800 hover:text-teal-900',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        link: 'text-red-400 hover:text-red-300',
      };
    }
    
    if (theme === 'retro-chrome') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-purple-800 hover:text-purple-900',
    };
  };

  const styles = getWindowStyles();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-teal' : ''}`}>
      {/* Window Frame with 3D effect */}
      <div className={`p-2 border-2 border-black/30 w-full max-w-3xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">About.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-start">
            <h1 className={`text-4xl mb-6 font-pixel drop-shadow-lg self-start ${styles.text}`}>[ {t('A Walk Through My Brain')} ]</h1>
            <div className={`space-y-4 text-lg text-left ${styles.text}`}>
              <p className="drop-shadow-sm">
                {t('Hi, I\'m Henri – a 17-year-old creative from Germany who sees the world through a lens that\'s a little nostalgic, a little curious, and always searching for meaning. I started taking photos not because I wanted to be a photographer, but because I wanted to hold on to feelings. To moments. To the little things that usually slip by unnoticed.')}
              </p>
              <p className="drop-shadow-sm">
                {t('I\'m someone who loves to explore – new places, new people, new ways of expressing myself. Whether it\'s through photography, video, design, or just late-night ideas written down in my notes app, I enjoy creating things that make others feel something. I believe creativity should be a playground, not a pressure – and that\'s the energy I try to bring into everything I do.')}
              </p>
              <p className="drop-shadow-sm">
                {t('I\'ve always been fascinated by the mix of old and new. I love analog cameras just as much as glitchy websites. I enjoy building digital spaces that feel human, that are imperfect, honest, and a little playful. This site is a piece of that – not just a portfolio, but a small reflection of who I am, where I\'ve been, and what I\'m still figuring out.')}
              </p>
              <p className="drop-shadow-sm">
                {t('If you want to connect, collaborate, or just share thoughts – feel free to reach out. I\'m always open to new ideas, new perspectives, and new stories.')}
              </p>
            </div>
            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors font-pixel drop-shadow-sm self-start ${styles.link}`}>
              &lt;- {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
