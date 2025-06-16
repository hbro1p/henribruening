
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

const getFolderColors = (theme: string) => {
  // Consistent folder colors for all themes - always blue for Pictures
  return {
    gradient: 'from-blue-400 via-blue-500 to-blue-700',
    icon: 'text-blue-800',
    badge: 'bg-blue-600'
  };
};

const Pictures = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { images: storageImages, loading, error, refetch } = useStorageImages();
  const { theme, t } = useSettings();

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
    const categoryTranslations = {
      childhood: 'Kindheit',
      nature: 'Natur',
      vibe: 'Stimmung',
      random: 'Zufällig'
    };
    
    return (
      <div className={`flex items-center justify-center min-h-screen p-2 sm:p-4 md:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
        {/* Fixed window dimensions to prevent layout shift */}
        <div className={`p-2 border-2 border-black/30 w-full max-w-[95vw] sm:max-w-4xl lg:max-w-5xl h-[90vh] sm:h-[85vh] md:h-[700px] shadow-2xl rounded-lg ${styles.windowFrame}`}>
          {/* Title bar */}
          <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
              <span className="text-white font-pixel text-xs sm:text-sm ml-2">Pictures.exe / {selectedCategory}</span>
            </div>
          </div>
          
          {/* Window content with fixed dimensions */}
          <div className={`p-3 sm:p-6 md:p-8 border-2 border-white/20 shadow-inner rounded-b flex flex-col h-[calc(100%-52px)] ${styles.windowContent}`}>
            <div className="flex flex-col items-center text-center h-full">
              <h1 className={`text-xl sm:text-2xl md:text-4xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>
                [ {t('My Pictures')} ] / {t('language') === 'deutsch' ? categoryTranslations[selectedCategory as keyof typeof categoryTranslations] : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h1>
              
              {loading ? (
                <p className={`mb-4 sm:mb-8 font-pixel drop-shadow-sm text-sm sm:text-base ${styles.text}`}>{t('language') === 'deutsch' ? 'Bilder werden geladen...' : 'Loading images...'}</p>
              ) : error ? (
                <div className="text-center mb-4 sm:mb-8">
                  <p className="text-red-600 mb-4 font-pixel drop-shadow-sm text-sm sm:text-base">{t('language') === 'deutsch' ? 'Fehler beim Laden der Bilder: ' : 'Error loading images: '}{error}</p>
                  <button
                    onClick={refetch}
                    className={`text-sm underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm mx-auto ${styles.link}`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t('language') === 'deutsch' ? 'Erneut versuchen' : 'Retry'}
                  </button>
                </div>
              ) : photos.length > 0 ? (
                <div className="flex-1 flex items-center justify-center w-full">
                  <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl">
                    <Carousel 
                      className="w-full" 
                      opts={{ 
                        loop: true,
                        dragFree: true,
                        containScroll: "trimSnaps"
                      }}
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {photos.map((src, index) => (
                          <CarouselItem key={index} className="pl-2 md:pl-4">
                            <div className="p-1">
                              <Card className="border-2 border-black/30 bg-gradient-to-br from-gray-800 to-black overflow-hidden shadow-2xl rounded-lg">
                                <CardContent className="flex aspect-[4/3] items-center justify-center p-2">
                                  <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-2 rounded border border-black/20 shadow-inner h-full w-full flex items-center justify-center">
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
                              <p className={`mt-2 text-xs sm:text-sm font-pixel drop-shadow-sm text-center ${styles.text}`}>
                                {t('language') === 'deutsch' ? 'Erinnerung' : 'Memory'} #{index + 1}
                              </p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="text-white bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 border-2 border-black/30 shadow-lg -left-8 sm:-left-12" />
                      <CarouselNext className="text-white bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 border-2 border-black/30 shadow-lg -right-8 sm:-right-12" />
                    </Carousel>
                  </div>
                </div>
              ) : (
                <p className={`mb-4 sm:mb-8 font-pixel drop-shadow-sm text-sm sm:text-base ${styles.text}`}>
                  {t('language') === 'deutsch' ? 'Noch keine Fotos in dieser Kategorie.' : 'No photos in this category yet.'}
                </p>
              )}

              <button
                onClick={() => setSelectedCategory(null)}
                className={`mt-4 sm:mt-8 text-base sm:text-xl underline transition-colors flex items-center gap-2 font-pixel drop-shadow-sm ${styles.link}`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('language') === 'deutsch' ? 'Zurück zu Ordnern' : 'Back to Folders'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-screen p-2 sm:p-4 md:p-8 ${theme === 'space-mood' ? 'folder-blue' : ''}`}>
      {/* Fixed window with consistent dimensions - no layout shift */}
      <div className={`p-2 border-2 border-black/30 w-full max-w-[95vw] sm:max-w-4xl lg:max-w-5xl h-[90vh] sm:h-[85vh] md:h-[700px] shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-xs sm:text-sm ml-2">Pictures.exe</span>
          </div>
        </div>
        
        {/* Window content with fixed height and stable layout */}
        <div className={`border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`} style={{ height: 'calc(100% - 52px)' }}>
          {/* Fixed header section - always same height */}
          <div className="px-3 sm:px-6 md:px-8 pt-3 sm:pt-6 md:pt-8 pb-4 text-center">
            <h1 className={`text-xl sm:text-2xl md:text-4xl mb-4 font-pixel drop-shadow-lg ${styles.text}`}>[ {t('My Pictures')} ]</h1>
            <p className={`mb-2 font-pixel drop-shadow-sm text-sm sm:text-base ${styles.text}`}>
              {t('language') === 'deutsch' ? 'Wählen Sie einen Ordner zum Erkunden.' : 'Choose a folder to explore.'}
            </p>
            
            {/* Fixed height status area to prevent shifts */}
            <div className="h-8 flex items-center justify-center">
              {loading && (
                <p className={`text-xs sm:text-sm font-pixel ${styles.text}`}>
                  {t('language') === 'deutsch' ? 'Lade Bilder aus dem Speicher...' : 'Loading images from storage...'}
                </p>
              )}
              
              {error && (
                <div className="text-center">
                  <p className="text-red-600 text-xs sm:text-sm font-pixel mb-2">
                    {t('language') === 'deutsch' ? 'Speicherfehler: ' : 'Storage error: '}{error}
                  </p>
                  <button
                    onClick={refetch}
                    className={`text-xs underline transition-colors flex items-center gap-1 font-pixel mx-auto ${styles.link}`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    {t('language') === 'deutsch' ? 'Aktualisieren' : 'Refresh'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fixed center area for folders - stable positioning */}
          <div className="relative px-3 sm:px-6 md:px-8" style={{ height: 'calc(100% - 200px)' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
                {Object.keys(photoCategories).map((category) => {
                  const folderColors = getFolderColors(theme);
                  const categoryTranslations = {
                    childhood: 'Kindheit',
                    nature: 'Natur',
                    vibe: 'Stimmung',
                    random: 'Zufällig'
                  };
                  
                  return (
                    <div key={category} className="flex flex-col items-center justify-center">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 p-2 sm:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {/* Consistent folder icon sizing across devices */}
                        <div className="relative">
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br ${folderColors.gradient} rounded-lg border-2 border-black/20 shadow-xl flex items-center justify-center relative`}>
                            {/* Highlight effect */}
                            <div className="absolute top-1 left-1 w-6 h-3 sm:w-8 sm:h-4 md:w-10 md:h-5 lg:w-12 lg:h-6 bg-gradient-to-br from-white/40 to-transparent rounded blur-sm"></div>
                            
                            {/* Folder icon */}
                            <Folder className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 ${folderColors.icon} drop-shadow-lg relative z-10`} />
                          </div>
                        </div>
                        
                        {/* Folder label */}
                        <span className={`text-xs sm:text-sm md:text-base capitalize font-bold font-pixel drop-shadow-sm ${styles.text} text-center w-20 sm:w-24 md:w-28 lg:w-32`}>
                          {t('language') === 'deutsch' ? categoryTranslations[category as keyof typeof categoryTranslations] : category}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed footer */}
          <div className="px-3 sm:px-6 md:px-8 pb-3 sm:pb-6 md:pb-8 text-center">
            <Link to="/desktop" className={`text-base sm:text-xl underline transition-colors font-pixel drop-shadow-sm ${styles.link}`}>
              &lt;- {t('Back to Desktop')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
