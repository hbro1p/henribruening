import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Maximize, Play, Pause, X } from 'lucide-react';
import { useStorageImages } from '@/hooks/useStorageImages';
import { useSettings } from '@/contexts/SettingsContext';
import { Skeleton } from '@/components/ui/skeleton';

const Pictures = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imagesLoading, setImagesLoading] = useState<Record<number, boolean>>({});
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const { images, loading, error } = useStorageImages();
  const { theme, t } = useSettings();

  // Get all images from selected category
  const currentCategoryImages = selectedCategory ? images[selectedCategory] || [] : [];
  
  // Create image objects with url and name for compatibility
  const imageObjects = currentCategoryImages.map((url, index) => ({
    url,
    name: `${selectedCategory}-image-${index + 1}.jpg`
  }));

  const handleImageNavigation = (direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      setCurrentImageIndex(direction);
    } else {
      setCurrentImageIndex(prev => {
        if (direction === 'prev') {
          return prev > 0 ? prev - 1 : currentCategoryImages.length - 1;
        } else {
          return prev < currentCategoryImages.length - 1 ? prev + 1 : 0;
        }
      });
    }
  };

  // Preload all images for smooth transitions
  useEffect(() => {
    if (!selectedCategory || currentCategoryImages.length === 0) return;
    
    setCategoryLoading(true);
    setCurrentImageIndex(0);
    
    // Preload ALL images in the category for smooth navigation
    const preloadPromises = currentCategoryImages.map((url) => {
      return new Promise<void>((resolve) => {
        if (preloadedImages.has(url)) {
          resolve();
          return;
        }
        
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set(prev).add(url));
          resolve();
        };
        img.onerror = () => resolve();
        img.src = url;
      });
    });
    
    Promise.all(preloadPromises).then(() => {
      setCategoryLoading(false);
    });
  }, [selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedCategory || currentCategoryImages.length === 0) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handleImageNavigation('prev');
          break;
        case 'ArrowRight':
          handleImageNavigation('next');
          break;
        case 'f':
        case 'F':
          setIsFullscreen(prev => !prev);
          break;
        case 'Escape':
          setIsFullscreen(false);
          setIsPlaying(false);
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCategory, currentCategoryImages.length]);

  // Slideshow auto-play
  useEffect(() => {
    if (!isPlaying || currentCategoryImages.length === 0) return;
    
    const interval = setInterval(() => {
      handleImageNavigation('next');
    }, 3000); // 3 seconds per image

    return () => clearInterval(interval);
  }, [isPlaying, currentImageIndex, currentCategoryImages.length]);

  // Category color schemes
  const getCategoryColors = (category: string) => {
    const colorSchemes = {
      childhood: {
        primary: 'from-pink-400 via-pink-500 to-pink-700',
        secondary: 'from-pink-600 via-pink-700 to-pink-800',
        content: 'from-pink-100 via-pink-200 to-pink-300',
        text: 'text-pink-900',
        link: 'text-pink-800 hover:text-pink-900',
        button: 'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800 hover:from-pink-400 hover:via-pink-500 hover:to-pink-700 text-white border-pink-300/50',
        thumb: 'border-pink-400/50 hover:border-pink-600 hover:bg-pink-100/50',
        container: 'border-pink-400/50 bg-white/90',
        folder: 'folder-pink'
      },
      nature: {
        primary: 'from-green-400 via-green-500 to-green-700',
        secondary: 'from-green-600 via-green-700 to-green-800',
        content: 'from-green-100 via-green-200 to-green-300',
        text: 'text-green-900',
        link: 'text-green-800 hover:text-green-900',
        button: 'bg-gradient-to-br from-green-500 via-green-600 to-green-800 hover:from-green-400 hover:via-green-500 hover:to-green-700 text-white border-green-300/50',
        thumb: 'border-green-400/50 hover:border-green-600 hover:bg-green-100/50',
        container: 'border-green-400/50 bg-white/90',
        folder: 'folder-green'
      },
      travel: {
        primary: 'from-cyan-400 via-cyan-500 to-cyan-700',
        secondary: 'from-cyan-600 via-cyan-700 to-cyan-800',
        content: 'from-cyan-100 via-cyan-200 to-cyan-300',
        text: 'text-cyan-900',
        link: 'text-cyan-800 hover:text-cyan-900',
        button: 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-800 hover:from-cyan-400 hover:via-cyan-500 hover:to-cyan-700 text-white border-cyan-300/50',
        thumb: 'border-cyan-400/50 hover:border-cyan-600 hover:bg-cyan-100/50',
        container: 'border-cyan-400/50 bg-white/90',
        folder: 'folder-cyan'
      },
      Travel: {
        primary: 'from-cyan-400 via-cyan-500 to-cyan-700',
        secondary: 'from-cyan-600 via-cyan-700 to-cyan-800',
        content: 'from-cyan-100 via-cyan-200 to-cyan-300',
        text: 'text-cyan-900',
        link: 'text-cyan-800 hover:text-cyan-900',
        button: 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-800 hover:from-cyan-400 hover:via-cyan-500 hover:to-cyan-700 text-white border-cyan-300/50',
        thumb: 'border-cyan-400/50 hover:border-cyan-600 hover:bg-cyan-100/50',
        container: 'border-cyan-400/50 bg-white/90',
        folder: 'folder-cyan'
      }
    };

    return colorSchemes[category as keyof typeof colorSchemes] || colorSchemes.childhood;
  };

  // Get window styles based on theme and selected category
  const getWindowStyles = () => {
    // If a category is selected, use its color scheme
    if (selectedCategory) {
      const categoryColors = getCategoryColors(selectedCategory);
      return {
        windowFrame: `bg-gradient-to-br ${categoryColors.primary}`,
        titleBar: `bg-gradient-to-r ${categoryColors.secondary}`,
        windowContent: `bg-gradient-to-br ${categoryColors.content}`,
        text: categoryColors.text,
        link: categoryColors.link,
        controlButton: categoryColors.button,
        thumbButton: categoryColors.thumb,
        categoryButton: categoryColors.button,
        imageContainer: categoryColors.container,
      };
    }

    // Default theme-based styles when no category is selected
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
        windowContent: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300',
        text: 'text-blue-900',
        link: 'text-blue-800 hover:text-blue-900',
        controlButton: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white border-blue-300/50',
        thumbButton: 'border-blue-400/50 hover:border-blue-600 hover:bg-blue-100/50',
        categoryButton: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white border-blue-300/50',
        imageContainer: 'border-blue-400/50 bg-white/90',
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
        categoryButton: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 text-white border-white/30',
        imageContainer: 'border-white/30 bg-gray-900/50',
      };
    }
    
    if (theme === 'adventure-canyon') {
      return {
        windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
        windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
        text: 'text-blue-200',
        link: 'text-blue-300 hover:text-blue-200',
        controlButton: 'bg-gradient-to-br from-slate-500 via-blue-600 to-slate-700 hover:from-slate-400 hover:via-blue-500 hover:to-slate-600 text-white border-blue-300/30',
        thumbButton: 'border-blue-400/30 hover:border-blue-500/50 hover:bg-blue-500/20',
        categoryButton: 'bg-gradient-to-br from-slate-500 via-blue-600 to-slate-700 hover:from-slate-400 hover:via-blue-500 hover:to-slate-600 text-white border-blue-300/30',
        imageContainer: 'border-blue-400/30 bg-slate-900/50',
      };
    }
    
    return {
      windowFrame: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
      titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
      windowContent: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300',
      text: 'text-blue-900',
      link: 'text-blue-800 hover:text-blue-900',
      controlButton: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white border-blue-300/50',
      thumbButton: 'border-blue-400/50 hover:border-blue-600 hover:bg-blue-100/50',
      categoryButton: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white border-blue-300/50',
      imageContainer: 'border-blue-400/50 bg-white/90',
    };
  };

  const styles = getWindowStyles();

  // Fullscreen render
  if (isFullscreen && selectedCategory && imageObjects.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Close and control buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={() => {
              setIsFullscreen(false);
              setIsPlaying(false);
            }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Image with transitions */}
        <img 
          key={currentImageIndex}
          src={imageObjects[currentImageIndex]?.url} 
          alt={imageObjects[currentImageIndex]?.name}
          className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-700"
        />

        {/* Navigation arrows */}
        <button
          onClick={() => handleImageNavigation('prev')}
          className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all"
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </button>
        <button
          onClick={() => handleImageNavigation('next')}
          className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all"
        >
          <ArrowLeft className="w-8 h-8 text-white rotate-180" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
          <span className="text-white font-pixel text-sm">
            {currentImageIndex + 1} / {imageObjects.length}
          </span>
        </div>

        {/* Keyboard hints */}
        <div className="absolute bottom-4 left-4 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
          <span className="text-white/70 font-pixel text-xs">
            ← → Navigate | Space Play/Pause | ESC Exit
          </span>
        </div>
      </div>
    );
  }

  // Get folder background class
  const getFolderBackground = () => {
    if (selectedCategory) {
      return getCategoryColors(selectedCategory).folder;
    }
    return theme === 'space-mood' ? 'folder-blue' : '';
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${getFolderBackground()}`}>
      <div className={`p-2 border-2 border-black/30 w-full max-w-6xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center">
            <span className="text-white font-pixel text-sm">{t('Pictures')}</span>
          </div>
        </div>
        
        <div className={`p-4 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ PICTURES ]</h1>
            
            {/* Category Selection - Show skeletons while loading */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
                {Object.keys(images).map((category) => {
                  const categoryColors = getCategoryColors(category);
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        aspect-square flex flex-col items-center justify-center p-4 border-3 rounded-2xl font-pixel transition-all active:scale-95 capitalize text-base shadow-xl
                        bg-gradient-to-br ${categoryColors.primary}
                        hover:shadow-2xl hover:scale-105 text-white border-white/30
                        ${selectedCategory === category ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent scale-110' : ''}
                      `}
                    >
                      <div className="text-lg font-bold text-center leading-tight">{category}</div>
                      <div className="text-sm opacity-90 mt-1">({images[category].length})</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Back to folder selection button when category is selected */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className={`mb-6 px-4 py-2 border-2 rounded-lg font-pixel transition-all active:scale-95 ${styles.controlButton}`}
              >
                ← Back to Folders
              </button>
            )}
            
            {/* Show loading when switching categories */}
            {categoryLoading && selectedCategory && (
              <div className="w-full max-w-4xl mb-8">
                <Skeleton className="w-full h-96 rounded-xl mb-6" />
                <div className="flex gap-4 justify-center mb-6">
                  <Skeleton className="h-12 w-32 rounded-lg" />
                  <Skeleton className="h-12 w-32 rounded-lg" />
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Fixed height container to prevent movement */}
            {!categoryLoading && (
              <div className="min-h-[100px] w-full flex flex-col items-center justify-center">
                {error && (
                  <div className="text-red-600 font-pixel text-center">{error}</div>
                )}
                
                {!loading && !error && selectedCategory && imageObjects.length === 0 && (
                  <div className={`${styles.text} font-pixel text-center`}>No pictures found in {selectedCategory}</div>
                )}
              </div>
            )}
            
            {!categoryLoading && !error && selectedCategory && imageObjects.length > 0 && (
              <div className="w-full max-w-4xl">
                <div className={`mb-6 border-4 rounded-xl overflow-hidden shadow-2xl ${styles.imageContainer}`}>
                  {imagesLoading[currentImageIndex] ? (
                    <Skeleton className="w-full h-96" />
                  ) : (
                    <img 
                      src={imageObjects[currentImageIndex]?.url} 
                      alt={imageObjects[currentImageIndex]?.name}
                      className="w-full h-96 object-contain bg-gradient-to-br from-white via-gray-50 to-gray-100"
                      loading="lazy"
                      onLoad={() => setImagesLoading(prev => ({ ...prev, [currentImageIndex]: false }))}
                      onError={() => setImagesLoading(prev => ({ ...prev, [currentImageIndex]: false }))}
                    />
                  )}
                </div>
                
                <div className="flex gap-4 justify-center mb-6 flex-wrap">
                  <button 
                    onClick={() => handleImageNavigation('prev')}
                    className={`px-6 py-3 border-2 rounded-lg font-pixel transition-all active:scale-95 shadow-lg ${styles.controlButton}`}
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={() => setIsFullscreen(true)}
                    className={`px-6 py-3 border-2 rounded-lg font-pixel transition-all active:scale-95 shadow-lg flex items-center gap-2 ${styles.controlButton}`}
                  >
                    <Maximize className="w-4 h-4" />
                    Slideshow
                  </button>
                  <button 
                    onClick={() => handleImageNavigation('next')}
                    className={`px-6 py-3 border-2 rounded-lg font-pixel transition-all active:scale-95 shadow-lg ${styles.controlButton}`}
                  >
                    Next →
                  </button>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6">
                  {imageObjects.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageNavigation(index)}
                      className={`
                        aspect-square border-2 rounded-lg overflow-hidden transition-all hover:scale-105 shadow-md
                        ${currentImageIndex === index ? 'ring-4 ring-orange-500 ring-offset-2' : ''}
                        ${styles.thumbButton}
                      `}
                    >
                      <img 
                        src={image.url} 
                        alt={image.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
                
                <div className={`text-center ${styles.text} font-pixel text-lg`}>
                  {currentImageIndex + 1} / {imageObjects.length} - {imageObjects[currentImageIndex]?.name}
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
