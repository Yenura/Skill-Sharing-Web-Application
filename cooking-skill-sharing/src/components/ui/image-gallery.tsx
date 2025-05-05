import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) {
    return null;
  }

  return (
    <div className="relative">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={images[activeIndex]}
          alt={`Recipe image ${activeIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={handlePrevious}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={handleNext}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <div className="mt-4 flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 w-20 overflow-hidden rounded-lg ${
                  index === activeIndex ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}; 