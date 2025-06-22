
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceCategoryData } from "./types";

export function useMaintenanceCategories() {
  return useQuery({
    queryKey: ['maintenance_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_categories')
        .select('*')
        .order('category_name');
        
      if (error) throw error;
      return data as MaintenanceCategoryData[];
    },
  });
}

export function useMaintenanceCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['maintenance_category', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('maintenance_categories')
        .select('*')
        .eq('category_slug', slug)
        .maybeSingle();
        
      if (error) throw error;
      return data as MaintenanceCategoryData | null;
    },
    enabled: !!slug,
  });
}
