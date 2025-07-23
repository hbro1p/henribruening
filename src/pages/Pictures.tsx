import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useStorageImages } from '@/hooks/useStorageImages';
import { useSettings } from '@/contexts/SettingsContext';

const Pictures = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Reset image index when category changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedCategory]);

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
      vibe: {
        primary: 'from-purple-400 via-purple-500 to-purple-700',
        secondary: 'from-purple-600 via-purple-700 to-purple-800',
        content: 'from-purple-100 via-purple-200 to-purple-300',
        text: 'text-purple-900',
        link: 'text-purple-800 hover:text-purple-900',
        button: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 hover:from-purple-400 hover:via-purple-500 hover:to-purple-700 text-white border-purple-300/50',
        thumb: 'border-purple-400/50 hover:border-purple-600 hover:bg-purple-100/50',
        container: 'border-purple-400/50 bg-white/90',
        folder: 'folder-purple'
      },
      random: {
        primary: 'from-orange-400 via-orange-500 to-orange-700',
        secondary: 'from-orange-600 via-orange-700 to-orange-800',
        content: 'from-orange-100 via-orange-200 to-orange-300',
        text: 'text-orange-900',
        link: 'text-orange-800 hover:text-orange-900',
        button: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 hover:from-orange-400 hover:via-orange-500 hover:to-orange-700 text-white border-orange-300/50',
        thumb: 'border-orange-400/50 hover:border-orange-600 hover:bg-orange-100/50',
        container: 'border-orange-400/50 bg-white/90',
        folder: 'folder-orange'
      }
    };

    return colorSchemes[category as keyof typeof colorSchemes] || colorSchemes.random;
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
    
    
    if (theme === 'adventure-canyon') {
      return {
        windowFrame: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700',
        titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800',
        windowContent: 'bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300',
        text: 'text-orange-900',
        link: 'text-orange-800 hover:text-orange-900',
        controlButton: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 hover:from-orange-400 hover:via-orange-500 hover:to-orange-700 text-white border-orange-300/50',
        thumbButton: 'border-orange-400/50 hover:border-orange-500/50 hover:bg-orange-100/50',
        categoryButton: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 hover:from-orange-400 hover:via-orange-500 hover:to-orange-700 text-white border-orange-300/50',
        imageContainer: 'border-orange-400/50 bg-white/90',
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

  // Get folder background class
  const getFolderBackground = () => {
    if (selectedCategory) {
      return getCategoryColors(selectedCategory).folder;
    }
    return theme === 'adventure-canyon' ? 'folder-orange' : (theme === 'space-mood' ? 'folder-blue' : '');
  };

  return (
    <div className={`min-h-screen p-4 ${getFolderBackground()}`}>
      <div className={`max-w-6xl mx-auto ${styles.windowFrame} rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden`}>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="text-center space-y-8">
            <h1 className={`text-3xl font-bold ${styles.text}`}>
              {t('My Pictures')}
            </h1>
            
            {/* Category Selection - Always visible */}
            <div className="flex flex-wrap gap-4 mb-8">
              {Object.keys(images).map((category) => {
                const categoryColors = getCategoryColors(category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-6 py-4 border-3 rounded-2xl font-pixel transition-all active:scale-95 capitalize text-lg shadow-xl
                      bg-gradient-to-br ${categoryColors.primary}
                      hover:shadow-2xl hover:scale-105 text-white border-white/30
                      ${selectedCategory === category ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent scale-110' : ''}
                    `}
                  >
                    📁 {category}
                    <div className="text-sm opacity-90">({images[category].length} photos)</div>
                  </button>
                );
              })}
            </div>

            {/* Back to folder selection button when category is selected */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className={`mb-6 px-4 py-2 border-2 rounded-lg font-pixel transition-all active:scale-95 ${styles.controlButton}`}
              >
                ← Back to Folders
              </button>
            )}
            
            {/* Fixed height container to prevent movement */}
            <div className="min-h-[100px] w-full flex flex-col items-center justify-center">
              {loading && (
                <div className={`${styles.text} font-pixel text-center`}>Loading pictures...</div>
              )}
              
              {error && (
                <div className="text-red-600 font-pixel text-center">{error}</div>
              )}
              
              {!loading && !error && selectedCategory && imageObjects.length === 0 && (
                <div className={`${styles.text} font-pixel text-center`}>No pictures found in {selectedCategory}</div>
              )}
            </div>
            
            {!loading && !error && selectedCategory && imageObjects.length > 0 && (
              <div className="w-full max-w-4xl">
                <div className={`mb-6 border-4 rounded-xl overflow-hidden shadow-2xl ${styles.imageContainer}`}>
                  <img 
                    src={imageObjects[currentImageIndex]?.url} 
                    alt={imageObjects[currentImageIndex]?.name}
                    className="w-full h-96 object-contain bg-gradient-to-br from-white via-gray-50 to-gray-100"
                  />
                </div>
                
                <div className="flex gap-4 justify-center mb-6">
                  <button 
                    onClick={() => handleImageNavigation('prev')}
                    className={`px-6 py-3 border-2 rounded-lg font-pixel transition-all active:scale-95 shadow-lg ${styles.controlButton}`}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => handleImageNavigation('next')}
                    className={`px-6 py-3 border-2 rounded-lg font-pixel transition-all active:scale-95 shadow-lg ${styles.controlButton}`}
                  >
                    Next
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
                      />
                    </button>
                  ))}
                </div>
                
                <div className={`text-center ${styles.text} font-pixel text-lg`}>
                  {currentImageIndex + 1} / {imageObjects.length} - {imageObjects[currentImageIndex]?.name}
                </div>
              </div>
            )}
            
            {/* Back Button */}
            <Link to="/desktop" className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${styles.controlButton}`}>
              <ArrowLeft className="w-4 h-4" />
              {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
