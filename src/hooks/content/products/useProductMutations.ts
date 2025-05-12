
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HomeProductData } from '../types';
import { purgeCDNCache } from '@/utils/imageOptimization';

// Mutation hook for updating home products
export function useUpdateHomeProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateHomeProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products-with-items'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Home product "${data.category_name || ''}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating home product: ${error.message}`);
    }
  });
}

// Separate update logic
async function updateHomeProduct(productData: HomeProductData) {
  const { id, ...productFields } = productData;
  
  // Store old slug for cache invalidation
  let oldSlug = '';
  
  if (id) {
    // Get current product data to extract old slug
    const { data: currentProduct } = await supabase
      .from('home_products')
      .select('slug')
      .eq('id', id)
      .single();
      
    if (currentProduct?.slug) {
      oldSlug = currentProduct.slug;
    }
    
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
      
      // Purge CDN cache for both old and new slugs
      if (oldSlug && oldSlug !== productData.slug) {
        await purgeCDNCache(`/product/${oldSlug}/images`);
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
}

// Mutation hook for deleting home products
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products-with-items'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Home product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting home product: ${error.message}`);
    }
  });
}
