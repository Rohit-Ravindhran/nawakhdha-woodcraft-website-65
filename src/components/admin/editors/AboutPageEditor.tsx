
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePage, useUpdatePage, PageData } from "@/hooks/content";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SeoFields from "@/components/admin/SeoFields";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";

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

type AboutPageFormValues = z.infer<typeof aboutPageSchema>;

interface AboutPageEditorProps {}

export default function AboutPageEditor({}: AboutPageEditorProps) {
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

  const handleHeaderImageUploaded = (url: string, alt: string) => {
    form.setValue("header_image", url);
    form.setValue("header_image_alt", alt);
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">Edit About Page</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Page Info */}
          <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Basic Page Information</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.basic ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="About Us" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-4">
                <FormLabel>Header Image</FormLabel>
                <EnhancedImageUploader
                  onImageUploaded={handleHeaderImageUploaded}
                  bucket="pages"
                  folder="about"
                  initialImageUrl={form.watch("header_image")}
                  initialAltText={form.watch("header_image_alt")}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Company Information */}
          <Collapsible open={openSections.company} onOpenChange={() => toggleSection('company')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Company Information</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.company ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1 space-y-4">
              <FormField
                control={form.control}
                name="since_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1975" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company_story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Story</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5}
                        placeholder="Share the story of your company..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Statement</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        placeholder="Our mission is to..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        placeholder="Our vision is to..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
          
          {/* SEO Settings */}
          <Collapsible open={openSections.seo} onOpenChange={() => toggleSection('seo')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>SEO Settings</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.seo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1">
              <SeoFields control={form.control} />
            </CollapsibleContent>
          </Collapsible>
          
          <Button 
            type="submit" 
            disabled={updatePage.isPending}
            className="mt-6"
          >
            {updatePage.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
