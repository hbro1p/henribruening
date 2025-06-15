
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
  ],
  nature: [
    '/lovable-uploads/f4585003-208e-4956-afe1-9ecc43e1f6e8.png',
    '/lovable-uploads/68f734f2-f15f-4e8e-99ca-8a31a9e80f11.png',
    '/lovable-uploads/95043074-e8f9-429d-bdb3-512cce121583.png',
  ],
  vibe: [
    '/lovable-uploads/bddcd903-c8b2-4227-ae73-e02ef74677e8.png',
    '/lovable-uploads/6ec47f29-1fb9-49bb-8516-e14f19cf4543.png',
  ],
  random: []
};

const categoryIcons = {
  childhood: '👶',
  nature: '🌿',
  vibe: '✨',
  random: '🎲'
};

const Pictures = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (selectedCategory) {
    const photos = photoCategories[selectedCategory as keyof typeof photoCategories];
    
    return (
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
        <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-5xl shadow-2xl">
          <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-4 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl mb-4 text-black">[ My Pictures ] / {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h1>
              
              {photos.length > 0 ? (
                <>
                  <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl">
                    <Carousel className="w-full" opts={{ loop: true }}>
                      <CarouselContent>
                        {photos.map((src, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card className="border-2 border-black bg-black overflow-hidden shadow-inner">
                                <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                                  <img src={src} alt={`${selectedCategory} memory ${index + 1}`} className="max-h-full max-w-full object-contain" />
                                </CardContent>
                              </Card>
                              <p className="text-black mt-2 text-sm">Memory #{index + 1}</p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="text-white bg-black/50 hover:bg-black" />
                      <CarouselNext className="text-white bg-black/50 hover:bg-black" />
                    </Carousel>
                  </div>
                </>
              ) : (
                <p className="text-black mb-8">No photos in this category yet.</p>
              )}

              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-8 text-xl underline text-windows-blue hover:text-blue-700 transition-colors flex items-center gap-2"
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
      <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-5xl shadow-2xl">
        <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-4 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl mb-8 text-black">[ My Pictures ]</h1>
            <p className="mb-8 text-black">Choose a folder to explore.</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {Object.keys(photoCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex flex-col items-center justify-center space-y-3 w-32 h-32 p-4 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white transition-all hover:scale-105"
                >
                  <div className="text-3xl">{categoryIcons[category as keyof typeof categoryIcons]}</div>
                  <Folder className="w-8 h-8 text-black" />
                  <span className="text-sm text-black capitalize font-bold">{category}</span>
                </button>
              ))}
            </div>

            <Link to="/desktop" className="text-xl underline text-windows-blue hover:text-blue-700 transition-colors">
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
