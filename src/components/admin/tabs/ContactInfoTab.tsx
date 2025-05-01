
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContactInfoData } from "@/hooks/content/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";

const contactInfoSchema = z.object({
  id: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.string().length(0)),
  business_hours_json: z.string().optional(),
});

type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

export default function ContactInfoTab() {
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
  
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      address: contactInfo?.address || "",
      phone: contactInfo?.phone || "",
      email: contactInfo?.email || "",
      business_hours_json: typeof contactInfo?.business_hours_json === 'object' 
        ? JSON.stringify(contactInfo?.business_hours_json, null, 2) 
        : contactInfo?.business_hours_json || "",
    },
  });
  
  // Update form when data loads
  React.useEffect(() => {
    if (contactInfo) {
      form.reset({
        id: contactInfo.id,
        address: contactInfo.address || "",
        phone: contactInfo.phone || "",
        email: contactInfo.email || "",
        business_hours_json: typeof contactInfo.business_hours_json === 'object' 
          ? JSON.stringify(contactInfo.business_hours_json, null, 2) 
          : contactInfo.business_hours_json || "",
      });
    }
  }, [contactInfo, form]);
  
  const onSubmit = async (values: ContactInfoFormValues) => {
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
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <p className="text-gray-500 mt-1">
          Update the contact information displayed on the contact page.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Full address" {...field} rows={3} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="business_hours_json"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Hours (JSON Format)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={`{
  "monday": "9:00 AM - 5:00 PM",
  "tuesday": "9:00 AM - 5:00 PM",
  "wednesday": "9:00 AM - 5:00 PM",
  "thursday": "9:00 AM - 5:00 PM",
  "friday": "9:00 AM - 4:00 PM",
  "saturday": "Closed",
  "sunday": "Closed"
}`} 
                    {...field} 
                    rows={10}
                    className="font-mono text-sm"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" className="flex items-center" disabled={isSaving}>
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Contact Information
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
