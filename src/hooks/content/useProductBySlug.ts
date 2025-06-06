
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
      
      // First, try to find by category_slug in product_categories (this should be the primary method)
      console.log('useProductBySlug: Querying product_categories by category_slug...');
      const { data: categoryBySlug, error: slugError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('category_slug', slug)
        .maybeSingle();
        
      console.log('useProductBySlug: Category by slug result:', {
        data: categoryBySlug,
        error: slugError,
        searchedSlug: slug
      });
        
      if (!slugError && categoryBySlug) {
        console.log('useProductBySlug: Found category by category_slug:', categoryBySlug);
        return {
          ...categoryBySlug,
          slug: categoryBySlug.category_slug
        } as ProductCategoryData;
      }
      
      // Second, try to find by home_products slug
      console.log('useProductBySlug: Querying home_products table...');
      const { data: homeProductData, error: homeProductError } = await supabase
        .from('home_products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      console.log('useProductBySlug: Home products query result:', {
        data: homeProductData,
        error: homeProductError,
        searchedSlug: slug
      });
        
      if (!homeProductError && homeProductData) {
        const homeProduct = homeProductData;
        console.log('useProductBySlug: Found home product:', homeProduct);
        
        // Look for matching category by category_name
        if (homeProduct.category_name) {
          console.log('useProductBySlug: Looking for category with name:', homeProduct.category_name);
          
          const { data: categoryData, error: catError } = await supabase
            .from('product_categories')
            .select('*')
            .ilike('category_name', homeProduct.category_name)
            .maybeSingle();
            
          console.log('useProductBySlug: Category lookup result:', {
            data: categoryData,
            error: catError,
            categoryName: homeProduct.category_name
          });
            
          if (!catError && categoryData) {
            const category = categoryData;
            console.log('useProductBySlug: Found matching category:', category);
            
            // Return the category data with the slug from home_products
            return {
              ...category,
              slug: homeProduct.slug,
              product_name: category.product_name || homeProduct.category_name
            } as ProductCategoryData;
          }
          
          // Return home product data as fallback category
          console.log('useProductBySlug: Using home product as fallback category');
          return {
            id: homeProduct.id,
            category_name: homeProduct.category_name,
            category_image_url: homeProduct.image_url,
            alt_text: homeProduct.alt_text,
            slug: homeProduct.slug,
            product_name: homeProduct.category_name,
            category_slug: homeProduct.slug
          } as ProductCategoryData;
        }
      }
      
      // Finally, try by UUID if it looks like one (fallback only)
      if (slug && slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log('useProductBySlug: Trying as UUID in product_categories...');
        const { data: categoryById, error: idError } = await supabase
          .from('product_categories')
          .select('*')
          .eq('id', slug)
          .maybeSingle();
          
        console.log('useProductBySlug: Category by ID result:', {
          data: categoryById,
          error: idError,
          searchedId: slug
        });
          
        if (!idError && categoryById) {
          console.log('useProductBySlug: Found category by ID:', categoryById);
          return {
            ...categoryById,
            slug: categoryById.category_slug || slug
          } as ProductCategoryData;
        }
      }
      
      console.log('useProductBySlug: No product found for slug:', slug);
      return null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}
