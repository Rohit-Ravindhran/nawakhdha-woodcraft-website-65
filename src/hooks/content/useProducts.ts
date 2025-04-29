
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductData } from './types';

// Products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useProduct(productId?: number) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data as ProductData & { id: number };
    },
    enabled: !!productId
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: ProductData) => {
      const { id, ...productFields } = productData;
      
      // Prepare gallery_images to ensure they're in the correct format
      const sanitizedGalleryImages = productFields.gallery_images?.map(img => ({
        url: img.url,
        caption: img.caption || '',
        alt: img.alt || ''
      })).filter(img => img.url && img.url.trim() !== '') || [];

      // Prepare product fields for submission
      const sanitizedProductFields = {
        ...productFields,
        gallery_images: sanitizedGalleryImages.length > 0 ? sanitizedGalleryImages : null,
        // Ensure seo_keywords is a string (Supabase will handle it according to the schema)
        seo_keywords: productFields.seo_keywords || null,
      };
      
      if (id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(sanitizedProductFields)
          .eq('id', id);
          
        if (error) throw error;
        return { ...productData, id };
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('products')
          .insert(sanitizedProductFields)
          .select()
          .single();
          
        if (error) throw error;
        return data as ProductData & { id: number };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success(`Product "${data.product_name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating product: ${error.message}`);
      console.error("Product update error details:", error);
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase
        .from('products')
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
