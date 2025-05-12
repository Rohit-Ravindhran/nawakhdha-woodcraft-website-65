
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContactInfoData } from "@/hooks/content/types";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const contactInfoSchema = z.object({
  id: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.string().length(0)),
  business_hours_json: z.string().optional(),
});

export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

export function useContactInfo() {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: contactInfo, isLoading } = useQuery({
    queryKey: ['contact_info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle();
        
      if (error) throw error;
      return data as ContactInfoData;
    },
  });
  
  const saveContactInfo = async (values: ContactInfoFormValues) => {
    try {
      setIsSaving(true);
      
      let businessHours;
      try {
        // Attempt to parse the JSON if it's not empty
        businessHours = values.business_hours_json ? JSON.parse(values.business_hours_json) : null;
      } catch (error) {
        toast.error("Invalid JSON in business hours. Please check the format.");
        setIsSaving(false);
        return;
      }
      
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('contact_info')
          .update({
            address: values.address,
            phone: values.phone,
            email: values.email,
            business_hours_json: businessHours,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Contact information updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('contact_info')
          .insert({
            address: values.address,
            phone: values.phone,
            email: values.email,
            business_hours_json: businessHours,
          });
          
        if (error) throw error;
        toast.success("Contact information added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['contact_info'] });
    } catch (error: any) {
      toast.error(`Error saving contact information: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    contactInfo,
    isLoading,
    isSaving,
    saveContactInfo
  };
}
