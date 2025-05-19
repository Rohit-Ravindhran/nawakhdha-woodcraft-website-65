
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData } from './types';

export function useProductBySlug(slug?: string) {
  return useQuery({
    queryKey: ['product_by_slug', slug],
    queryFn: async (): Promise<ProductCategoryData | null> => {
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
      if (slug && slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
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
}
