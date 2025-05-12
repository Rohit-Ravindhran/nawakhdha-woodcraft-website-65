
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductCategoryData, ProductData } from './types';

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: ProductData) => {
      const { id, ...productFields } = productData;
      
      if (id) {
        // Update existing product
        const { error } = await supabase
          .from('product_categories')
          .update(productFields)
          .eq('id', id);
          
        if (error) throw error;
        return { ...productData, id };
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('product_categories')
          .insert(productFields)
          .select()
          .single();
          
        if (error) throw error;
        return data as ProductData;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-category', data.id] });
      toast.success(`Product "${data.product_name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating product: ${error.message}`);
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
      queryClient.invalidateQueries({ queryKey: ['product-category', productId] });
      toast.success(`Product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting product: ${error.message}`);
    }
  });
}
