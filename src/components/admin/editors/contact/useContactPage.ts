
import { useState, useEffect } from "react";
import { usePage, useUpdatePage, PageData } from "@/hooks/content";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Define the schema for Contact page
const contactPageSchema = z.object({
  title: z.string().min(1, "Page title is required"),
  subtitle: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email"),
  map_url: z.string().optional(),
  form_title: z.string().optional(),
  form_description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  seo_canonical_url: z.string().optional(),
  seo_image_alt: z.string().optional(),
});

export type ContactPageFormValues = z.infer<typeof contactPageSchema>;

export function useContactPage() {
  const { data: page, isLoading } = usePage("contact");
  const updatePage = useUpdatePage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    contact: false,
    form: false,
    seo: false
  });

  // Initialize form with page data or default values
  const form = useForm<ContactPageFormValues>({
    resolver: zodResolver(contactPageSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      address: "",
      phone: "",
      email: "",
      map_url: "",
      form_title: "",
      form_description: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      seo_canonical_url: "",
      seo_image_alt: "",
    },
  });

  // Update form when page data loads
  useEffect(() => {
    if (page) {
      // Parse stored JSON data if needed
      let contactData = page;
      try {
        if (page.content && typeof page.content === 'string') {
          const contentData = JSON.parse(page.content);
          contactData = { ...page, ...contentData };
        }
      } catch (e) {
        console.error("Error parsing contact page JSON data:", e);
      }

      form.reset({
        title: contactData.title || "Contact Us",
        subtitle: contactData.subtitle || "Get in touch with us",
        address: contactData.address || "Building 123, Road 456, Block 789, Manama, Bahrain",
        phone: contactData.phone || "+973 1234 5678",
        email: contactData.email || "info@nawakhdha.com",
        map_url: contactData.map_url || "",
        form_title: contactData.form_title || "Send us a message",
        form_description: contactData.form_description || "Fill out the form below and we'll get back to you as soon as possible.",
        seo_title: contactData.seo_title || "",
        seo_description: contactData.seo_description || "",
        seo_keywords: contactData.seo_keywords || "",
        seo_canonical_url: contactData.seo_canonical_url || "",
        seo_image_alt: contactData.seo_image_alt || "",
      });
    }
  }, [page, form]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = (values: ContactPageFormValues) => {
    // Serialize content fields to JSON
    const contentData = {
      subtitle: values.subtitle,
      address: values.address,
      phone: values.phone,
      email: values.email,
      map_url: values.map_url,
      form_title: values.form_title,
      form_description: values.form_description,
    };

    const updatedPage: PageData = {
      id: page?.id,
      page_name: "contact",
      title: values.title,
      content: JSON.stringify(contentData),
      seo_title: values.seo_title || "",
      seo_description: values.seo_description || "",
      seo_keywords: values.seo_keywords || "",
      seo_canonical_url: values.seo_canonical_url || "",
      seo_image_alt: values.seo_image_alt || "",
    };
    
    updatePage.mutate(updatedPage, {
      onSuccess: () => {
        toast.success(`Contact page saved successfully`);
      },
      onError: (error) => {
        toast.error(`Error saving page: ${error.message}`);
      }
    });
  };

  return {
    form,
    page,
    isLoading, 
    updatePage,
    openSections,
    toggleSection,
    onSubmit
  };
}
