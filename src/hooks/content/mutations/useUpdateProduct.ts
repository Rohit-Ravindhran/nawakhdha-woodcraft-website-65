
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
      
      try {
        // Update existing product
        const { error } = await supabase
          .from('product_categories')
          .update(productFields)
          .eq('id', id);
            
        if (error) {
          // Handle specific errors
          if (error.message.includes("row-level security")) {
            throw new Error('Permission denied: You may not have the required permissions to update products');
          }
          throw error;
        }
        
        return productData;
      } catch (error: any) {
        console.error("Product update error:", error);
        throw new Error(`Failed to update product: ${error.message}`);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-category', data.id] });
      toast.success(`Product "${data.product_name || 'Product'}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    }
  });
}
