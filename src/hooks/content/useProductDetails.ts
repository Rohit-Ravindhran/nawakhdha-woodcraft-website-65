
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData, ProductDetailData, GalleryImage } from './types';

// Get a single product by ID with all its details
export function useProductDetail(productId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<(ProductCategoryData & ProductDetailData & { 
      gallery_images: GalleryImage[] 
    }) | null> => {
      if (!productId) {
        console.log('useProductDetail: No productId provided');
        return null;
      }
      
      console.log('useProductDetail: Fetching data for productId:', productId);
      
      // Get category data
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId)
        .maybeSingle();
        
      if (categoryError) {
        console.error('useProductDetail: Category fetch error:', categoryError);
        throw categoryError;
      }
      
      if (!categoryData) {
        console.log('useProductDetail: No category data found for ID:', productId);
        return null;
      }
      
      // Get detail data
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', productId)
        .maybeSingle();
        
      if (detailError) {
        console.error('useProductDetail: Detail fetch error:', detailError);
        // Don't throw error for details - they're optional
      }
      
      // Get gallery data
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', productId)
        .order('position', { ascending: true });
        
      if (galleryError) {
        console.error('useProductDetail: Gallery fetch error:', galleryError);
        // Don't throw error for gallery - it's optional
      }
      
      // Get slug from home_products if exists
      const { data: homeProductData } = await supabase
        .from('home_products')
        .select('slug')
        .eq('category_name', categoryData.category_name)
        .maybeSingle();
      
      const result = {
        ...categoryData,
        ...(detailData || {}),
        slug: homeProductData?.slug,
        gallery_images: galleryData?.map(img => ({
          url: img.image_url,
          caption: img.caption,
          alt: img.alt_text,
          position: img.position
        })) || []
      };
      
      console.log('useProductDetail: Returning data:', result);
      return result;
    },
    enabled: options?.enabled !== false && !!productId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a not found error
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    }
  });
}
