
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook for deleting product categories
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        const { error } = await supabase
          .from('product_categories')
          .delete()
          .eq('id', productId);
          
        if (error) {
          // Handle specific errors
          if (error.message.includes("row-level security")) {
            throw new Error('Permission denied: You may not have the required permissions to delete products');
          }
          throw error;
        }
        
        return productId;
      } catch (error: any) {
        console.error("Product deletion error:", error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-category', productId] });
      toast.success(`Product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    }
  });
}
