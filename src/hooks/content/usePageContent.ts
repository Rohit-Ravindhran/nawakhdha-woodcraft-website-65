import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PageContent {
  id: string;
  page_slug: string;
  section_identifier: string;
  content_type: string;
  content_value: string;
  created_at: string;
  updated_at: string;
}

export function usePageContent(pageSlug: string, sectionIdentifier?: string) {
  return useQuery({
    queryKey: ['page-content', pageSlug, sectionIdentifier],
    queryFn: async (): Promise<PageContent | PageContent[] | null> => {
      let query = supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug);
      
      if (sectionIdentifier) {
        query = query.eq('section_identifier', sectionIdentifier);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // If looking for specific section, return single item or null
      if (sectionIdentifier) {
        return (data?.[0] as PageContent) || null;
      }
      
      // Otherwise return all content for the page
      return (data as PageContent[]) || [];
    },
  });
}

// Hook specifically for single content items
export function usePageContentSection(pageSlug: string, sectionIdentifier: string) {
  return useQuery({
    queryKey: ['page-content-section', pageSlug, sectionIdentifier],
    queryFn: async (): Promise<PageContent | null> => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('section_identifier', sectionIdentifier)
        .maybeSingle();
      
      if (error) throw error;
      return data as PageContent | null;
    },
  });
}

export function useUpdatePageContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      pageSlug, 
      sectionIdentifier, 
      contentValue,
      contentType 
    }: { 
      pageSlug: string; 
      sectionIdentifier: string; 
      contentValue: string;
      contentType: string;
    }) => {
      const { data, error } = await supabase
        .from('page_content')
        .upsert({
          page_slug: pageSlug,
          section_identifier: sectionIdentifier,
          content_type: contentType,
          content_value: contentValue,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'page_slug,section_identifier' 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch page content
      queryClient.invalidateQueries({ 
        queryKey: ['page-content', data.page_slug] 
      });
      toast.success('Content updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update content: ${error.message}`);
    }
  });
}
