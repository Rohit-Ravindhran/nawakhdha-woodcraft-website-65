import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useApplyContentChange } from './useContentApplication';

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
  original_content_before_change?: string;
  can_rollback?: boolean;
  rollback_of_request_id?: string;
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
  const applyContentChange = useApplyContentChange();

  return useMutation({
    mutationFn: async ({ 
      id, 
      scheduledAt, 
      applyImmediately = false 
    }: { 
      id: string; 
      scheduledAt?: string; 
      applyImmediately?: boolean; 
    }) => {
      if (applyImmediately) {
        // Apply the content change immediately
        await applyContentChange.mutateAsync(id);
        return { id, applied: true };
      } else {
        // Just approve without applying
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
        return { id, applied: false, data };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['content-change-requests'] });
      
      if (result.applied) {
        toast({
          title: "Content Applied",
          description: "The content change has been approved and applied to the live site.",
        });
      } else {
        toast({
          title: "Content Change Approved",
          description: "The content change has been approved successfully.",
        });
      }
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

export const useRollbackContentChange = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (originalRequestId: string) => {
      // First get the original request to create rollback
      const { data: originalRequest, error: fetchError } = await supabase
        .from('content_change_requests')
        .select('*')
        .eq('id', originalRequestId)
        .single();

      if (fetchError) throw fetchError;

      // Create rollback request
      const rollbackRequest = {
        page_slug: originalRequest.page_slug,
        page_title: originalRequest.page_title,
        content_type: originalRequest.content_type,
        section_identifier: originalRequest.section_identifier,
        current_content: originalRequest.proposed_content, // Current is now the proposed from original
        proposed_content: originalRequest.original_content_before_change || originalRequest.current_content, // Rollback to original
        change_reason: `Rollback of change made on ${new Date(originalRequest.applied_at || originalRequest.reviewed_at).toLocaleDateString()}`,
        status: 'approved', // Auto-approve rollbacks
        reviewed_at: new Date().toISOString(),
        applied_at: new Date().toISOString(),
        rollback_of_request_id: originalRequestId,
        can_rollback: true,
        original_content_before_change: originalRequest.proposed_content
      };

      const { data, error } = await supabase
        .from('content_change_requests')
        .insert([rollbackRequest])
        .select()
        .single();

      if (error) throw error;

      // Mark original request as rolled back (can't rollback anymore)
      await supabase
        .from('content_change_requests')
        .update({ can_rollback: false })
        .eq('id', originalRequestId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-change-requests'] });
      toast({
        title: "Content Rolled Back",
        description: "The content has been successfully rolled back to its previous state.",
      });
    },
    onError: (error) => {
      toast({
        title: "Rollback Failed",
        description: "Failed to rollback content change: " + error.message,
        variant: "destructive",
      });
    },
  });
};