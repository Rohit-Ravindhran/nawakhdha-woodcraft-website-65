
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData } from '@/hooks/content/types';
import { Loader2 } from 'lucide-react';
import SectionTitle from '@/components/ui/section-title';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ProductGalleryGrid } from '@/components/products/ProductGalleryGrid';
import { useProductDetail } from '@/hooks/content/useProductDetails';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Try to find the product by slug or category_slug
  const { 
    data: productCategory,
    isLoading: loadingCategory,
    error: categoryError 
  } = useQuery({
    queryKey: ['product_by_slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      // First try to find by home_products slug
      const { data: homeProductData, error: homeProductError } = await supabase
        .from('home_products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      if (!homeProductError && homeProductData) {
        // We found a match in home_products
        // Now get the corresponding product category if possible
        if (homeProductData.category_name) {
          const { data: categoryData, error: catError } = await supabase
            .from('product_categories')
            .select('*')
            .eq('category_name', homeProductData.category_name)
            .maybeSingle();
            
          if (!catError && categoryData) {
            return categoryData as ProductCategoryData;
          }
          
          // If we can't find a matching category, return the home product data
          // with some properties mapped to match ProductCategoryData interface
          return {
            id: homeProductData.id,
            category_name: homeProductData.category_name,
            category_image_url: homeProductData.image_url,
            alt_text: homeProductData.alt_text,
            slug: homeProductData.slug
          } as ProductCategoryData;
        }
      }
      
      // If we didn't find a home product by slug, try product categories
      const { data: categoryBySlug, error: slugError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('category_slug', slug)
        .maybeSingle();
        
      if (!slugError && categoryBySlug) {
        return categoryBySlug as ProductCategoryData;
      }
      
      // Finally, try by ID (for backwards compatibility)
      if (slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const { data: categoryById, error: idError } = await supabase
          .from('product_categories')
          .select('*')
          .eq('id', slug)
          .maybeSingle();
          
        if (!idError && categoryById) {
          return categoryById as ProductCategoryData;
        }
      }
      
      return null;
    },
    enabled: !!slug
  });

  // Use the enhanced product detail hook to fetch product details including gallery
  const { 
    data: productData,
    isLoading: loadingProductData
  } = useProductDetail(productCategory?.id);
  
  const isLoading = loadingCategory || loadingProductData;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (categoryError || !productCategory) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-2xl font-bold mb-4 text-center">Product Not Found</h1>
        <p className="text-center text-muted-foreground">
          Sorry, we couldn't find the product you're looking for.
        </p>
      </div>
    );
  }

  // Get the product details and description
  const description = productData?.description || productCategory.description || "";
  const categoryName = productCategory.category_name || "";
  const productName = productData?.product_name || productCategory.product_name || categoryName;
  const featuredImage = productData?.gallery_images?.length > 0 
    ? productData.gallery_images[0].url 
    : productCategory.category_image_url;
  const featuredImageAlt = productData?.gallery_images?.length > 0
    ? productData.gallery_images[0].alt
    : productCategory.alt_text;
  
  return (
    <div className="py-12">
      <div className="container-custom">
        <SectionTitle
          title={categoryName}
          subtitle={productName !== categoryName ? productName : ""}
          centered
        />
        
        {/* Product Main Content */}
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
            {productData?.gallery_images && productData.gallery_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {productData.gallery_images.slice(1, 5).map((image, index) => (
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
                {productCategory.product_name && categoryName !== productCategory.product_name && (
                  <li><strong>Product Name:</strong> {productCategory.product_name}</li>
                )}
                {productCategory.slug && (
                  <li><strong>Slug:</strong> {productCategory.slug}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Product Gallery Grid - New Addition */}
        {productData?.gallery_images && productData.gallery_images.length > 0 && (
          <ProductGalleryGrid 
            images={productData.gallery_images}
            productName={productName}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
