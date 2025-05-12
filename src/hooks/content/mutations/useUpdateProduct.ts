
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductData } from '../types';

/**
 * Hook for updating existing product categories
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: ProductData) => {
      const { id, ...productFields } = productData;
      
      if (!id) {
        throw new Error('Product ID is required for updating');
      }
      
      // Update existing product
      const { error } = await supabase
        .from('product_categories')
        .update(productFields)
        .eq('id', id);
          
      if (error) throw error;
      return productData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-category', data.id] });
      toast.success(`Product "${data.product_name || 'Product'}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating product: ${error.message}`);
    }
  });
}
