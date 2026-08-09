
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductData } from '../types';
import { pickProductCategoryColumns } from '../columnFilters';

/**
 * Hook for creating new product categories
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: Omit<ProductData, 'id'>) => {
      try {
        // Insert new product
        const { data, error } = await supabase
          .from('product_categories')
          .insert(pickProductCategoryColumns(productData as Record<string, unknown>))
          .select()
          .single();
            
        if (error) {
          // Handle specific errors
          if (error.message.includes("row-level security")) {
            throw new Error('Permission denied: You may not have the required permissions to create products');
          }
          throw error;
        }
        
        return data as ProductData;
      } catch (error: any) {
        console.error("Product creation error:", error);
        throw new Error(`Failed to create product: ${error.message}`);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Product "${data.product_name || 'New product'}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    }
  });
}
