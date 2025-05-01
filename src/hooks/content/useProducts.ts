import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductCategoryData, ProductDetailData } from './types';

// Products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');

      if (error) throw error;
      return data as ProductCategoryData[];
    }
  });
}

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId)
        .maybeSingle();
        
      if (categoryError) throw categoryError;
      
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', productId)
        .maybeSingle();
        
      if (detailError) throw detailError;
      
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', productId);
        
      if (galleryError) throw galleryError;
      
      // Combine the data
      return {
        ...categoryData,
        ...(detailData || {}),
        gallery_images: galleryData?.map(img => ({
          url: img.image_url,
          caption: img.caption,
          alt: img.alt_text
        })) || []
      } as ProductCategoryData & { gallery_images?: { url: string; caption: string; alt?: string }[] };
    },
    enabled: !!productId
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: ProductCategoryData & { 
      description?: string; 
      gallery_images?: { url: string; caption: string; alt?: string }[] 
    }) => {
      const { 
        id, 
        description, 
        gallery_images, 
        ...categoryFields 
      } = productData;
      
      if (id) {
        // Update existing product category
        const { error: categoryError } = await supabase
          .from('product_categories')
          .update(categoryFields)
          .eq('id', id);
          
        if (categoryError) throw categoryError;
        
        // Update or insert product details
        if (description) {
          const { data: existingDetail } = await supabase
            .from('product_category_details')
            .select('id')
            .eq('category_id', id)
            .maybeSingle();
            
          if (existingDetail) {
            const { error: detailError } = await supabase
              .from('product_category_details')
              .update({ description })
              .eq('id', existingDetail.id);
              
            if (detailError) throw detailError;
          } else {
            const { error: detailError } = await supabase
              .from('product_category_details')
              .insert({ 
                category_id: id, 
                description 
              });
              
            if (detailError) throw detailError;
          }
        }
        
        // Handle gallery images if present
        if (gallery_images && gallery_images.length > 0) {
          // We'll implement this when needed
        }
        
        return { ...productData, id };
      } else {
        // Insert new product category
        const { data: categoryData, error: categoryError } = await supabase
          .from('product_categories')
          .insert(categoryFields)
          .select('id')
          .single();
          
        if (categoryError) throw categoryError;
        
        const newId = categoryData.id;
        
        // Insert product details if description exists
        if (description) {
          const { error: detailError } = await supabase
            .from('product_category_details')
            .insert({ 
              category_id: newId, 
              description 
            });
            
          if (detailError) throw detailError;
        }
        
        // Handle gallery images if present
        if (gallery_images && gallery_images.length > 0) {
          // We'll implement this when needed
        }
        
        return { ...productData, id: newId };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success(`Product "${data.category_name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating product: ${error.message}`);
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      // First delete related records in product_category_details
      const { error: detailsError } = await supabase
        .from('product_category_details')
        .delete()
        .eq('category_id', productId);
      
      if (detailsError) throw detailsError;
      
      // Delete related gallery images
      const { error: galleryError } = await supabase
        .from('product_gallery')
        .delete()
        .eq('category_id', productId);
        
      if (galleryError) throw galleryError;
      
      // Now delete the main product category
      const { error } = await supabase
        .from('product_categories')
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
