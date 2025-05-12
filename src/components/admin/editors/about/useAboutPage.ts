
import { useState, useEffect } from "react";
import { usePage, useUpdatePage, PageData } from "@/hooks/content";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Define the schema for About page
const aboutPageSchema = z.object({
  title: z.string().min(1, "Page title is required"),
  content: z.string().min(1, "Page content is required"),
  header_image: z.string().optional(),
  header_image_alt: z.string().optional(),
  company_story: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  since_year: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  seo_canonical_url: z.string().optional(),
  seo_image_alt: z.string().optional(),
});

export type AboutPageFormValues = z.infer<typeof aboutPageSchema>;

export function useAboutPage() {
  const { data: page, isLoading } = usePage("about");
  const updatePage = useUpdatePage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    company: false,
    seo: false
  });

  // Initialize form with page data or default values
  const form = useForm<AboutPageFormValues>({
    resolver: zodResolver(aboutPageSchema),
    defaultValues: {
      title: "",
      content: "",
      header_image: "",
      header_image_alt: "",
      company_story: "",
      mission: "",
      vision: "",
      since_year: "",
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
      let aboutData = page;
      try {
        if (page.content && typeof page.content === 'string') {
          const contentData = JSON.parse(page.content);
          aboutData = { ...page, ...contentData };
        }
      } catch (e) {
        console.error("Error parsing about page JSON data:", e);
      }

      form.reset({
        title: aboutData.title || "About Us",
        content: aboutData.content || "",
        header_image: aboutData.header_image || "",
        header_image_alt: aboutData.header_image_alt || "",
        company_story: aboutData.company_story || "",
        mission: aboutData.mission || "",
        vision: aboutData.vision || "",
        since_year: aboutData.since_year || "1975",
        seo_title: aboutData.seo_title || "",
        seo_description: aboutData.seo_description || "",
        seo_keywords: aboutData.seo_keywords || "",
        seo_canonical_url: aboutData.seo_canonical_url || "",
        seo_image_alt: aboutData.seo_image_alt || "",
      });
    }
  }, [page, form]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = (values: AboutPageFormValues) => {
    // Serialize content fields to JSON
    const contentData = {
      header_image: values.header_image,
      header_image_alt: values.header_image_alt,
      company_story: values.company_story,
      mission: values.mission,
      vision: values.vision,
      since_year: values.since_year,
    };

    const updatedPage: PageData = {
      id: page?.id,
      page_name: "about",
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
        toast.success(`About page saved successfully`);
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
