import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContentChangeRequest } from './useContentChangeRequests';

// Content section mapping for each page
export const CONTENT_SECTIONS = {
  'interior-fitouts-bahrain': {
    'hero-title': {
      selector: 'h1',
      description: 'Main page title',
      currentContent: 'Interior Fit Out Company Bahrain | Commercial & Residential Fit Out Services',
      contentType: 'heading'
    },
    'hero-description': {
      selector: 'hero section p',
      description: 'Hero section description',
      currentContent: 'Al Nawakhdha Furnitures is a leading interior fit out company Bahrain based in Nuwaidrat...',
      contentType: 'description'
    },
    'meta-description': {
      selector: 'meta[name="description"]',
      description: 'SEO meta description',
      currentContent: 'Leading interior fit out company Bahrain | Al Nawakhdha Furnitures offers comprehensive fit out works...',
      contentType: 'meta-tags'
    },
    'json-ld-description': {
      selector: 'JSON-LD schema description',
      description: 'Structured data description',
      currentContent: 'Full-service interior fit-outs and bespoke furniture manufacturing in Bahrain: design, joinery, installation, project management and MEP integration for residential, commercial and hospitality sectors.',
      contentType: 'json-ld'
    },
    'features-list': {
      selector: 'features array',
      description: 'List of service features',
      currentContent: 'Array of 5 feature descriptions',
      contentType: 'description'
    },
    'sectors-content': {
      selector: 'sectors array',
      description: 'Service sectors descriptions',
      currentContent: 'Residential, Commercial, Hospitality, Healthcare sectors',
      contentType: 'description'
    },
    'unique-points': {
      selector: 'uniquePoints array',
      description: 'What sets us apart points',
      currentContent: 'Array of 5 unique selling points',
      contentType: 'description'
    },
    'cta-content': {
      selector: 'CTA section',
      description: 'Call-to-action section content',
      currentContent: 'Ready to Transform Your Space? Contact us today...',
      contentType: 'description'
    },
    'seo-keywords': {
      selector: 'meta[name="keywords"]',
      description: 'SEO keywords',
      currentContent: 'interior fit out company bahrain, fit out companies in bahrain...',
      contentType: 'meta-tags'
    }
  },
  'home': {
    'hero-title': {
      selector: 'h1',
      description: 'Homepage main title',
      currentContent: 'Homepage hero title'
    },
    'hero-subtitle': {
      selector: 'hero subtitle',
      description: 'Homepage subtitle',
      currentContent: 'Homepage hero subtitle'
    }
  },
  'about': {
    'company-story': {
      selector: 'about story section',
      description: 'Company story content',
      currentContent: 'About us story content'
    }
  },
  'contact': {
    'contact-description': {
      selector: 'contact description',
      description: 'Contact page description',
      currentContent: 'Contact page description'
    }
  }
} as const;

export type PageSlug = keyof typeof CONTENT_SECTIONS;
export type SectionIdentifier<T extends PageSlug> = keyof typeof CONTENT_SECTIONS[T];

export function useApplyContentChange() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      // First, get the content change request
      const { data: request, error: fetchError } = await supabase
        .from('content_change_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error('Content change request not found');

      // Validate that we can apply this change
      const pageSlug = request.page_slug as PageSlug;
      const sectionId = request.section_identifier as SectionIdentifier<typeof pageSlug>;
      
      if (!CONTENT_SECTIONS[pageSlug] || !CONTENT_SECTIONS[pageSlug][sectionId]) {
        throw new Error(`Unknown content section: ${pageSlug}.${sectionId}`);
      }

      // Store the original content before applying change
      const section = (CONTENT_SECTIONS[pageSlug] as any)[sectionId];
      const originalContent = section?.currentContent || request.current_content;

      // Update the content change request with application details
      const { error: updateError } = await supabase
        .from('content_change_requests')
        .update({
          status: 'approved',
          applied_at: new Date().toISOString(),
          original_content_before_change: originalContent,
          can_rollback: true
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Apply the actual content change to the page_content table
      const { error: contentUpdateError } = await supabase
        .from('page_content')
        .upsert({
          page_slug: request.page_slug,
          section_identifier: request.section_identifier,
          content_type: request.content_type,
          content_value: request.proposed_content,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'page_slug,section_identifier' 
        });

      if (contentUpdateError) throw contentUpdateError;
      
      return { request, originalContent, newContent: request.proposed_content };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content-change-requests'] });
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-section'] });
      toast.success(`Content applied successfully! Section "${data.request.section_identifier}" has been updated.`);
    },
    onError: (error: Error) => {
      console.error('Apply content change failed', { error });
      toast.error(`Failed to apply content change: ${error.message}`);
    }
  });
}

export function useGetContentSection(pageSlug: string, sectionIdentifier: string) {
  const typedPageSlug = pageSlug as PageSlug;
  
  if (!CONTENT_SECTIONS[typedPageSlug]) {
    return {
      section: null,
      exists: false,
      description: '',
      currentContent: '',
      selector: ''
    };
  }
  
  // Get the sections for this page
  const pageSections = CONTENT_SECTIONS[typedPageSlug];
  const section = (pageSections as any)[sectionIdentifier];
  
  return {
    section,
    exists: !!section,
    description: section?.description || '',
    currentContent: section?.currentContent || '',
    selector: section?.selector || ''
  };
}

// Helper function to get all available sections for a page, optionally filtered by content type
export function getPageSections(pageSlug: string, contentType?: string) {
  const typedPageSlug = pageSlug as PageSlug;
  const sections = CONTENT_SECTIONS[typedPageSlug];
  
  if (!sections) return [];
  
  return Object.entries(sections)
    .filter(([key, value]) => !contentType || (value as any).contentType === contentType)
    .map(([key, value]) => ({
      id: key,
      description: (value as any).description,
      selector: (value as any).selector,
      currentContent: (value as any).currentContent,
      contentType: (value as any).contentType
    }));
}