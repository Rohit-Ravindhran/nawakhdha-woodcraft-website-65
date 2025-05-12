
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData } from './types';

// Get all product categories with their slugs from home_products
export function useProductCategories() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<ProductCategoryData[]> => {
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*');

      if (categoryError) throw categoryError;
      
      // Fetch home products to get the slugs
      const { data: homeProductsData, error: homeProductsError } = await supabase
        .from('home_products')
        .select('*');
        
      if (homeProductsError) throw homeProductsError;
      
      // Map the categories with their corresponding home product slugs
      return categoryData.map((category): ProductCategoryData => {
        const matchingHomeProduct = homeProductsData.find(
          hp => hp.category_name === category.category_name
        );
        
        return {
          ...category,
          slug: matchingHomeProduct?.slug || category.category_slug
        };
      });
    }
  });
}

export function useProductCategory(categoryId?: string) {
  return useQuery({
    queryKey: ['product-category', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', categoryId)
        .maybeSingle();

      if (error) throw error;
      return data as ProductCategoryData;
    },
    enabled: !!categoryId
  });
}
