import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProjectVideo {
  id: string;
  video_url: string;
  caption?: string;
  alt_text?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  position: number;
  page_slug?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  image_url: string;
  caption?: string;
  alt_text?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  position: number;
  page_slug?: string;
  created_at: string;
  updated_at: string;
}

// Fetch all project videos
export function useProjectsVideos(pageSlug: string = 'our-projects') {
  return useQuery({
    queryKey: ['projects-videos', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects_videos')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as ProjectVideo[];
    }
  });
}

// Fetch all project images
export function useProjectsImages(pageSlug: string = 'our-projects') {
  return useQuery({
    queryKey: ['projects-images', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects_images')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as ProjectImage[];
    }
  });
}

// Create project video
export function useCreateProjectVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (video: Omit<ProjectVideo, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects_videos')
        .insert(video)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-videos'] });
      toast.success('Video added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error adding video: ${error.message}`);
    }
  });
}

// Update project video
export function useUpdateProjectVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectVideo> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects_videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-videos'] });
      toast.success('Video updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error updating video: ${error.message}`);
    }
  });
}

// Delete project video
export function useDeleteProjectVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-videos'] });
      toast.success('Video deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting video: ${error.message}`);
    }
  });
}

// Create project image
export function useCreateProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: Omit<ProjectImage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects_images')
        .insert(image)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-images'] });
      toast.success('Image added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error adding image: ${error.message}`);
    }
  });
}

// Update project image
export function useUpdateProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectImage> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-images'] });
      toast.success('Image updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error updating image: ${error.message}`);
    }
  });
}

// Delete project image
export function useDeleteProjectImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-images'] });
      toast.success('Image deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting image: ${error.message}`);
    }
  });
}
