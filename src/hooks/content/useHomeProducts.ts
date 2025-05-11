
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HomeProductData } from './types';

export function useHomeProducts() {
  return useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_products')
        .select('*');

      if (error) throw error;
      return data as HomeProductData[];
    }
  });
}

export function useUpdateHomeProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: HomeProductData) => {
      const { id, ...productFields } = productData;
      
      if (id) {
        // Update existing product
        const { error } = await supabase
          .from('home_products')
          .update(productFields)
          .eq('id', id);
          
        if (error) throw error;
        return productData;
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('home_products')
          .insert(productFields)
          .select()
          .single();
          
        if (error) throw error;
        return data as HomeProductData;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      toast.success(`Home product "${data.category_name || ''}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating home product: ${error.message}`);
    }
  });
}

export function useDeleteHomeProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('home_products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      toast.success(`Home product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting home product: ${error.message}`);
    }
  });
}
