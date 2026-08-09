
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PageData } from './types';
// Columns that actually exist on the `pages` table
const PAGE_COLUMNS = ['page_name', 'hero', 'seo_title', 'seo_description', 'seo_keywords'] as const;

type PageRow = Partial<Record<(typeof PAGE_COLUMNS)[number], string | null>>;

const pickPageColumns = (data: Record<string, unknown>): PageRow => {
  const row: PageRow = {};
  for (const key of PAGE_COLUMNS) {
    if (data[key] !== undefined) row[key] = data[key] as string | null;
  }
  return row;
};


// Pages
export function usePage(pageName: string) {
  return useQuery({
    queryKey: ['page', pageName],
    queryFn: async () => {
      // Changed from .single() to .maybeSingle() to handle the case of no rows
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_name', pageName)
        .maybeSingle();

      if (error) throw error;
      // Using type assertion with as to ensure proper type conversion
      return data as unknown as PageData;
    }
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: PageData) => {
      const { id, ...pageFields } = pageData;
      const row = pickPageColumns(pageFields as Record<string, unknown>);

      if (id) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update(row)
          .eq('id', id);

        if (error) throw error;
        return pageData;
      } else {
        // Insert new page
        const { data, error } = await supabase
          .from('pages')
          .insert(row)
          .select()
          .single();

        if (error) throw error;
        return data as unknown as PageData;
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
