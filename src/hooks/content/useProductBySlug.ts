
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
      
      // Enhanced debugging: First try to find by home_products slug
      console.log('useProductBySlug: Querying home_products table...');
      const { data: homeProductData, error: homeProductError } = await supabase
        .from('home_products')
        .select('*')
        .eq('slug', slug);
        
      console.log('useProductBySlug: Home products query result:', {
        data: homeProductData,
        error: homeProductError,
        searchedSlug: slug
      });
        
      if (!homeProductError && homeProductData && homeProductData.length > 0) {
        const homeProduct = homeProductData[0];
        console.log('useProductBySlug: Found home product:', homeProduct);
        
        // We found a match in home_products
        // Now get the corresponding product category if possible
        if (homeProduct.category_name) {
          console.log('useProductBySlug: Looking for category with name:', homeProduct.category_name);
          
          const { data: categoryData, error: catError } = await supabase
            .from('product_categories')
            .select('*')
            .eq('category_name', homeProduct.category_name);
            
          console.log('useProductBySlug: Category lookup result:', {
            data: categoryData,
            error: catError,
            categoryName: homeProduct.category_name
          });
            
          if (!catError && categoryData && categoryData.length > 0) {
            const category = categoryData[0];
            console.log('useProductBySlug: Found matching category:', category);
            return category as ProductCategoryData;
          }
          
          // Additional debugging: Let's see what categories exist
          const { data: allCategories, error: allCatError } = await supabase
            .from('product_categories')
            .select('id, category_name')
            .limit(10);
            
          console.log('useProductBySlug: Available categories in database:', {
            allCategories,
            error: allCatError,
            searchedFor: homeProduct.category_name
          });
          
          // If we can't find a matching category, return the home product data
          // with some properties mapped to match ProductCategoryData interface
          console.log('useProductBySlug: Using home product data as fallback');
          return {
            id: homeProduct.id,
            category_name: homeProduct.category_name,
            category_image_url: homeProduct.image_url,
            alt_text: homeProduct.alt_text,
            slug: homeProduct.slug
          } as ProductCategoryData;
        }
      }
      
      // If we didn't find a home product by slug, try product categories
      console.log('useProductBySlug: Trying product_categories by category_slug...');
      const { data: categoryBySlug, error: slugError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('category_slug', slug);
        
      console.log('useProductBySlug: Category by slug result:', {
        data: categoryBySlug,
        error: slugError,
        searchedSlug: slug
      });
        
      if (!slugError && categoryBySlug && categoryBySlug.length > 0) {
        console.log('useProductBySlug: Found category by slug:', categoryBySlug[0]);
        return categoryBySlug[0] as ProductCategoryData;
      }
      
      // Finally, try by ID (for backwards compatibility)
      if (slug && slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log('useProductBySlug: Trying as UUID in product_categories...');
        const { data: categoryById, error: idError } = await supabase
          .from('product_categories')
          .select('*')
          .eq('id', slug);
          
        console.log('useProductBySlug: Category by ID result:', {
          data: categoryById,
          error: idError,
          searchedId: slug
        });
          
        if (!idError && categoryById && categoryById.length > 0) {
          console.log('useProductBySlug: Found category by ID:', categoryById[0]);
          return categoryById[0] as ProductCategoryData;
        }
      }
      
      console.log('useProductBySlug: No product found for slug:', slug);
      
      // Final debugging: Show what's available in both tables
      const { data: allHomeProducts } = await supabase
        .from('home_products')
        .select('id, slug, category_name')
        .limit(5);
        
      const { data: allProductCategories } = await supabase
        .from('product_categories')
        .select('id, category_name, category_slug')
        .limit(5);
        
      console.log('useProductBySlug: Debug - Available data:', {
        homeProducts: allHomeProducts,
        productCategories: allProductCategories,
        searchedSlug: slug
      });
      
      return null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      console.log('useProductBySlug: Retry attempt:', failureCount, 'Error:', error);
      // Don't retry if it's a not found error
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    }
  });
}
