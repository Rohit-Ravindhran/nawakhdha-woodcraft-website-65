
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BlogData } from './types';

// Blogs
export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useBlog(blogId?: number) {
  return useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!blogId) return null;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!blogId
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogData: BlogData) => {
      const { id, ...blogFields } = blogData;
      
      if (id) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogFields)
          .eq('id', id);
          
        if (error) throw error;
        return { ...blogData, id };
      } else {
        // Insert new blog
        const { data, error } = await supabase
          .from('blogs')
          .insert(blogFields)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', data.id] });
      toast.success(`Blog post "${data.title}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating blog post: ${error.message}`);
    }
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogId: number) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);
        
      if (error) throw error;
      return blogId;
    },
    onSuccess: (blogId) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
      toast.success(`Blog post deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting blog post: ${error.message}`);
    }
  });
}
