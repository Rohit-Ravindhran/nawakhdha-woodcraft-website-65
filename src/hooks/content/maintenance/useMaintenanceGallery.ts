
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceGalleryImage } from "./types";

export function useMaintenanceGallery(selectedCategory?: string | null) {
  return useQuery({
    queryKey: ['maintenance_gallery', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_gallery')
        .select(`
          *,
          maintenance_categories(category_name)
        `)
        .order('position');
      
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as MaintenanceGalleryImage[];
    },
  });
}

export function useMaintenanceGalleryByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['maintenance_gallery', 'category', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      const { data, error } = await supabase
        .from('maintenance_gallery')
        .select('*')
        .eq('category_id', categoryId)
        .order('position');
        
      if (error) throw error;
      return data as MaintenanceGalleryImage[];
    },
    enabled: !!categoryId,
  });
}
