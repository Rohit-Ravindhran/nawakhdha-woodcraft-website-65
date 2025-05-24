
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData } from './types';

export function useProductBySlug(slug?: string) {
  return useQuery({
    queryKey: ['product_by_slug', slug],
    queryFn: async (): Promise<ProductCategoryData | null> => {
      if (!slug) {
        console.log('useProductBySlug: No slug provided');
        return null;
      }
      
      console.log('useProductBySlug: Searching for slug:', slug);
      
      // First try to find by home_products slug
      const { data: homeProductData, error: homeProductError } = await supabase
        .from('home_products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      if (!homeProductError && homeProductData) {
        console.log('useProductBySlug: Found home product:', homeProductData);
        
        // We found a match in home_products
        // Now get the corresponding product category if possible
        if (homeProductData.category_name) {
          const { data: categoryData, error: catError } = await supabase
            .from('product_categories')
            .select('*')
            .eq('category_name', homeProductData.category_name)
            .maybeSingle();
            
          if (!catError && categoryData) {
            console.log('useProductBySlug: Found matching category:', categoryData);
            return categoryData as ProductCategoryData;
          }
          
          // If we can't find a matching category, return the home product data
          // with some properties mapped to match ProductCategoryData interface
          console.log('useProductBySlug: Using home product data as fallback');
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
        console.log('useProductBySlug: Found category by slug:', categoryBySlug);
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
          console.log('useProductBySlug: Found category by ID:', categoryById);
          return categoryById as ProductCategoryData;
        }
      }
      
      console.log('useProductBySlug: No product found for slug:', slug);
      return null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a not found error
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    }
  });
}
