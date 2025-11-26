import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlinkingCursor from '@/components/BlinkingCursor';

const Shop = () => {
  const { theme, t } = useSettings();
  const [showDetails, setShowDetails] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const fullStory = showDetails ? `${t('La Vaca')} 🐄\n\n${t('la-vaca-story-1')}\n\n${t('la-vaca-story-2')}\n\n${t('la-vaca-story-3')}\n\n${t('la-vaca-story-4')}\n\n${t('la-vaca-story-5')}` : '';

  useEffect(() => {
    if (showDetails && fullStory) {
      setDisplayedText('');
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullStory.length) {
          setDisplayedText(fullStory.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showDetails, fullStory]);

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500',
        titleBar: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600',
        windowContent: 'bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300',
        text: 'text-amber-900',
        link: 'text-amber-800 hover:text-amber-900',
        button: 'bg-amber-500 hover:bg-amber-400 text-amber-900',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        link: 'text-amber-400 hover:text-amber-300',
        button: 'bg-amber-500 hover:bg-amber-400 text-gray-900',
      };
    }
    
    if (theme === 'adventure-canyon') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
        button: 'bg-amber-500 hover:bg-amber-400 text-amber-900',
      };
    }
    
    // Default fallback
    return {
      windowFrame: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500',
      titleBar: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600',
      windowContent: 'bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300',
      text: 'text-amber-900',
      link: 'text-amber-800 hover:text-amber-900',
      button: 'bg-amber-500 hover:bg-amber-400 text-amber-900',
    };
  };

  const styles = getWindowStyles();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-amber' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-6xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">{t('Shop')}</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-12 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent} min-h-[700px] flex flex-col items-center justify-start pt-8`}>
          
          {/* Initial State: Image + Price + Buy Button */}
          {!showDetails && (
            <div className="flex flex-col items-center space-y-6">
              <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                <img
                  src="/lovable-uploads/la-vaca-painting.jpg"
                  alt="La Vaca - Eine Kuh auf einem Baumstamm"
                  onClick={() => setShowDetails(true)}
                  className="w-full h-auto rounded-lg shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-[0_0_60px_rgba(234,179,8,0.8)]"
                  style={{ animation: 'float 6s ease-in-out infinite' }}
                />
              </div>
              <div className="text-center space-y-4">
                <p className={`text-3xl font-bold font-pixel ${styles.text}`}>€399</p>
                <button className={`px-8 py-3 rounded-lg transition-colors shadow-lg font-pixel text-lg ${styles.button}`}>
                  {t('Buy now')}
                </button>
              </div>
            </div>
          )}

          {/* After Click: Two-Column Layout */}
          {showDetails && (
            <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Column: Typewriter Story */}
              <div className="flex-1 lg:w-3/5">
                <div className={`font-mono text-sm leading-snug whitespace-pre-wrap ${styles.text}`}>
                  {displayedText}
                  {displayedText.length < fullStory.length && <BlinkingCursor />}
                </div>
                
                {displayedText.length >= fullStory.length && (
                  <div className="mt-6 animate-fade-in">
                    <button className={`w-full font-bold py-3 rounded-lg transition-colors shadow-lg font-pixel ${styles.button}`}>
                      {t('Inquire')}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Right Column: Image */}
              <div className="lg:w-2/5 flex justify-center">
                <img
                  src="/lovable-uploads/la-vaca-painting.jpg"
                  alt="La Vaca"
                  className="w-full max-w-[300px] h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          )}

          {/* Back to Desktop Link - at the bottom */}
          <Link to="/desktop" className={`mt-auto text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
            <ArrowLeft className="w-5 h-5" />
            {t('Back to Desktop')}
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotateX(0deg);
          }
          50% {
            transform: translateY(-15px) rotateX(2deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;
