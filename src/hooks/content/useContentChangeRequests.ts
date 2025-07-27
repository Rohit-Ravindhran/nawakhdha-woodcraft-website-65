import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ContentChangeRequest {
  id: string;
  page_slug: string;
  page_title: string;
  content_type: string;
  section_identifier: string;
  current_content: string;
  proposed_content: string;
  change_reason?: string;
  seo_keywords_added?: string[];
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  scheduled_publish_at?: string;
  applied_at?: string;
}

export const useContentChangeRequests = () => {
  return useQuery({
    queryKey: ['content-change-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_change_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContentChangeRequest[];
    },
  });
};

export const usePendingContentChangeRequests = () => {
  return useQuery({
    queryKey: ['content-change-requests', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_change_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContentChangeRequest[];
    },
  });
};

export const useApproveContentChange = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, scheduledAt }: { id: string; scheduledAt?: string }) => {
      const { data, error } = await supabase
        .from('content_change_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          scheduled_publish_at: scheduledAt,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-change-requests'] });
      toast({
        title: "Content Change Approved",
        description: "The content change has been approved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve content change: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeclineContentChange = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('content_change_requests')
        .update({
          status: 'declined',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-change-requests'] });
      toast({
        title: "Content Change Declined",
        description: "The content change has been declined.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to decline content change: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateContentChangeRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: Omit<ContentChangeRequest, 'id' | 'created_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('content_change_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-change-requests'] });
      toast({
        title: "Content Change Request Created",
        description: "A new content change request has been created for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create content change request: " + error.message,
        variant: "destructive",
      });
    },
  });
};