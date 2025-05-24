
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
      
      // Enhanced debugging: Get category data with better error handling
      console.log('useProductDetail: Querying product_categories table...');
      const { data: categoryData, error: categoryError, count } = await supabase
        .from('product_categories')
        .select('*', { count: 'exact' })
        .eq('id', productId);
        
      console.log('useProductDetail: Category query result:', {
        data: categoryData,
        error: categoryError,
        count,
        searchingForId: productId
      });
        
      if (categoryError) {
        console.error('useProductDetail: Category fetch error:', categoryError);
        throw categoryError;
      }
      
      // Check if we got any results
      if (!categoryData || categoryData.length === 0) {
        console.log('useProductDetail: No category data found for ID:', productId);
        
        // Additional debugging: Let's see what IDs actually exist
        const { data: allCategories, error: allCategoriesError } = await supabase
          .from('product_categories')
          .select('id, category_name')
          .limit(10);
          
        console.log('useProductDetail: Available category IDs in database:', {
          allCategories,
          error: allCategoriesError,
          searchedFor: productId
        });
        
        return null;
      }
      
      const categoryRecord = categoryData[0];
      console.log('useProductDetail: Found category:', categoryRecord);
      
      // Get detail data
      console.log('useProductDetail: Fetching product_category_details...');
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', productId)
        .maybeSingle();
        
      console.log('useProductDetail: Detail query result:', {
        data: detailData,
        error: detailError,
        categoryId: productId
      });
        
      if (detailError) {
        console.error('useProductDetail: Detail fetch error:', detailError);
        // Don't throw error for details - they're optional
      }
      
      // Get gallery data
      console.log('useProductDetail: Fetching product_gallery...');
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', productId)
        .order('position', { ascending: true });
        
      console.log('useProductDetail: Gallery query result:', {
        data: galleryData,
        error: galleryError,
        categoryId: productId
      });
        
      if (galleryError) {
        console.error('useProductDetail: Gallery fetch error:', galleryError);
        // Don't throw error for gallery - it's optional
      }
      
      // Get slug from home_products if exists
      console.log('useProductDetail: Fetching home_products slug...');
      const { data: homeProductData, error: homeProductError } = await supabase
        .from('home_products')
        .select('slug')
        .eq('category_name', categoryRecord.category_name)
        .maybeSingle();
      
      console.log('useProductDetail: Home product query result:', {
        data: homeProductData,
        error: homeProductError,
        categoryName: categoryRecord.category_name
      });
      
      const result = {
        ...categoryRecord,
        ...(detailData || {}),
        slug: homeProductData?.slug,
        gallery_images: galleryData?.map(img => ({
          url: img.image_url,
          caption: img.caption,
          alt: img.alt_text,
          position: img.position
        })) || []
      };
      
      console.log('useProductDetail: Final result:', result);
      return result;
    },
    enabled: options?.enabled !== false && !!productId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      console.log('useProductDetail: Retry attempt:', failureCount, 'Error:', error);
      // Don't retry if it's a not found error
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    }
  });
}
