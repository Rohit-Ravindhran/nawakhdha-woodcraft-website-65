
import React from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { GalleryImage } from '@/hooks/content/types';

interface ProductMainContentProps {
  featuredImage?: string;
  featuredImageAlt?: string;
  productName: string;
  description: string;
  categoryName: string;
  productSlug?: string;
  galleryImages?: GalleryImage[];
}

export function ProductMainContent({
  featuredImage,
  featuredImageAlt,
  productName,
  description,
  categoryName,
  productSlug,
  galleryImages
}: ProductMainContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div>
        <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden">
          {featuredImage ? (
            <OptimizedImage 
              src={featuredImage} 
              alt={featuredImageAlt || productName || "Product image"}
              className="w-full h-full"
              imageType="productDetail"
              priority={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">No product images available</p>
            </div>
          )}
        </AspectRatio>
        
        {/* Additional thumbnails (optional) */}
        {galleryImages && galleryImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {galleryImages.slice(1, 5).map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                <OptimizedImage 
                  src={image.url || "/placeholder.svg"} 
                  alt={image.alt || `${productName} thumbnail ${index + 2}`}
                  className="w-full h-full"
                  imageType="product"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Product Description */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">{productName}</h2>
        
        <div className="prose max-w-none">
          {description ? (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p>No description available for this product.</p>
          )}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-2">Product Details</h3>
          <ul className="space-y-2">
            <li><strong>Category:</strong> {categoryName}</li>
            {productName && categoryName !== productName && (
              <li><strong>Product Name:</strong> {productName}</li>
            )}
            {productSlug && (
              <li><strong>Slug:</strong> {productSlug}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
