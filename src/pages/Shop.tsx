import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const { theme, t } = useSettings();
  const [isFlipped, setIsFlipped] = useState(false);

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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

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
        <div className={`p-6 sm:p-12 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent} min-h-[600px] flex flex-col items-center justify-center`}>
          
          {/* Floating Image */}
          <div style={{ perspective: '1500px' }} className="mb-8">
            <div
              onClick={handleFlip}
              style={{
                maxWidth: '500px',
                width: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                cursor: 'pointer',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              {/* Front Side - NUR das Bild */}
              <div
                style={{
                  width: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <img
                  src="/lovable-uploads/la-vaca-painting.jpg"
                  alt="La Vaca - Eine Kuh auf einem Baumstamm"
                  className="w-full h-auto rounded-lg shadow-2xl hover:shadow-[0_0_60px_rgba(234,179,8,0.8)] transition-shadow duration-300"
                />
              </div>

              {/* Back Side - Die Geschichte */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-200 rounded-lg shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-4 border-amber-400">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-6 text-center font-pixel">
                      {t('La Vaca')} 🐄
                    </h2>
                    <div className="text-amber-900 text-sm sm:text-base leading-relaxed space-y-3">
                      <p>{t('la-vaca-story-1')}</p>
                      <p>{t('la-vaca-story-2')}</p>
                      <p>{t('la-vaca-story-3')}</p>
                      <p>{t('la-vaca-story-4')}</p>
                      <p className="font-semibold">{t('la-vaca-story-5')}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className={`w-full font-bold py-3 rounded-lg transition-colors shadow-lg font-pixel ${styles.button}`}>
                      {t('Inquire')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Desktop Link */}
          <Link to="/desktop" className={`text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
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
