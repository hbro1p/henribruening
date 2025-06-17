
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useStorageImages } from '@/hooks/useStorageImages';

const Pictures = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme, t } = useSettings();
  const { images, loading, error } = useStorageImages();

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const getFolderTheme = () => {
    if (theme === 'space-mood') {
      return 'folder-blue';
    }
    return '';
  };

  const getWindowStyles = () => {
    const folderTheme = getFolderTheme();
    
    if (theme === 'space-mood' && folderTheme) {
      return {
        windowFrame: 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
        windowContent: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400',
        text: 'text-blue-900',
        button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
        input: 'bg-blue-50 border-blue-600 text-blue-900',
        link: 'text-blue-800 hover:text-blue-900',
        cardBg: 'bg-blue-50 border-blue-600',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
        input: 'bg-gray-800 border-white/30 text-white',
        link: 'text-blue-400 hover:text-blue-300',
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
    
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
      input: 'bg-white border-black text-black',
      link: 'text-blue-800 hover:text-blue-900',
      cardBg: 'bg-white border-black',
    };
  };

  const styles = getWindowStyles();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${getFolderTheme()}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Pictures.exe</span>
          </div>
        </div>
        
        <div className={`p-4 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('Pictures')} ]</h1>
            
            {loading && (
              <div className="text-center">
                <p className={`font-pixel ${styles.text}`}>{t('Loading pictures...')}</p>
              </div>
            )}

            {error && (
              <div className="text-center">
                <p className={`font-pixel text-red-600`}>{t('Error loading pictures')}: {error}</p>
              </div>
            )}

            {!loading && !error && images.length === 0 && (
              <div className="text-center">
                <p className={`font-pixel ${styles.text}`}>{t('No pictures found.')}</p>
              </div>
            )}

            {!loading && !error && images.length > 0 && (
              <div className="w-full max-w-3xl">
                <div className="relative mb-6">
                  <img
                    src={images[currentImageIndex]?.url || ''}
                    alt={images[currentImageIndex]?.name || 'Picture'}
                    className="w-full h-96 object-contain rounded border border-gray-400 bg-black"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded ${styles.button} opacity-80 hover:opacity-100`}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded ${styles.button} opacity-80 hover:opacity-100`}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="text-center mb-4">
                  <h3 className={`text-xl font-pixel ${styles.text}`}>
                    {images[currentImageIndex]?.name?.replace(/\.[^/.]+$/, "") || 'Untitled'}
                  </h3>
                  {images.length > 1 && (
                    <p className={`text-sm font-pixel ${styles.text} opacity-70`}>
                      {currentImageIndex + 1} / {images.length}
                    </p>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="flex justify-center space-x-2 mb-6">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                          index === currentImageIndex 
                            ? `${styles.button.split(' ')[0]} border-white` 
                            : `bg-gray-400 border-gray-600 hover:bg-gray-300`
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

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

export default Pictures;
