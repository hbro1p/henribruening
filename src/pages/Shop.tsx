import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const { t } = useSettings();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-7xl bg-gradient-to-br from-yellow-900/30 via-amber-900/30 to-orange-900/30 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] overflow-hidden">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm p-4 flex items-center justify-between border-b border-yellow-500/20">
          <button
            onClick={() => navigate('/desktop')}
            className="flex items-center gap-2 text-yellow-200 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{t('Back to Desktop')}</span>
          </button>
          <h1 className="text-2xl font-bold text-yellow-400">{t('Shop')}</h1>
          <div className="w-32"></div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-12 flex items-center justify-center min-h-[600px]">
          <div style={{ perspective: '1500px' }}>
            <div
              onClick={handleFlip}
              style={{
                width: '700px',
                height: '520px',
                maxWidth: '90vw',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                cursor: 'pointer',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              {/* Front Side - Image */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="relative w-full h-full bg-gradient-to-br from-green-700 to-green-800 rounded-xl border-[16px] border-green-600 shadow-2xl hover:shadow-[0_0_60px_rgba(234,179,8,0.8)] transition-shadow duration-300">
                  <img
                    src="/lovable-uploads/la-vaca-painting.jpg"
                    alt="La Vaca - Eine Kuh auf einem Baumstamm"
                    className="w-full h-full object-contain rounded p-2"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 text-white bg-black/40 backdrop-blur-sm py-2 text-sm font-medium">
                    <RotateCw className="w-4 h-4" />
                    <span>{t('Click to flip')}</span>
                  </div>
                </div>
              </div>

              {/* Back Side - Story */}
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
                <div className="w-full h-full bg-gradient-to-br from-green-700 to-green-800 rounded-xl border-[16px] border-green-600 shadow-2xl p-8 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-4xl font-bold text-yellow-300 mb-6 text-center">
                      {t('La Vaca')} 🐄
                    </h2>
                    <div className="text-white text-base leading-relaxed space-y-4">
                      <p>{t('la-vaca-story-1')}</p>
                      <p>{t('la-vaca-story-2')}</p>
                      <p>{t('la-vaca-story-3')}</p>
                      <p>{t('la-vaca-story-4')}</p>
                      <p className="font-semibold text-yellow-200">{t('la-vaca-story-5')}</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold py-4 rounded-lg transition-colors shadow-lg">
                      {t('Inquire')}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
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
