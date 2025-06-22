
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceCategoryDetailData } from "./types";

export function useMaintenanceDetails() {
  return useQuery({
    queryKey: ['maintenance_category_details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_category_details')
        .select(`
          *,
          maintenance_categories(id, category_name)
        `);
        
      if (error) throw error;
      return data;
    },
  });
}

export function useMaintenanceDetailsByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['maintenance_category_details', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from('maintenance_category_details')
        .select('*')
        .eq('category_id', categoryId)
        .maybeSingle();
        
      if (error) throw error;
      return data as MaintenanceCategoryDetailData | null;
    },
    enabled: !!categoryId,
  });
}
