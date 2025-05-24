
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
      
      // Get category data by ID
      console.log('useProductDetail: Querying product_categories...');
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId);
        
      console.log('useProductDetail: Category query result:', {
        data: categoryData,
        error: categoryError,
        searchingForId: productId
      });

      let categoryRecord = null;
      
      if (categoryData && categoryData.length > 0) {
        categoryRecord = categoryData[0];
        console.log('useProductDetail: Found category by ID:', categoryRecord);
      } else {
        console.log('useProductDetail: No category found by ID, trying alternative approaches...');
        
        // Try to find by home_products
        const { data: homeProductData, error: homeProductError } = await supabase
          .from('home_products')
          .select('*')
          .eq('id', productId);
          
        console.log('useProductDetail: Home product lookup:', {
          data: homeProductData,
          error: homeProductError,
          searchedId: productId
        });
        
        if (homeProductData && homeProductData.length > 0) {
          const homeProduct = homeProductData[0];
          
          // Find category by category_name
          if (homeProduct.category_name) {
            const { data: categoryByName, error: categoryByNameError } = await supabase
              .from('product_categories')
              .select('*')
              .eq('category_name', homeProduct.category_name);
              
            console.log('useProductDetail: Category by name lookup:', {
              data: categoryByName,
              error: categoryByNameError,
              categoryName: homeProduct.category_name
            });
            
            if (categoryByName && categoryByName.length > 0) {
              categoryRecord = categoryByName[0];
              console.log('useProductDetail: Found category by name:', categoryRecord);
            } else {
              // Create synthetic category from home product
              categoryRecord = {
                id: homeProduct.id,
                category_name: homeProduct.category_name,
                category_image_url: homeProduct.image_url,
                alt_text: homeProduct.alt_text,
                category_slug: productId,
                product_name: homeProduct.category_name
              };
              console.log('useProductDetail: Created synthetic category:', categoryRecord);
            }
          }
        }
      }
      
      if (!categoryRecord) {
        console.log('useProductDetail: No category data found');
        return null;
      }
      
      // Get product details using the category ID
      console.log('useProductDetail: Fetching product_category_details for category:', categoryRecord.id);
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', categoryRecord.id)
        .maybeSingle();
        
      console.log('useProductDetail: Detail query result:', {
        data: detailData,
        error: detailError,
        categoryId: categoryRecord.id
      });
      
      // Get gallery images
      console.log('useProductDetail: Fetching product_gallery for category:', categoryRecord.id);
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', categoryRecord.id)
        .order('position', { ascending: true });
        
      console.log('useProductDetail: Gallery query result:', {
        data: galleryData,
        error: galleryError,
        categoryId: categoryRecord.id
      });
      
      // Get slug from home_products
      console.log('useProductDetail: Fetching slug from home_products...');
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
      
      const result = {
        ...categoryRecord,
        ...(detailData || {}),
        slug: homeProductSlug?.slug,
        gallery_images: galleryData?.map(img => ({
          url: img.image_url,
          caption: img.caption,
          alt: img.alt_text,
          position: img.position
        })) || []
      };
      
      console.log('useProductDetail: Final result:', {
        hasCategory: !!categoryRecord,
        hasDetails: !!detailData,
        galleryCount: result.gallery_images.length,
        hasSlug: !!result.slug,
        categoryName: result.category_name,
        productName: result.product_name,
        hasDescription: !!result.description
      });
      
      return result;
    },
    enabled: options?.enabled !== false && !!productId,
    staleTime: 5 * 60 * 1000,
    retry: false // Disable retry for faster debugging
  });
}
