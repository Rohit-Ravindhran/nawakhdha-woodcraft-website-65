
import React from 'react';
import { Link } from 'react-router-dom';
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

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-2">Complete Your Interior</h3>
          <p className="text-muted-foreground">
            We can supply this alongside our{" "}
            <Link to="/aluminium-work-bahrain" className="text-primary underline underline-offset-4 hover:no-underline">
              aluminium doors, windows and glass partitions in Bahrain
            </Link>{" "}
            and our{" "}
            <Link to="/gypsum-work-bahrain" className="text-primary underline underline-offset-4 hover:no-underline">
              false ceiling and gypsum partition work
            </Link>
            , or as part of a full{" "}
            <Link to="/interior-fitouts-bahrain" className="text-primary underline underline-offset-4 hover:no-underline">
              interior fit-out
            </Link>
            .
          </p>
        </div>

      </div>
    </div>
  );
}
