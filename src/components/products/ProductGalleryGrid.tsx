import React, { useState } from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { GalleryImage } from '@/hooks/content/types';

interface ProductGalleryGridProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductGalleryGrid({ images, productName }: ProductGalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  // Sort images by position if available
  const sortedImages = [...images].sort((a, b) => {
    // Use position if available, otherwise keep original order
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    return 0;
  });

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((image, index) => (
            <div 
              key={index} 
              className="cursor-pointer group relative"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <OptimizedImage
                  src={image.url}
                  alt={image.alt || `${productName} - Image ${index + 1}`}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  imageType="productDetail"
                />
              </div>
              {image.caption && (
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image dialog for full-size view */}
      <Dialog 
        open={!!selectedImage} 
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl w-full bg-black/90 border-gray-800">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {selectedImage && (
            <div className="p-2">
              <div className="aspect-auto max-h-[70vh] flex items-center justify-center">
                <OptimizedImage
                  src={selectedImage.url}
                  alt={selectedImage.alt || `${productName} image`}
                  className="max-h-full max-w-full object-contain"
                  imageType="productDetail"
                  objectFit="contain"
                />
              </div>
              {selectedImage.caption && (
                <div className="mt-4 text-center text-white">
                  {selectedImage.caption}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
