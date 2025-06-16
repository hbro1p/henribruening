
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Folder, ArrowLeft } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const photoCategories = {
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

const Pictures = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (selectedCategory) {
    const photos = photoCategories[selectedCategory as keyof typeof photoCategories];
    
    return (
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
        {/* Window Frame with 3D effect */}
        <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-2 border-2 border-black/30 w-full max-w-5xl shadow-2xl rounded-lg">
          {/* Title bar */}
          <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 p-2 rounded-t border-b-2 border-black/20 shadow-inner">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
              <span className="text-white font-pixel text-sm ml-2">Pictures.exe / {selectedCategory}</span>
            </div>
          </div>
          
          {/* Window content */}
          <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl mb-4 text-black font-pixel drop-shadow-lg">[ My Pictures ] / {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h1>
              
              {photos.length > 0 ? (
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
                                    <img src={src} alt={`${selectedCategory} memory ${index + 1}`} className="max-h-full max-w-full object-contain rounded" />
                                  </div>
                                </CardContent>
                              </Card>
                              <p className="text-black mt-2 text-sm font-pixel drop-shadow-sm">Memory #{index + 1}</p>
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
                <p className="text-black mb-8 font-pixel drop-shadow-sm">No photos in this category yet.</p>
              )}

              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-8 text-xl underline text-orange-800 hover:text-orange-900 transition-colors flex items-center gap-2 font-pixel drop-shadow-sm"
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
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame with 3D effect */}
      <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-2 border-2 border-black/30 w-full max-w-5xl shadow-2xl rounded-lg">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 p-2 rounded-t border-b-2 border-black/20 shadow-inner">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Pictures.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl mb-8 text-black font-pixel drop-shadow-lg">[ My Pictures ]</h1>
            <p className="mb-8 text-black font-pixel drop-shadow-sm">Choose a folder to explore.</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {Object.keys(photoCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex flex-col items-center justify-center space-y-3 w-32 h-32 p-4 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-black/30 hover:from-gray-200 hover:via-gray-300 hover:to-gray-500 active:scale-95 transition-all rounded-lg shadow-lg"
                >
                  {/* Folder icon with 3D effect */}
                  <div className="relative">
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                    <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/20 to-transparent rounded"></div>
                    <Folder className="w-12 h-12 text-gray-800 drop-shadow-lg relative z-10" />
                  </div>
                  <span className="text-sm text-black capitalize font-bold font-pixel drop-shadow-sm">{category}</span>
                </button>
              ))}
            </div>

            <Link to="/desktop" className="text-xl underline text-orange-800 hover:text-orange-900 transition-colors font-pixel drop-shadow-sm">
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
