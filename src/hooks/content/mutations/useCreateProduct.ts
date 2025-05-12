
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductData } from '../types';

/**
 * Hook for creating new product categories
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: Omit<ProductData, 'id'>) => {
      // Insert new product
      const { data, error } = await supabase
        .from('product_categories')
        .insert(productData)
        .select()
        .single();
          
      if (error) throw error;
      return data as ProductData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Product "${data.product_name || 'New product'}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error creating product: ${error.message}`);
    }
  });
}
