
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
        
        // Look for matching category by category_name
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
            
            // Return the category data with the slug from home_products
            return {
              ...category,
              slug: homeProduct.slug,
              product_name: category.product_name || homeProduct.category_name
            } as ProductCategoryData;
          } else {
            // Debug: Show available categories
            const { data: allCategories } = await supabase
              .from('product_categories')
              .select('id, category_name, product_name')
              .limit(10);
              
            console.log('useProductBySlug: Available categories for debugging:', {
              allCategories,
              searchedFor: homeProduct.category_name,
              availableCategoryNames: allCategories?.map(c => c.category_name)
            });
            
            // Try case-insensitive search
            console.log('useProductBySlug: Trying case-insensitive category search...');
            const { data: categoryDataInsensitive, error: catErrorInsensitive } = await supabase
              .from('product_categories')
              .select('*')
              .ilike('category_name', homeProduct.category_name);
              
            console.log('useProductBySlug: Case-insensitive category lookup:', {
              data: categoryDataInsensitive,
              error: catErrorInsensitive
            });
            
            if (!catErrorInsensitive && categoryDataInsensitive && categoryDataInsensitive.length > 0) {
              const category = categoryDataInsensitive[0];
              console.log('useProductBySlug: Found category with case-insensitive search:', category);
              
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
      }
      
      // Try product_categories by category_slug
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
      
      // Try by UUID if it looks like one
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
      return null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false // Disable retry for faster debugging
  });
}
