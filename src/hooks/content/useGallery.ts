
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GalleryImageData } from './types';

// Gallery
export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useAddGalleryImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageData: GalleryImageData) => {
      const { data, error } = await supabase
        .from('gallery')
        .insert(imageData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery image added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error adding gallery image: ${error.message}`);
    }
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageId: number) => {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', imageId);
        
      if (error) throw error;
      return imageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery image deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting gallery image: ${error.message}`);
    }
  });
}
