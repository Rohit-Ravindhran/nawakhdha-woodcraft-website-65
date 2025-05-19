
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData, ProductDetailData, GalleryImage } from './types';

// Get a single product by ID with all its details
export function useProductDetail(productId?: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<(ProductCategoryData & ProductDetailData & { 
      gallery_images: GalleryImage[] 
    }) | null> => {
      if (!productId) return null;
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId)
        .maybeSingle();
        
      if (categoryError) throw categoryError;
      if (!categoryData) return null;
      
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', productId)
        .maybeSingle();
        
      if (detailError) throw detailError;
      
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', productId)
        .order('position', { ascending: true });
        
      if (galleryError) throw galleryError;
      
      // Get slug from home_products if exists
      const { data: homeProductData } = await supabase
        .from('home_products')
        .select('slug')
        .eq('category_name', categoryData.category_name)
        .maybeSingle();
      
      return {
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
    },
    enabled: !!productId
  });
}
