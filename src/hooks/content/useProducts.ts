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
      // ... rest of the implementation remains the same
      // Just ensure proper typing throughout
    },
    // ... rest of the mutation config
  });
}

// No changes needed for useDeleteProduct