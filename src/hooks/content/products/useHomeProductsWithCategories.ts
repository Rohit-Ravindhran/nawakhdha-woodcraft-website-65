
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HomeProductData } from '../types';
import { HomeProductWithCategories, ProductCategoryWithOptionalDescription } from './types';

// Hook for fetching home products with their related categories
export function useHomeProductsWithCategories() {
  return useQuery({
    queryKey: ['home-products-with-items'],
    queryFn: fetchHomeProductsWithCategories,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

// Separate the fetch logic for better organization
export async function fetchHomeProductsWithCategories(): Promise<HomeProductWithCategories[]> {
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
    const validProducts = homeProducts.filter(product => {
      if (!product.slug) {
        console.error(`Product ${product.id} missing slug`);
        return false;
      }
      return true;
    });
    
    // For each home product, find matching product categories
    const productsWithCategories = await Promise.all(
      validProducts.map(async (homeProduct) => {
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
    
    return productsWithCategories as HomeProductWithCategories[];
  } catch (error) {
    console.error("Error in useHomeProductsWithItems:", error);
    throw error;
  }
}
