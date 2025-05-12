import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HomeProductData, ProductCategoryData } from './types';

export function useHomeProducts() {
  return useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_products')
        .select('*');

      if (error) throw error;
      
      // Log when no products are found for debugging
      if (!data || data.length === 0) {
        console.warn('No home products found in database');
      }
      
      return data as HomeProductData[];
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

// Type definition to make description optional
interface ProductCategoryWithOptionalDescription {
  id: string;
  category_name: string | null;
  product_name: string | null;
  category_image_url: string | null;
  alt_text: string | null;
  category_slug: string | null;
  description?: string | null; // Made description optional
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
}

export function useHomeProductsWithItems() {
  return useQuery({
    queryKey: ['home-products-with-items'],
    queryFn: async () => {
      try {
        // First fetch home products
        const { data: homeProducts, error: homeProductsError } = await supabase
          .from('home_products')
          .select('*');
        
        if (homeProductsError) throw homeProductsError;
        
        if (!homeProducts || homeProducts.length === 0) {
          console.warn('No home products found');
          return [];
        }
        
        // For each home product, find matching product categories
        const productsWithCategories = await Promise.all(
          homeProducts.map(async (homeProduct) => {
            if (!homeProduct.category_name) {
              return {
                ...homeProduct,
                product_categories: []
              };
            }
            
            const { data: categories, error: categoriesError } = await supabase
              .from('product_categories')
              .select('*')
              .eq('category_name', homeProduct.category_name);
              
            if (categoriesError) {
              console.error(`Error fetching categories for ${homeProduct.category_name}:`, categoriesError);
              return {
                ...homeProduct,
                product_categories: []
              };
            }
            
            return {
              ...homeProduct,
              product_categories: categories || []
            };
          })
        );
        
        // Cast with type assertion
        return productsWithCategories as unknown as (HomeProductData & {
          product_categories: ProductCategoryWithOptionalDescription[]
        })[];
      } catch (error) {
        console.error("Error in useHomeProductsWithItems:", error);
        throw error;
      }
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Also invalidate product categories query
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
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Also invalidate product categories query
      toast.success(`Home product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting home product: ${error.message}`);
    }
  });
}
