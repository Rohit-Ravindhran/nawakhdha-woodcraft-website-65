
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HomeProductData } from '../types';

// Basic hook for fetching home products
export function useBasicHomeProducts() {
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
