
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCategoryData } from "@/hooks/content/types";

export function useGalleryData(selectedCategory: string | null) {
  const { data: productCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['product_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, category_name')
        .order('category_name');
        
      if (error) throw error;
      return data as Pick<ProductCategoryData, 'id' | 'category_name'>[];
    },
  });
  
  const { data: galleryImages, isLoading: loadingImages } = useQuery({
    queryKey: ['product_gallery', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('product_gallery')
        .select(`
          *,
          product_categories(id, category_name)
        `)
        .order('position', { ascending: true });
      
      if (selectedCategory && selectedCategory !== 'all-categories') {
        query = query.eq('category_id', selectedCategory);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  return {
    productCategories,
    galleryImages,
    loadingCategories,
    loadingImages,
  };
}
