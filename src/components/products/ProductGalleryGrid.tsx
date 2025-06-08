
import React, { useState, useEffect } from 'react';
import { GalleryImage } from '@/hooks/content/types';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { useImageLightbox } from '@/hooks/use-image-lightbox';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { preloadImage } from '@/utils/imageOptimization';

interface ProductGalleryGridProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductGalleryGrid({ images, productName }: ProductGalleryGridProps) {
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const { isOpen, currentImage, openLightbox, closeLightbox } = useImageLightbox();

  // Preload first few images for better perceived performance
  useEffect(() => {
    if (images && images.length > 0) {
      // Preload first 3 images
      images.slice(0, 3).forEach((image, index) => {
        preloadImage(image.url, index === 0);
      });
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  // Track loaded images for progressive enhancement
  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => new Set(prev).add(index));
  };

  // Handle image click to open lightbox
  const handleImageClick = (image: GalleryImage, index: number) => {
    openLightbox({
      src: image.url,
      alt: image.alt || `${productName} - Image ${index + 1}`,
      caption: image.caption || image.alt || `${productName} - Image ${index + 1}`,
    });
  };

  // Use structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    'name': `${productName} Gallery`,
    'image': images.map(image => ({
      '@type': 'ImageObject',
      'contentUrl': image.url,
      'name': image.caption || productName,
      'description': image.caption || `Image of ${productName}`,
      'caption': image.caption
    }))
  };

  return (
    <div className="mt-16">
      {/* Inject structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <h2 className="text-2xl font-playfair font-semibold mb-6">Product Gallery</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={cn(
              "border rounded-md overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer",
              imagesLoaded.has(index) ? "opacity-100" : "opacity-90"
            )}
            onClick={() => handleImageClick(image, index)}
            role="button"
            tabIndex={0}
            aria-label={`View enlarged image: ${image.caption || image.alt || `${productName} - Image ${index + 1}`}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick(image, index);
              }
            }}
          >
            <AspectRatio ratio={4/3} className="bg-gray-100">
              <OptimizedImage
                src={image.url}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                imageType="productDetail"
                priority={index === 0} // Only first image is priority
                loading={index < 2 ? 'eager' : 'lazy'} // First 2 images load eagerly
                width={400}
                height={300}
                onLoad={() => handleImageLoad(index)}
              />
            </AspectRatio>
            {image.caption && (
              <div className="p-3 bg-white">
                <p className="text-sm text-gray-700 line-clamp-2">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={isOpen}
        onClose={closeLightbox}
        src={currentImage?.src || ''}
        alt={currentImage?.alt || ''}
        caption={currentImage?.caption}
      />
    </div>
  );
}
