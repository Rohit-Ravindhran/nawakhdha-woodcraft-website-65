
import React from 'react';
import { GalleryImage } from '@/hooks/content/types';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductGalleryGridProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductGalleryGrid({ images, productName }: ProductGalleryGridProps) {
  if (!images || images.length === 0) return null;

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
          <div key={index} className="border rounded-md overflow-hidden group hover:shadow-md transition-shadow">
            <AspectRatio ratio={4/3} className="bg-gray-100">
              <OptimizedImage
                src={image.url}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                imageType="productDetail"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
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
    </div>
  );
}
