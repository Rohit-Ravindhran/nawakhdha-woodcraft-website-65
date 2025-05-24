
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
      
      // First try to get the category data by ID
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

      let categoryRecord = null;
      
      if (categoryError) {
        console.error('useProductDetail: Category fetch error:', categoryError);
      }
      
      // If we found category data by ID, use it
      if (categoryData && categoryData.length > 0) {
        categoryRecord = categoryData[0];
        console.log('useProductDetail: Found category by ID:', categoryRecord);
      } else {
        // If not found by ID, try to find by looking up home_products first
        console.log('useProductDetail: No category found by ID, trying home_products lookup...');
        
        const { data: homeProductData, error: homeProductError } = await supabase
          .from('home_products')
          .select('*')
          .eq('id', productId);
          
        console.log('useProductDetail: Home product lookup result:', {
          data: homeProductData,
          error: homeProductError,
          searchedId: productId
        });
        
        if (homeProductData && homeProductData.length > 0) {
          const homeProduct = homeProductData[0];
          
          // Now try to find the category by category_name
          if (homeProduct.category_name) {
            const { data: categoryByName, error: categoryByNameError } = await supabase
              .from('product_categories')
              .select('*')
              .eq('category_name', homeProduct.category_name);
              
            console.log('useProductDetail: Category by name lookup result:', {
              data: categoryByName,
              error: categoryByNameError,
              categoryName: homeProduct.category_name
            });
            
            if (categoryByName && categoryByName.length > 0) {
              categoryRecord = categoryByName[0];
              console.log('useProductDetail: Found category by name:', categoryRecord);
            } else {
              // Create a synthetic category record from home product data
              categoryRecord = {
                id: homeProduct.id,
                category_name: homeProduct.category_name,
                category_image_url: homeProduct.image_url,
                alt_text: homeProduct.alt_text,
                category_slug: productId,
                product_name: homeProduct.category_name
              };
              console.log('useProductDetail: Created synthetic category from home product:', categoryRecord);
            }
          }
        }
      }
      
      if (!categoryRecord) {
        console.log('useProductDetail: No category data found for ID:', productId);
        
        // Additional debugging: Let's see what IDs actually exist
        const { data: allCategories, error: allCategoriesError } = await supabase
          .from('product_categories')
          .select('id, category_name')
          .limit(10);
          
        const { data: allHomeProducts, error: allHomeProductsError } = await supabase
          .from('home_products')
          .select('id, category_name, slug')
          .limit(10);
          
        console.log('useProductDetail: Available data in database:', {
          allCategories,
          allHomeProducts,
          categoriesError: allCategoriesError,
          homeProductsError: allHomeProductsError,
          searchedFor: productId
        });
        
        return null;
      }
      
      // Get detail data - try both the original category ID and the productId
      console.log('useProductDetail: Fetching product_category_details...');
      
      // First try with the category record ID
      let detailData = null;
      let detailError = null;
      
      const { data: detailByCategory, error: detailByCategoryError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', categoryRecord.id)
        .maybeSingle();
        
      console.log('useProductDetail: Detail by category ID query result:', {
        data: detailByCategory,
        error: detailByCategoryError,
        categoryId: categoryRecord.id
      });
      
      if (detailByCategory) {
        detailData = detailByCategory;
      } else if (productId !== categoryRecord.id) {
        // If no details found with category ID, try with the original productId
        const { data: detailByProductId, error: detailByProductIdError } = await supabase
          .from('product_category_details')
          .select('*')
          .eq('category_id', productId)
          .maybeSingle();
          
        console.log('useProductDetail: Detail by productId query result:', {
          data: detailByProductId,
          error: detailByProductIdError,
          productId: productId
        });
        
        if (detailByProductId) {
          detailData = detailByProductId;
        }
      }
        
      if (detailError) {
        console.error('useProductDetail: Detail fetch error:', detailError);
        // Don't throw error for details - they're optional
      }
      
      // Get gallery data - try both category ID and productId
      console.log('useProductDetail: Fetching product_gallery...');
      
      let galleryData = null;
      
      const { data: galleryByCategory, error: galleryByCategoryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', categoryRecord.id)
        .order('position', { ascending: true });
        
      console.log('useProductDetail: Gallery by category ID query result:', {
        data: galleryByCategory,
        error: galleryByCategoryError,
        categoryId: categoryRecord.id
      });
      
      if (galleryByCategory && galleryByCategory.length > 0) {
        galleryData = galleryByCategory;
      } else if (productId !== categoryRecord.id) {
        // Try with original productId
        const { data: galleryByProductId, error: galleryByProductIdError } = await supabase
          .from('product_gallery')
          .select('*')
          .eq('category_id', productId)
          .order('position', { ascending: true });
          
        console.log('useProductDetail: Gallery by productId query result:', {
          data: galleryByProductId,
          error: galleryByProductIdError,
          productId: productId
        });
        
        if (galleryByProductId) {
          galleryData = galleryByProductId;
        }
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
