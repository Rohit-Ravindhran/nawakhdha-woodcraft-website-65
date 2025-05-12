
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductCategoryData } from './types';

interface GalleryImage {
  url: string;
  caption: string;
  alt?: string;
}

// Update the mutation types
interface UpdateProductData extends ProductCategoryData {
  description?: string;
  gallery_images?: GalleryImage[];
  slug?: string;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: UpdateProductData) => {
      if (productData.id) {
        // Update existing product category
        const { error: categoryError } = await supabase
          .from('product_categories')
          .update({
            category_name: productData.category_name,
            product_name: productData.product_name,
            category_image_url: productData.category_image_url,
            alt_text: productData.alt_text,
            seo_title: productData.seo_title,
            seo_description: productData.seo_description,
            seo_keywords: productData.seo_keywords,
            category_slug: productData.category_slug
          })
          .eq('id', productData.id);
          
        if (categoryError) throw categoryError;
        
        // Update or insert product details
        const { data: existingDetail } = await supabase
          .from('product_category_details')
          .select('id')
          .eq('category_id', productData.id)
          .maybeSingle();
          
        if (existingDetail) {
          // Update existing details
          const { error: detailError } = await supabase
            .from('product_category_details')
            .update({
              description: productData.description,
              product_name: productData.product_name,
              seo_title: productData.seo_title,
              seo_description: productData.seo_description,
              seo_keywords: productData.seo_keywords
            })
            .eq('category_id', productData.id);
            
          if (detailError) throw detailError;
        } else if (productData.description) {
          // Insert new details if description exists
          const { error: detailError } = await supabase
            .from('product_category_details')
            .insert({
              category_id: productData.id,
              description: productData.description,
              product_name: productData.product_name,
              seo_title: productData.seo_title,
              seo_description: productData.seo_description,
              seo_keywords: productData.seo_keywords
            });
            
          if (detailError) throw detailError;
        }
        
        // Handle gallery images
        await handleGalleryImages(productData);
        
        return productData;
      } else {
        // Insert new product category
        const { data: newCategory, error: categoryError } = await supabase
          .from('product_categories')
          .insert({
            category_name: productData.category_name,
            product_name: productData.product_name,
            category_image_url: productData.category_image_url,
            alt_text: productData.alt_text,
            seo_title: productData.seo_title,
            seo_description: productData.seo_description,
            seo_keywords: productData.seo_keywords,
            category_slug: productData.category_slug
          })
          .select()
          .single();
          
        if (categoryError) throw categoryError;
        
        // Insert product details and gallery
        await Promise.all([
          insertProductDetails(newCategory.id, productData),
          insertGalleryImages(newCategory.id, productData.gallery_images)
        ]);
        
        return {
          ...productData,
          id: newCategory.id
        };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success(`Product "${data.product_name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating product: ${error.message}`);
    }
  });
}

// Helper function to handle gallery images
async function handleGalleryImages(productData: UpdateProductData) {
  if (!productData.id || !productData.gallery_images || productData.gallery_images.length === 0) return;
  
  // First get existing images to compare
  const { data: existingImages } = await supabase
    .from('product_gallery')
    .select('image_url')
    .eq('category_id', productData.id);
    
  const existingUrls = existingImages?.map(img => img.image_url) || [];
  
  // Add new images that don't exist yet
  const newImages = productData.gallery_images.filter(img => !existingUrls.includes(img.url));
  
  for (let i = 0; i < newImages.length; i++) {
    const img = newImages[i];
    const { error: galleryError } = await supabase
      .from('product_gallery')
      .insert({
        category_id: productData.id,
        image_url: img.url,
        caption: img.caption || '',
        alt_text: img.alt || '',
        position: existingUrls.length + i
      });
      
    if (galleryError) throw galleryError;
  }
}

// Helper function to insert product details
async function insertProductDetails(categoryId: string, productData: UpdateProductData) {
  if (!productData.description) return;
  
  const { error: detailError } = await supabase
    .from('product_category_details')
    .insert({
      category_id: categoryId,
      description: productData.description,
      product_name: productData.product_name,
      seo_title: productData.seo_title,
      seo_description: productData.seo_description,
      seo_keywords: productData.seo_keywords
    });
    
  if (detailError) throw detailError;
}

// Helper function to insert gallery images
async function insertGalleryImages(categoryId: string, galleryImages?: GalleryImage[]) {
  if (!galleryImages || galleryImages.length === 0) return;
  
  for (let i = 0; i < galleryImages.length; i++) {
    const img = galleryImages[i];
    const { error: galleryError } = await supabase
      .from('product_gallery')
      .insert({
        category_id: categoryId,
        image_url: img.url,
        caption: img.caption || '',
        alt_text: img.alt || '',
        position: i
      });
      
    if (galleryError) throw galleryError;
  }
}
