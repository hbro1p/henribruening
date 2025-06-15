
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const childhoodPhotos = [
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
  '/lovable-uploads/fa680976-4829-434b-85b7-9133a0d2e836.png',
];

const Pictures = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame */}
      <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-5xl shadow-2xl">
        <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-4 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl mb-4 text-black">[ My Pictures ] / Childhood</h1>
            <p className="mb-8 text-black">A collection of captured moments.</p>

            <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {childhoodPhotos.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card className="border-2 border-black bg-black overflow-hidden shadow-inner">
                          <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                            <img src={src} alt={`Childhood memory ${index + 1}`} className="max-h-full max-w-full object-contain" />
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

            <Link to="/desktop" className="mt-8 text-xl underline text-windows-blue hover:text-blue-700 transition-colors">
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
