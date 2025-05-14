import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData } from '@/hooks/content/types';
import { Loader2 } from 'lucide-react';
import SectionTitle from '@/components/ui/section-title';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Define interfaces for the response data
interface ProductGalleryItem {
  id: string;
  image_url: string;
  caption: string;
  alt_text?: string;
  position?: number;
  category_id: string;
}

interface ProductDetails {
  id?: string;
  category_id?: string;
  description?: string;
  product_name?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

interface QueryResult {
  details: ProductDetails;
  gallery: ProductGalleryItem[];
}

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

  // Then, get the product details and gallery once we have the category ID
  const { 
    data: productDetails, 
    isLoading: loadingDetails
  } = useQuery({
    queryKey: ['product_details', productCategory?.id],
    queryFn: async () => {
      if (!productCategory?.id) return { details: {}, gallery: [] } as QueryResult;
      
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', productCategory.id)
        .maybeSingle();
        
      if (detailError) throw detailError;
      
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', productCategory.id)
        .order('position', { ascending: true });
        
      if (galleryError) throw galleryError;
      
      return {
        details: detailData || {},
        gallery: galleryData || []
      } as QueryResult;
    },
    enabled: !!productCategory?.id
  });

  const isLoading = loadingCategory || loadingDetails;
  
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

  const gallery = productDetails?.gallery || [];
  const details = productDetails?.details || {};
  const description = details.description || productCategory.description || "";
  
  return (
    <div className="py-12">
      <div className="container-custom">
        <SectionTitle
          title={productCategory.category_name || "Product Details"}
          subtitle={productCategory.product_name || ""}
          centered
        />
        
        {/* Product Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            {gallery.length > 0 ? (
              <div className="space-y-4">
                <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden">
                  <OptimizedImage 
                    src={gallery[0]?.image_url || "/placeholder.svg"} 
                    alt={gallery[0]?.alt_text || productCategory.category_name || "Product image"}
                    className="w-full h-full"
                    imageType="productDetail"
                    priority={true}
                  />
                </AspectRatio>
                
                {gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {gallery.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <OptimizedImage 
                          src={image.image_url || "/placeholder.svg"} 
                          alt={image.alt_text || `${productCategory.category_name} image ${index + 2}`}
                          className="w-full h-full"
                          imageType="product"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden">
                {productCategory.category_image_url ? (
                  <OptimizedImage 
                    src={productCategory.category_image_url} 
                    alt={productCategory.alt_text || "Product image"}
                    className="w-full h-full"
                    imageType="product"
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No product images available</p>
                  </div>
                )}
              </AspectRatio>
            )}
          </div>
          
          {/* Product Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">{productCategory.product_name || productCategory.category_name}</h2>
            
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
                <li><strong>Category:</strong> {productCategory.category_name}</li>
                {productCategory.product_name && (
                  <li><strong>Product Name:</strong> {productCategory.product_name}</li>
                )}
                {productCategory.slug && (
                  <li><strong>Slug:</strong> {productCategory.slug}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
