
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PageData } from './types';

// Pages
export function usePage(pageName: string) {
  return useQuery({
    queryKey: ['page', pageName],
    queryFn: async () => {
      // Changed from .single() to .maybeSingle() to handle the case of no rows
      // or first() to handle the case of multiple rows
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_name', pageName)
        .maybeSingle();

      if (error) throw error;
      return data as PageData;
    }
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: PageData) => {
      const { id, ...pageFields } = pageData;
      
      if (id) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update(pageFields)
          .eq('id', id);
          
        if (error) throw error;
        return pageData;
      } else {
        // Insert new page
        const { data, error } = await supabase
          .from('pages')
          .insert(pageFields)
          .select()
          .single();
          
        if (error) throw error;
        return data as PageData;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page', data.page_name] });
      toast.success(`Page "${data.page_name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating page: ${error.message}`);
    }
  });
}
