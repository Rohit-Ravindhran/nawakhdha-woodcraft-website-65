
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData, ProductDetailData, GalleryImage } from './types';

export function useProductDetail(productId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['product_detail', productId],
    queryFn: async (): Promise<(ProductCategoryData & ProductDetailData & { 
      gallery_images: GalleryImage[] 
    }) | null> => {
      if (!productId) {
        console.log('useProductDetail: No productId provided');
        return null;
      }
      
      console.log('useProductDetail: Fetching details for productId:', productId);
      
      // Step 1: Get category data by ID first
      console.log('useProductDetail: Step 1 - Querying product_categories by ID...');
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId);
        
      console.log('useProductDetail: Category by ID query result:', {
        data: categoryData,
        error: categoryError,
        searchingForId: productId
      });

      let categoryRecord = null;
      let homeProductRecord = null;
      
      if (categoryData && categoryData.length > 0) {
        categoryRecord = categoryData[0];
        console.log('useProductDetail: Found category by ID:', categoryRecord);
      } else {
        console.log('useProductDetail: No category found by ID, trying home_products...');
        
        // Step 2: Try to find by home_products ID
        const { data: homeProductData, error: homeProductError } = await supabase
          .from('home_products')
          .select('*')
          .eq('id', productId);
          
        console.log('useProductDetail: Home product by ID lookup:', {
          data: homeProductData,
          error: homeProductError,
          searchedId: productId
        });
        
        if (homeProductData && homeProductData.length > 0) {
          homeProductRecord = homeProductData[0];
          console.log('useProductDetail: Found home product by ID:', homeProductRecord);
          
          // Step 3: Try to find matching category by category_name
          if (homeProductRecord.category_name) {
            console.log('useProductDetail: Looking for category by name:', homeProductRecord.category_name);
            
            const { data: categoryByName, error: categoryByNameError } = await supabase
              .from('product_categories')
              .select('*')
              .eq('category_name', homeProductRecord.category_name);
              
            console.log('useProductDetail: Category by name lookup:', {
              data: categoryByName,
              error: categoryByNameError,
              categoryName: homeProductRecord.category_name
            });
            
            if (categoryByName && categoryByName.length > 0) {
              categoryRecord = categoryByName[0];
              console.log('useProductDetail: Found category by name:', categoryRecord);
            } else {
              // Try case-insensitive search
              console.log('useProductDetail: Trying case-insensitive category search...');
              const { data: categoryInsensitive, error: categoryInsensitiveError } = await supabase
                .from('product_categories')
                .select('*')
                .ilike('category_name', homeProductRecord.category_name);
                
              console.log('useProductDetail: Case-insensitive category search:', {
                data: categoryInsensitive,
                error: categoryInsensitiveError
              });
              
              if (categoryInsensitive && categoryInsensitive.length > 0) {
                categoryRecord = categoryInsensitive[0];
                console.log('useProductDetail: Found category with case-insensitive search:', categoryRecord);
              }
            }
          }
        }
      }
      
      // Step 4: If we still don't have a category, create synthetic one from home product
      if (!categoryRecord && homeProductRecord) {
        console.log('useProductDetail: Creating synthetic category from home product');
        categoryRecord = {
          id: homeProductRecord.id,
          category_name: homeProductRecord.category_name,
          category_image_url: homeProductRecord.image_url,
          alt_text: homeProductRecord.alt_text,
          category_slug: productId,
          product_name: homeProductRecord.category_name
        };
        console.log('useProductDetail: Created synthetic category:', categoryRecord);
      }
      
      if (!categoryRecord) {
        console.log('useProductDetail: No category data found - checking RLS policies');
        
        // Debug RLS by checking current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('useProductDetail: Current user for RLS debugging:', {
          user: user ? { id: user.id, email: user.email } : null,
          error: userError
        });
        
        // Try to get any categories to check RLS
        const { data: anyCategoriesTest, error: anyCategoriesError } = await supabase
          .from('product_categories')
          .select('id, category_name')
          .limit(5);
          
        console.log('useProductDetail: RLS test - any categories accessible:', {
          data: anyCategoriesTest,
          error: anyCategoriesError,
          count: anyCategoriesTest?.length || 0
        });
        
        return null;
      }
      
      // Step 5: Get product details using the category ID
      const searchCategoryId = categoryRecord.id;
      console.log('useProductDetail: Step 5 - Fetching product_category_details for category:', searchCategoryId);
      
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', searchCategoryId)
        .maybeSingle();
        
      console.log('useProductDetail: Detail query result:', {
        data: detailData,
        error: detailError,
        categoryId: searchCategoryId,
        hasDescription: !!detailData?.description,
        hasProductName: !!detailData?.product_name
      });
      
      // Step 6: Get gallery images
      console.log('useProductDetail: Step 6 - Fetching product_gallery for category:', searchCategoryId);
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', searchCategoryId)
        .order('position', { ascending: true });
        
      console.log('useProductDetail: Gallery query result:', {
        data: galleryData,
        error: galleryError,
        categoryId: searchCategoryId,
        galleryCount: galleryData?.length || 0
      });
      
      // Step 7: Get slug from home_products if we don't have it
      let finalSlug = homeProductRecord?.slug;
      if (!finalSlug && categoryRecord.category_name) {
        console.log('useProductDetail: Step 7 - Fetching slug from home_products...');
        const { data: homeProductSlug, error: homeProductSlugError } = await supabase
          .from('home_products')
          .select('slug')
          .eq('category_name', categoryRecord.category_name)
          .maybeSingle();
        
        console.log('useProductDetail: Home product slug query:', {
          data: homeProductSlug,
          error: homeProductSlugError,
          categoryName: categoryRecord.category_name
        });
        
        finalSlug = homeProductSlug?.slug;
      }
      
      // Step 8: Combine all data
      const result = {
        ...categoryRecord,
        ...(detailData || {}),
        slug: finalSlug,
        gallery_images: galleryData?.map(img => ({
          url: img.image_url,
          caption: img.caption,
          alt: img.alt_text,
          position: img.position
        })) || []
      };
      
      console.log('useProductDetail: Final result assembly:', {
        hasCategory: !!categoryRecord,
        hasDetails: !!detailData,
        galleryCount: result.gallery_images.length,
        hasSlug: !!result.slug,
        categoryName: result.category_name,
        productName: result.product_name,
        hasDescription: !!result.description,
        finalProductName: detailData?.product_name || categoryRecord.product_name || categoryRecord.category_name,
        dataSource: detailData ? 'product_category_details' : 'category_only'
      });
      
      return result;
    },
    enabled: options?.enabled !== false && !!productId,
    staleTime: 5 * 60 * 1000,
    retry: false // Disable retry for faster debugging
  });
}
