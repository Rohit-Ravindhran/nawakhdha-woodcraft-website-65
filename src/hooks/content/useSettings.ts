
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SettingsData } from './types';

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1) // Assuming settings are stored with id = 1
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as SettingsData;
    }
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settingsData: SettingsData) => {
      if (settingsData.id) {
        // Update existing settings
        const { error } = await supabase
          .from('settings')
          .update({
            background_color: settingsData.background_color,
            site_title: settingsData.site_title,
            site_description: settingsData.site_description,
            site_keywords: settingsData.site_keywords,
            favicon_url: settingsData.favicon_url
          })
          .eq('id', settingsData.id);
          
        if (error) throw error;
        return settingsData;
      } else {
        // Insert new settings with id = 1
        const { data, error } = await supabase
          .from('settings')
          .insert({
            id: 1,
            background_color: settingsData.background_color,
            site_title: settingsData.site_title,
            site_description: settingsData.site_description,
            site_keywords: settingsData.site_keywords,
            favicon_url: settingsData.favicon_url
          })
          .select()
          .single();
          
        if (error) throw error;
        return data as SettingsData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Site settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error updating site settings: ${error.message}`);
    }
  });
}
