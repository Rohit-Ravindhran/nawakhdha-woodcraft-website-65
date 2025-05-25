
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogData } from './types';

export function useBlogBySlug(slug?: string) {
  return useQuery({
    queryKey: ['blog_by_slug', slug],
    queryFn: async (): Promise<BlogData | null> => {
      if (!slug) {
        console.log('useBlogBySlug: No slug provided');
        return null;
      }
      
      console.log('useBlogBySlug: Searching for slug:', slug);
      
      // First try exact slug match
      console.log('useBlogBySlug: Querying blogs table...');
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug);
        
      console.log('useBlogBySlug: Blog query result:', {
        data: blogData,
        error: blogError,
        searchedSlug: slug,
        foundCount: blogData?.length || 0
      });
        
      if (!blogError && blogData && blogData.length > 0) {
        const blog = blogData[0];
        console.log('useBlogBySlug: Found blog:', blog);
        return blog as BlogData;
      }
      
      // If no exact match, try case-insensitive search
      console.log('useBlogBySlug: Trying case-insensitive search...');
      const { data: blogDataInsensitive, error: blogErrorInsensitive } = await supabase
        .from('blogs')
        .select('*')
        .ilike('slug', slug);
        
      console.log('useBlogBySlug: Case-insensitive search result:', {
        data: blogDataInsensitive,
        error: blogErrorInsensitive,
        foundCount: blogDataInsensitive?.length || 0
      });
        
      if (!blogErrorInsensitive && blogDataInsensitive && blogDataInsensitive.length > 0) {
        const blog = blogDataInsensitive[0];
        console.log('useBlogBySlug: Found blog with case-insensitive search:', blog);
        return blog as BlogData;
      }
      
      // Debug: Show available blog slugs
      const { data: allBlogs } = await supabase
        .from('blogs')
        .select('id, title, slug')
        .limit(10);
        
      console.log('useBlogBySlug: Available blogs for debugging:', {
        allBlogs,
        searchedFor: slug,
        availableSlugs: allBlogs?.map(b => b.slug)
      });
      
      console.log('useBlogBySlug: No blog found for slug:', slug);
      return null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false // Disable retry for faster debugging
  });
}
