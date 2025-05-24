
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
      
      let categoryRecord = null;
      let homeProductRecord = null;
      let actualCategoryId = null;
      
      // Step 1: Try to get category data by ID first
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

      if (categoryData && categoryData.length > 0) {
        categoryRecord = categoryData[0];
        actualCategoryId = categoryRecord.id;
        console.log('useProductDetail: Found category by ID:', categoryRecord);
      } else {
        // Step 2: Try to find by home_products ID
        console.log('useProductDetail: No category found by ID, trying home_products...');
        
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
          
          // Step 3: Find matching category by category_name from home_products
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
              actualCategoryId = categoryRecord.id;
              console.log('useProductDetail: Found category by name, actualCategoryId:', actualCategoryId);
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
                actualCategoryId = categoryRecord.id;
                console.log('useProductDetail: Found category with case-insensitive search, actualCategoryId:', actualCategoryId);
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
        // For synthetic categories, we can't fetch details since there's no real category_id
        actualCategoryId = null;
        console.log('useProductDetail: Created synthetic category:', categoryRecord);
      }
      
      if (!categoryRecord) {
        console.log('useProductDetail: No category data found');
        return null;
      }
      
      let detailData = null;
      
      // Step 5: Get product details using the ACTUAL category ID (not home product ID)
      if (actualCategoryId) {
        console.log('useProductDetail: Step 5 - Fetching product_category_details for ACTUAL category ID:', actualCategoryId);
        
        const { data: detailDataResult, error: detailError } = await supabase
          .from('product_category_details')
          .select('*')
          .eq('category_id', actualCategoryId)
          .maybeSingle();
          
        console.log('useProductDetail: Detail query result:', {
          data: detailDataResult,
          error: detailError,
          actualCategoryId: actualCategoryId,
          hasDescription: !!detailDataResult?.description,
          hasProductName: !!detailDataResult?.product_name
        });
        
        detailData = detailDataResult;
      } else {
        console.log('useProductDetail: Skipping product_category_details fetch - no actual category ID');
      }
      
      // Step 6: Get gallery images
      const gallerySearchId = actualCategoryId || categoryRecord.id;
      console.log('useProductDetail: Step 6 - Fetching product_gallery for category:', gallerySearchId);
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', gallerySearchId)
        .order('position', { ascending: true });
        
      console.log('useProductDetail: Gallery query result:', {
        data: galleryData,
        error: galleryError,
        categoryId: gallerySearchId,
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
        actualCategoryIdUsed: actualCategoryId,
        finalProductName: detailData?.product_name || categoryRecord.product_name || categoryRecord.category_name,
        dataSource: detailData ? 'product_category_details' : 'category_only',
        descriptionFromDetails: detailData?.description || 'No description found'
      });
      
      return result;
    },
    enabled: options?.enabled !== false && !!productId,
    staleTime: 5 * 60 * 1000,
    retry: false // Disable retry for faster debugging
  });
}
