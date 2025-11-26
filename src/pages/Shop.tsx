import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const { theme, t } = useSettings();
  const [showDetails, setShowDetails] = useState(false);

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
        <div className={`p-6 sm:p-12 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent} min-h-[600px] flex flex-col items-center justify-center`}>
          
          {/* Floating Image with Overlay */}
          <div className="relative mb-8" style={{ maxWidth: '350px', margin: '0 auto' }}>
            {/* Floating Image */}
            <img
              src="/lovable-uploads/la-vaca-painting.jpg"
              alt="La Vaca - Eine Kuh auf einem Baumstamm"
              onClick={() => setShowDetails(true)}
              className={`w-full h-auto rounded-lg shadow-2xl cursor-pointer transition-all duration-500 ${
                showDetails ? 'blur-sm scale-105' : 'hover:shadow-[0_0_60px_rgba(234,179,8,0.8)]'
              }`}
              style={{ animation: 'float 6s ease-in-out infinite' }}
            />
            
            {/* Details Overlay */}
            {showDetails && (
              <div 
                className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 rounded-lg flex flex-col justify-between p-6 sm:p-8 animate-fade-in backdrop-blur-sm"
              >
                <div className="overflow-y-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-4 text-center font-pixel">
                    {t('La Vaca')} 🐄
                  </h2>
                  <div className="text-white/90 text-xs sm:text-sm leading-relaxed space-y-2">
                    <p>{t('la-vaca-story-1')}</p>
                    <p>{t('la-vaca-story-2')}</p>
                    <p>{t('la-vaca-story-3')}</p>
                    <p>{t('la-vaca-story-4')}</p>
                    <p className="font-semibold">{t('la-vaca-story-5')}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button className={`w-full font-bold py-3 rounded-lg transition-colors shadow-lg font-pixel ${styles.button}`}>
                    {t('Inquire')}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(false);
                    }}
                    className="w-full text-white/70 hover:text-white text-sm transition-colors"
                  >
                    ← {t('Back to image') || 'Zurück zum Bild'}
                  </button>
                </div>
              </div>
            )}
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
