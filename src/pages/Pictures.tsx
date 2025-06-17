
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useStorageImages } from '@/hooks/useStorageImages';
import { useSettings } from '@/contexts/SettingsContext';

const Pictures = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { images, loading, error } = useStorageImages();
  const { theme } = useSettings();

  const handleImageNavigation = (direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      setCurrentImageIndex(direction);
    } else {
      setCurrentImageIndex(prev => {
        if (direction === 'prev') {
          return prev > 0 ? prev - 1 : images.length - 1;
        } else {
          return prev < images.length - 1 ? prev + 1 : 0;
        }
      });
    }
  };

  // Get window styles based on theme
  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600',
        titleBar: 'bg-gradient-to-r from-yellow-600 via-orange-700 to-red-700',
        windowContent: 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400',
        text: 'text-yellow-900',
        link: 'text-yellow-800 hover:text-yellow-900',
        controlButton: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-600 text-yellow-900 border-yellow-600/50',
        thumbButton: 'border-yellow-600/30 hover:border-yellow-700 hover:bg-yellow-100/50',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        link: 'text-orange-400 hover:text-orange-300',
        controlButton: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 text-white border-white/30',
        thumbButton: 'border-white/20 hover:border-white/40 hover:bg-white/10',
      };
    }
    
    if (theme === 'retro-chrome') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
        controlButton: 'bg-gradient-to-br from-slate-500 via-blue-600 to-slate-700 hover:from-slate-400 hover:via-blue-500 hover:to-slate-600 text-white border-blue-300/30',
        thumbButton: 'border-blue-400/30 hover:border-blue-500/50 hover:bg-blue-500/20',
      };
    }
    
    return {
      windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
      titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-blue-800 hover:text-blue-900',
      controlButton: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white border-black/30',
      thumbButton: 'border-gray-400/50 hover:border-gray-600 hover:bg-gray-100/50',
    };
  };

  const styles = getWindowStyles();

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-yellow' : ''}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-6xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
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
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ Pictures ]</h1>
            
            {loading && (
              <div className={`p-8 ${styles.text} font-pixel`}>Loading pictures...</div>
            )}
            
            {error && (
              <div className="p-8 text-red-600 font-pixel">{error}</div>
            )}
            
            {!loading && !error && images.length === 0 && (
              <div className={`p-8 ${styles.text} font-pixel`}>No pictures found</div>
            )}
            
            {!loading && !error && images.length > 0 && (
              <div className="w-full max-w-4xl">
                <div className="mb-6 border-2 border-black/30 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={images[currentImageIndex]?.url} 
                    alt={images[currentImageIndex]?.name}
                    className="w-full h-96 object-contain bg-gray-100"
                  />
                </div>
                
                <div className="flex gap-4 justify-center mb-6">
                  <button 
                    onClick={() => handleImageNavigation('prev')}
                    className={`px-6 py-3 border-2 rounded-lg font-pixel transition-all active:scale-95 ${styles.controlButton}`}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => handleImageNavigation('next')}
                    className={`px-6 py-3 border-2 rounded-lg font-pixel transition-all active:scale-95 ${styles.controlButton}`}
                  >
                    Next
                  </button>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6">
                  {images.map((image, index) => (
                    <button
                      key={image.name}
                      onClick={() => handleImageNavigation(index)}
                      className={`
                        aspect-square border-2 rounded overflow-hidden transition-all hover:scale-105
                        ${currentImageIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                        ${styles.thumbButton}
                      `}
                    >
                      <img 
                        src={image.url} 
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                
                <div className={`text-center ${styles.text} font-pixel`}>
                  {currentImageIndex + 1} / {images.length} - {images[currentImageIndex]?.name}
                </div>
              </div>
            )}

            <Link to="/desktop" className={`mt-8 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}>
              <ArrowLeft className="w-5 h-5" />
              Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
