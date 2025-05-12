
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HomeProductData, ProductCategoryData } from './types';
import { purgeCDNCache } from '@/utils/imageOptimization';

// Basic hook for fetching home products
export function useHomeProducts() {
  return useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      // Log when no products are found for debugging
      if (!data || data.length === 0) {
        console.warn('No home products found in database');
      }
      
      // Validate slug field availability - critical field per requirements
      const productsWithValidation = data?.map(product => {
        if (!product.slug) {
          console.error(`Product ${product.id} missing slug`);
        }
        return product;
      }) || [];
      
      return productsWithValidation as HomeProductData[];
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
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
}

// Hook for fetching home products with their related categories
export function useHomeProductsWithItems() {
  return useQuery({
    queryKey: ['home-products-with-items'],
    queryFn: fetchHomeProductsWithCategories,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

// Separate the fetch logic for better organization
async function fetchHomeProductsWithCategories() {
  try {
    // First fetch home products
    const { data: homeProducts, error: homeProductsError } = await supabase
      .from('home_products')
      .select('*')
      .order('id', { ascending: false });
    
    if (homeProductsError) throw homeProductsError;
    
    if (!homeProducts || homeProducts.length === 0) {
      console.warn('No home products found');
      return [];
    }
    
    // Validate slug field - critical field per requirements
    for (const product of homeProducts) {
      if (!product.slug) {
        console.error(`Product ${product.id} missing slug`);
      }
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
    
    // Cast with type assertion to fix TypeScript error
    return productsWithCategories as unknown as (HomeProductData & {
      product_categories: ProductCategoryWithOptionalDescription[]
    })[];
  } catch (error) {
    console.error("Error in useHomeProductsWithItems:", error);
    throw error;
  }
}

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
