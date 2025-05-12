
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
      
      const { data: homeProductsData, error: homeProductsError } = await supabase
        .from('home_products')
        .select('*');
        
      if (homeProductsError) throw homeProductsError;
      
      return categoryData.map((category): ProductCategoryData => {
        const matchingHomeProduct = homeProductsData.find(
          hp => hp.category_name === category.category_name
        );
        
        return {
          ...category,
          slug: matchingHomeProduct?.slug
        };
      });
    }
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success(`Product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting product: ${error.message}`);
    }
  });
}
