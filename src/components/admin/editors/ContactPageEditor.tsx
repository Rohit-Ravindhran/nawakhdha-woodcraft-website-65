
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
import { Loader2, ChevronDown, ChevronUp, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SeoFields from "@/components/admin/SeoFields";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";

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

type ContactPageFormValues = z.infer<typeof contactPageSchema>;

interface ContactPageEditorProps {}

export default function ContactPageEditor({}: ContactPageEditorProps) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">Edit Contact Page</h3>
      
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
                      <Input {...field} placeholder="Contact Us" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Get in touch with us" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Contact Information */}
          <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Contact Information</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.contact ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1 space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" /> Address
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={2}
                        placeholder="Building 123, Road 456, Block 789, Manama, Bahrain"
                      />
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
                    <FormLabel className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" /> Phone
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+973 1234 5678" />
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
                    <FormLabel className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="info@nawakhdha.com" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="map_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps Embed URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://www.google.com/maps/embed?pb=..." 
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground mt-1">
                      Paste the embed URL from Google Maps (iframe src attribute)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("map_url") && (
                <div className="border rounded-md p-2 mt-4">
                  <p className="text-sm font-medium mb-2">Map Preview:</p>
                  <iframe
                    src={form.watch("map_url")}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Contact Form Settings */}
          <Collapsible open={openSections.form} onOpenChange={() => toggleSection('form')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Contact Form Settings</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.form ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1 space-y-4">
              <FormField
                control={form.control}
                name="form_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Send us a message" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="form_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        placeholder="Fill out the form below and we'll get back to you as soon as possible."
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
