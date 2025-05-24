
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
  console.log('ProductMainContent: Rendering with data:', {
    productName,
    categoryName,
    hasDescription: !!description,
    descriptionLength: description?.length || 0,
    productSlug,
    hasFeaturedImage: !!featuredImage
  });

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
      </div>
      
      {/* Product Description */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">{productName}</h2>
        
        <div className="prose max-w-none">
          {description ? (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p className="text-gray-600 italic">No description available for this product. Please check the Product Details section in the admin panel to add a description.</p>
          )}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-2">Product Details</h3>
          <ul className="space-y-2">
            <li><strong>Category:</strong> {categoryName}</li>
            <li><strong>Product Name:</strong> {productName}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
