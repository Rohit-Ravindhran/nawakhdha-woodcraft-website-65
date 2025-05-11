import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductCategoryData, ProductDetailData } from './types';

interface GalleryImage {
  url: string;
  caption: string;
  alt?: string;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<ProductCategoryData[]> => {
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*');

      if (categoryError) throw categoryError;
      
      const { data: homeProductsData, error: homeProductsError } = await supabase
        .from('home_products')
        .select('*');
        
      if (homeProductsError) throw homeProductsError;
      
      return categoryData.map((category): ProductCategoryData => {
        const matchingHomeProduct = homeProductsData.find(
          hp => hp.category_name === category.category_name
        );
        
        return {
          ...category,
          slug: matchingHomeProduct?.slug
        };
      });
    }
  });
}

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<(ProductCategoryData & ProductDetailData & { 
      gallery_images: GalleryImage[] 
    }) | null> => {
      if (!productId) return null;
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId)
        .maybeSingle();
        
      if (categoryError) throw categoryError;
      if (!categoryData) return null;
      
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
      
      // Get slug from home_products if exists
      const { data: homeProductData } = await supabase
        .from('home_products')
        .select('slug')
        .eq('category_name', categoryData.category_name)
        .maybeSingle();
      
      return {
        ...categoryData,
        ...(detailData || {}),
        slug: homeProductData?.slug,
        gallery_images: galleryData?.map(img => ({
          url: img.image_url,
          caption: img.caption,
          alt: img.alt_text
        })) || []
      };
    },
    enabled: !!productId
  });
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
        
        // Handle gallery images if provided
        if (productData.gallery_images && productData.gallery_images.length > 0) {
          // First get existing images to compare
          const { data: existingImages } = await supabase
            .from('product_gallery')
            .select('image_url')
            .eq('category_id', productData.id);
            
          const existingUrls = existingImages?.map(img => img.image_url) || [];
          
          // Add new images that don't exist yet
          for (let i = 0; i < productData.gallery_images.length; i++) {
            const img = productData.gallery_images[i];
            if (!existingUrls.includes(img.url)) {
              const { error: galleryError } = await supabase
                .from('product_gallery')
                .insert({
                  category_id: productData.id,
                  image_url: img.url,
                  caption: img.caption || '',
                  alt_text: img.alt || '',
                  position: i
                });
                
              if (galleryError) throw galleryError;
            }
          }
        }
        
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
        
        // Insert product details if description exists
        if (productData.description) {
          const { error: detailError } = await supabase
            .from('product_category_details')
            .insert({
              category_id: newCategory.id,
              description: productData.description,
              product_name: productData.product_name,
              seo_title: productData.seo_title,
              seo_description: productData.seo_description,
              seo_keywords: productData.seo_keywords
            });
            
          if (detailError) throw detailError;
        }
        
        // Insert gallery images if provided
        if (productData.gallery_images && productData.gallery_images.length > 0) {
          for (let i = 0; i < productData.gallery_images.length; i++) {
            const img = productData.gallery_images[i];
            const { error: galleryError } = await supabase
              .from('product_gallery')
              .insert({
                category_id: newCategory.id,
                image_url: img.url,
                caption: img.caption || '',
                alt_text: img.alt || '',
                position: i
              });
              
            if (galleryError) throw galleryError;
          }
        }
        
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

// Add the missing useDeleteProduct hook
export function useDeleteProduct() {
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
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success(`Product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting product: ${error.message}`);
    }
  });
}
