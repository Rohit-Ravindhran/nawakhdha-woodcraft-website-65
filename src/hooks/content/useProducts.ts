
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
      
      // Get the product category information
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (categoryError) throw categoryError;
      
      // Get the detailed description if available
      const { data: detailData, error: detailError } = await supabase
        .from('product_category_details')
        .select('*')
        .eq('category_id', productId)
        .maybeSingle();
        
      if (detailError && detailError.code !== 'PGRST116') throw detailError;
      
      // Get gallery images
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', productId)
        .order('position', { ascending: true });
        
      if (galleryError) throw galleryError;
      
      // Combine the data
      const combinedData: ProductCategoryData & {
        details?: ProductDetailData,
        gallery_images?: { url: string; caption: string; alt?: string }[]
      } = {
        ...categoryData as ProductCategoryData,
        details: detailData as ProductDetailData,
        gallery_images: galleryData?.map(img => ({
          url: img.image_url || '',
          caption: img.caption || '',
          alt: img.alt_text
        }))
      };

      return combinedData;
    },
    enabled: !!productId
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: ProductCategoryData & {
      details?: ProductDetailData,
      gallery_images?: { url: string; caption: string; alt?: string }[]
    }) => {
      const { id, details, gallery_images, ...categoryFields } = productData;
      
      // Prepare category fields for submission
      const sanitizedCategoryFields = {
        ...categoryFields,
        // Ensure seo_keywords is a string (Supabase will handle it according to the schema)
        seo_keywords: categoryFields.seo_keywords || null,
      };
      
      let updatedProduct: ProductCategoryData;
      
      if (id) {
        // Update existing product category
        const { error } = await supabase
          .from('product_categories')
          .update(sanitizedCategoryFields)
          .eq('id', id);
          
        if (error) throw error;
        
        updatedProduct = { ...sanitizedCategoryFields, id };
        
        // Update or insert details
        if (details) {
          const { error: detailsError } = await supabase
            .from('product_category_details')
            .upsert({
              category_id: id,
              description: details.description,
              seo_title: details.seo_title,
              seo_description: details.seo_description,
              seo_keywords: details.seo_keywords,
            });
            
          if (detailsError) throw detailsError;
        }
        
        // Update gallery images if provided
        if (gallery_images && gallery_images.length > 0) {
          // First delete existing images
          const { error: deleteError } = await supabase
            .from('product_gallery')
            .delete()
            .eq('category_id', id);
            
          if (deleteError) throw deleteError;
          
          // Then insert new ones
          const galleryItems = gallery_images.map((img, index) => ({
            category_id: id,
            image_url: img.url,
            caption: img.caption,
            alt_text: img.alt,
            position: index
          }));
          
          const { error: insertError } = await supabase
            .from('product_gallery')
            .insert(galleryItems);
            
          if (insertError) throw insertError;
        }
      } else {
        // Insert new product category
        const { data, error } = await supabase
          .from('product_categories')
          .insert(sanitizedCategoryFields)
          .select()
          .single();
          
        if (error) throw error;
        
        updatedProduct = data as ProductCategoryData;
        
        // Insert details if provided
        if (details && updatedProduct.id) {
          const { error: detailsError } = await supabase
            .from('product_category_details')
            .insert({
              category_id: updatedProduct.id,
              description: details.description,
              seo_title: details.seo_title,
              seo_description: details.seo_description,
              seo_keywords: details.seo_keywords,
            });
            
          if (detailsError) throw detailsError;
        }
        
        // Insert gallery images if provided
        if (gallery_images && gallery_images.length > 0 && updatedProduct.id) {
          const galleryItems = gallery_images.map((img, index) => ({
            category_id: updatedProduct.id,
            image_url: img.url,
            caption: img.caption,
            alt_text: img.alt,
            position: index
          }));
          
          const { error: insertError } = await supabase
            .from('product_gallery')
            .insert(galleryItems);
            
          if (insertError) throw insertError;
        }
      }
      
      return updatedProduct;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success(`Product "${data.product_name || data.category_name}" updated successfully`);
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
    mutationFn: async (productId: string) => {
      // First delete related records
      const { error: galleryError } = await supabase
        .from('product_gallery')
        .delete()
        .eq('category_id', productId);
        
      if (galleryError) throw galleryError;
      
      const { error: detailsError } = await supabase
        .from('product_category_details')
        .delete()
        .eq('category_id', productId);
        
      if (detailsError && detailsError.code !== 'PGRST116') throw detailsError;
      
      // Then delete the product category
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
