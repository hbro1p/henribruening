
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Folder, ArrowLeft, RefreshCw } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useStorageImages } from '@/hooks/useStorageImages';
import { useSettings } from '@/contexts/SettingsContext';

// Fallback images for when storage is empty
const fallbackImages = {
  childhood: [
    '/lovable-uploads/0b9567c9-f15e-4950-9188-94a62078629d.png',
    '/lovable-uploads/0321fd14-b0f2-474f-8227-bb3c92cfbbb4.png',
    '/lovable-uploads/11426e6a-a4c2-4c7f-b77a-39f003d387a0.png',
    '/lovable-uploads/e378b9f1-3788-4f80-8440-9f7aa812f996.png',
    '/lovable-uploads/3943ad97-e99e-45b6-863a-12464d45fa16.png',
    '/lovable-uploads/f4585003-208e-4956-afe1-9ecc43e1f6e8.png',
    '/lovable-uploads/68f734f2-f15f-4e8e-99ca-8a31a9e80f11.png',
    '/lovable-uploads/95043074-e8f9-429d-bdb3-512cce121583.png',
    '/lovable-uploads/bddcd903-c8b2-4227-ae73-e02ef74677e8.png',
    '/lovable-uploads/6ec47f29-1fb9-49bb-8516-e14f19cf4543.png',
  ],
  nature: [],
  vibe: [],
  random: []
};

const getFolderTheme = (category: string, theme: string) => {
  const themes = {
    childhood: 'folder-blue',
    nature: 'folder-green', 
    vibe: 'folder-purple',
    random: 'folder-orange'
  };
  
  return themes[category as keyof typeof themes] || '';
};

const getFolderColors = (category: string, theme: string) => {
  if (theme === 'space-mood') {
    const colors = {
      childhood: {
        gradient: 'from-blue-400 via-blue-500 to-blue-700',
        icon: 'text-blue-800',
        badge: 'bg-blue-600'
      },
      nature: {
        gradient: 'from-green-400 via-green-500 to-green-700',
        icon: 'text-green-800',
        badge: 'bg-green-600'
      },
      vibe: {
        gradient: 'from-purple-400 via-purple-500 to-purple-700',
        icon: 'text-purple-800',
        badge: 'bg-purple-600'
      },
      random: {
        gradient: 'from-orange-400 via-orange-500 to-orange-700',
        icon: 'text-orange-800',
        badge: 'bg-orange-600'
      }
    };
    return colors[category as keyof typeof colors] || colors.childhood;
  }
  
  // Default for other themes
  return {
    gradient: 'from-gray-300 via-gray-400 to-gray-600',
    icon: 'text-gray-800',
    badge: 'bg-gray-600'
  };
};

const Pictures = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { images: storageImages, loading, error, refetch } = useStorageImages();
  const { theme } = useSettings();

  // Use storage images primarily, only fall back if storage category is completely empty
  const photoCategories = {
    childhood: storageImages.childhood.length > 0 ? storageImages.childhood : fallbackImages.childhood,
    nature: storageImages.nature.length > 0 ? storageImages.nature : fallbackImages.nature,
    vibe: storageImages.vibe.length > 0 ? storageImages.vibe : fallbackImages.vibe,
    random: storageImages.random.length > 0 ? storageImages.random : fallbackImages.random
  };

  const getWindowStyles = () => {
    if (theme === 'space-mood') {
      return {
        windowFrame: 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
        windowContent: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400',
        text: 'text-blue-900',
        link: 'text-blue-800 hover:text-blue-900',
      };
    }
    
    if (theme === 'dark-vhs') {
      return {
        windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
        titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
        windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
        text: 'text-white',
        link: 'text-blue-400 hover:text-blue-300',
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
      titleBar: 'bg-gradient-to-r from-orange-600 via-orange-700 to-red-700',
      windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      text: 'text-black',
      link: 'text-orange-800 hover:text-orange-900',
    };
  };

  const styles = getWindowStyles();

  if (selectedCategory) {
    const photos = photoCategories[selectedCategory as keyof typeof photoCategories];
    const folderTheme = getFolderTheme(selectedCategory, theme);
    
    return (
      <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
        {/* Window Frame with 3D effect */}
        <div className={`p-2 border-2 border-black/30 w-full max-w-5xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
          {/* Title bar */}
          <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
              <span className="text-white font-pixel text-sm ml-2">Pictures.exe / {selectedCategory}</span>
            </div>
          </div>
          
          {/* Window content */}
          <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className={`text-4xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>[ My Pictures ] / {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h1>
              
              {loading ? (
                <p className={`mb-8 font-pixel drop-shadow-sm ${styles.text}`}>Loading images...</p>
              ) : error ? (
                <div className="text-center mb-8">
                  <p className="text-red-600 mb-4 font-pixel drop-shadow-sm">Error loading images: {error}</p>
                  <button
                    onClick={refetch}
                    className={`text-sm underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm mx-auto ${styles.link}`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              ) : photos.length > 0 ? (
                <>
                  <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl">
                    <Carousel className="w-full" opts={{ loop: true }}>
                      <CarouselContent>
                        {photos.map((src, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card className="border-2 border-black/30 bg-gradient-to-br from-gray-800 to-black overflow-hidden shadow-2xl rounded-lg">
                                <CardContent className="flex aspect-[4/3] items-center justify-center p-2">
                                  <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-2 rounded border border-black/20 shadow-inner">
                                    <img 
                                      src={src} 
                                      alt={`${selectedCategory} memory ${index + 1}`} 
                                      className="max-h-full max-w-full object-contain rounded"
                                      onError={(e) => {
                                        console.error('Image failed to load:', src);
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                              <p className={`mt-2 text-sm font-pixel drop-shadow-sm ${styles.text}`}>Memory #{index + 1}</p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="text-white bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 border-2 border-black/30 shadow-lg" />
                      <CarouselNext className="text-white bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 border-2 border-black/30 shadow-lg" />
                    </Carousel>
                  </div>
                </>
              ) : (
                <p className={`mb-8 font-pixel drop-shadow-sm ${styles.text}`}>No photos in this category yet.</p>
              )}

              <button
                onClick={() => setSelectedCategory(null)}
                className={`mt-8 text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Folders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 sm:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
      {/* Window Frame with 3D effect */}
      <div className={`p-2 border-2 border-black/30 w-full max-w-5xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Pictures.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ My Pictures ]</h1>
            <p className={`mb-4 font-pixel drop-shadow-sm ${styles.text}`}>Choose a folder to explore.</p>
            
            {loading && (
              <p className={`mb-4 text-sm font-pixel ${styles.text}`}>Loading images from storage...</p>
            )}
            
            {error && (
              <div className="mb-4 text-center">
                <p className="text-red-600 text-sm font-pixel mb-2">Storage error: {error}</p>
                <button
                  onClick={refetch}
                  className={`text-xs underline transition-colors flex items-center gap-1 font-pixel mx-auto ${styles.link}`}
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 mb-8">
              {Object.keys(photoCategories).map((category) => {
                const imageCount = photoCategories[category as keyof typeof photoCategories].length;
                const isFromStorage = storageImages[category as keyof typeof storageImages].length > 0;
                const folderColors = getFolderColors(category, theme);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="flex flex-col items-center justify-center space-y-4 w-40 h-40 p-6 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {/* Enhanced folder icon with 3D effect and proper colors */}
                    <div className="relative">
                      <div className={`w-20 h-20 bg-gradient-to-br ${folderColors.gradient} rounded-lg border-2 border-black/20 shadow-xl flex items-center justify-center relative`}>
                        {/* Highlight effect */}
                        <div className="absolute top-1 left-1 w-12 h-8 bg-gradient-to-br from-white/40 to-transparent rounded blur-sm"></div>
                        
                        {/* Folder icon */}
                        <Folder className={`w-12 h-12 ${folderColors.icon} drop-shadow-lg relative z-10`} />
                        
                        {/* Count badge - only show for storage images */}
                        {imageCount > 0 && isFromStorage && (
                          <div className={`absolute -top-2 -right-2 w-6 h-6 ${folderColors.badge} text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white shadow-lg`}>
                            {imageCount}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`text-lg capitalize font-bold font-pixel drop-shadow-sm ${styles.text}`}>{category}</span>
                  </button>
                );
              })}
            </div>

            <Link to="/desktop" className={`text-xl underline transition-colors font-pixel drop-shadow-sm ${styles.link}`}>
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
