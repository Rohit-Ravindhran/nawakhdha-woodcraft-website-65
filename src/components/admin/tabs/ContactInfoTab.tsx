
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useContactInfo, contactInfoSchema, ContactInfoFormValues } from "./contact/useContactInfo";
import ContactDetailsFields from "./contact/ContactDetailsFields";
import BusinessHoursField from "./contact/BusinessHoursField";
import MapUrlField from "./contact/MapUrlField";

export default function ContactInfoTab() {
  const { contactInfo, isLoading, isSaving, saveContactInfo } = useContactInfo();
  
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      address: contactInfo?.address || "",
      phone: contactInfo?.phone || "",
      email: contactInfo?.email || "",
      business_hours_json: typeof contactInfo?.business_hours_json === 'object' 
        ? JSON.stringify(contactInfo?.business_hours_json, null, 2) 
        : contactInfo?.business_hours_json || "",
      map_url: contactInfo?.map_url || "", // Add map_url default
    },
  });
  
  // Update form when data loads
  React.useEffect(() => {
    if (contactInfo) {
      console.log("📝 Admin form: Loading contact info into form:", contactInfo);
      form.reset({
        id: contactInfo.id,
        address: contactInfo.address || "",
        phone: contactInfo.phone || "",
        email: contactInfo.email || "",
        business_hours_json: typeof contactInfo.business_hours_json === 'object' 
          ? JSON.stringify(contactInfo.business_hours_json, null, 2) 
          : contactInfo.business_hours_json || "",
        map_url: contactInfo.map_url || "", // Include map_url in form reset
      });
    }
  }, [contactInfo, form]);
  
  const onSubmit = async (values: ContactInfoFormValues) => {
    console.log("📤 Admin form: Submitting values:", values);
    await saveContactInfo(values);
  };
  
  if (isLoading) return <div>Loading contact information...</div>;
  
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
          <ContactDetailsFields control={form.control} />
          <MapUrlField control={form.control} />
          <BusinessHoursField control={form.control} />
          
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
