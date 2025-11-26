import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const { t, theme } = useSettings();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const getThemeColors = () => {
    // Shop theme: warm gold/amber tones for art/shop aesthetic
    return {
      gradient: 'from-amber-900/40 via-yellow-900/40 to-orange-900/40',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
      text: 'text-amber-100',
      accent: 'text-yellow-400',
    };
  };

  const colors = getThemeColors();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className={`w-full max-w-6xl bg-gradient-to-br ${colors.gradient} backdrop-blur-xl border ${colors.border} rounded-2xl ${colors.glow} overflow-hidden`}>
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 flex items-center justify-between border-b border-white/10">
          <button
            onClick={() => navigate('/desktop')}
            className={`flex items-center gap-2 ${colors.text} hover:${colors.accent} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{t('Back to Desktop')}</span>
          </button>
          <h1 className={`text-2xl font-bold ${colors.accent}`}>{t('Shop')}</h1>
          <div className="w-24"></div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 flex items-center justify-center min-h-[600px]">
          <div className="perspective-container" style={{ perspective: '1000px' }}>
            <div
              className={`flip-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                width: '400px',
                height: '550px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                cursor: 'pointer',
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              {/* Front Side */}
              <div
                className="flip-card-front"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className={`relative w-full h-full bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg border-8 border-amber-700 shadow-2xl hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-shadow duration-300`}>
                  <img
                    src="/lovable-uploads/la-vaca.jpg"
                    alt="La Vaca"
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 text-white/80 text-sm">
                    <RotateCw className="w-4 h-4" />
                    <span>{t('Click to flip')}</span>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div
                className="flip-card-back"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className={`w-full h-full bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg border-8 border-amber-700 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto`}>
                  <div>
                    <h2 className="text-3xl font-bold text-amber-100 mb-4 text-center">
                      {t('La Vaca')} 🐄
                    </h2>
                    <div className="text-amber-50 text-sm leading-relaxed space-y-3">
                      <p>{t('la-vaca-story-1')}</p>
                      <p>{t('la-vaca-story-2')}</p>
                      <p>{t('la-vaca-story-3')}</p>
                      <p>{t('la-vaca-story-4')}</p>
                      <p>{t('la-vaca-story-5')}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-lg transition-colors">
                      {t('Inquire')}
                    </button>
                    <div className="mt-3 flex items-center justify-center gap-2 text-white/60 text-xs">
                      <RotateCw className="w-3 h-3" />
                      <span>{t('Click to flip')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;
