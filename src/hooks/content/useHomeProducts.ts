
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

export function useHomeProductsWithItems() {
  return useQuery({
    queryKey: ['home-products-with-items'],
    queryFn: async () => {
      // Fetch home products along with their related product categories
      const { data, error } = await supabase
        .from('home_products')
        .select(`
          id,
          category_name,
          slug,
          image_url,
          alt_text,
          product_categories:product_categories(
            id, 
            category_name,
            product_name,
            category_image_url,
            alt_text,
            category_slug
          )
        `);
      
      if (error) throw error;
      
      // Transform the data to ensure we handle null values properly
      return data.map(item => ({
        ...item,
        product_categories: item.product_categories || []
      })) as (HomeProductData & {
        product_categories: Array<{
          id: string;
          category_name: string;
          product_name: string | null;
          category_image_url: string | null;
          alt_text: string | null;
          category_slug: string | null;
        }>
      })[];
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
        
        // Update category_slug in all related product categories
        if (productData.slug) {
          const { error: relatedError } = await supabase
            .from('product_categories')
            .update({ category_slug: productData.slug })
            .eq('category_name', productData.category_name || '');
            
          if (relatedError) {
            console.error('Error updating related products:', relatedError);
            // Don't throw here to avoid breaking the entire operation
          }
        }
        
        return productData;
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('home_products')
          .insert(productFields)
          .select()
          .single();
          
        if (error) throw error;
        
        // Update category_slug in all related product categories for new products too
        if (productFields.slug && productFields.category_name) {
          const { error: relatedError } = await supabase
            .from('product_categories')
            .update({ category_slug: productFields.slug })
            .eq('category_name', productFields.category_name);
            
          if (relatedError) {
            console.error('Error updating related products:', relatedError);
          }
        }
        
        return data as HomeProductData;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products-with-items'] });
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
      queryClient.invalidateQueries({ queryKey: ['home-products-with-items'] });
      toast.success(`Home product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting home product: ${error.message}`);
    }
  });
}
