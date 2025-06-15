
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
];

const Pictures = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl mb-4">[ My Pictures ] / Childhood</h1>
      <p className="mb-8">A collection of captured moments.</p>

      <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <Carousel className="w-full">
          <CarouselContent>
            {childhoodPhotos.map((src, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="border-2 border-white bg-black">
                    <CardContent className="flex aspect-[4/3] items-center justify-center p-2 bg-windows-gray">
                      <img src={src} alt={`Childhood memory ${index + 1}`} className="max-h-full max-w-full object-contain" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-black bg-white/80 hover:bg-white" />
          <CarouselNext className="text-black bg-white/80 hover:bg-white" />
        </Carousel>
      </div>

      <Link to="/desktop" className="mt-8 text-xl underline hover:text-windows-blue transition-colors">
        &lt;- Back to Desktop
      </Link>
    </div>
  );
};

export default Pictures;
