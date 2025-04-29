
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePage, useUpdatePage, PageData } from "@/hooks/useContent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { homePageSchema, HomePageFormValues } from "@/components/admin/PageSchemas";
import HeroSection from "@/components/admin/sections/HeroSection";
import ServicesSection from "@/components/admin/sections/ServicesSection";
import ProductsSection from "@/components/admin/sections/ProductsSection";
import BlogSection from "@/components/admin/sections/BlogSection";

interface HomePageEditorProps {
  page: PageData | null;
  isLoading: boolean;
}

export default function HomePageEditor({ page, isLoading }: HomePageEditorProps) {
  const updatePage = useUpdatePage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    hero: false, 
    services: false,
    products: false,
    blog: false,
    seo: false
  });

  // Initialize form with page data or default values
  const form = useForm<HomePageFormValues>({
    resolver: zodResolver(homePageSchema),
    defaultValues: {
      title: page?.title || "",
      content: page?.content || "",
      seo_title: page?.seo_title || "",
      seo_description: page?.seo_description || "",
      seo_keywords: page?.seo_keywords || "",
      seo_canonical_url: page?.seo_canonical_url || "",
      seo_image_alt: page?.seo_image_alt || "",
      hero: page?.hero ? 
        (typeof page.hero === 'string' ? JSON.parse(page.hero) : page.hero) : 
        {
          background_image: "",
          background_image_alt: "",
          headline: "",
          subheadline: "",
          button_text: "",
          button_link: ""
        },
      services: page?.services ? 
        (typeof page.services === 'string' ? JSON.parse(page.services) : page.services) : 
        {
          section_title: "Our Services",
          items: Array(4).fill({
            image: "", 
            image_alt: "",
            title: "", 
            description: ""
          })
        },
      products: page?.products ? 
        (typeof page.products === 'string' ? JSON.parse(page.products) : page.products) : 
        {
          section_title: "Our Products",
          items: Array(4).fill({
            image: "", 
            image_alt: "",
            title: "", 
            description: "",
            link: ""
          })
        },
      blog: page?.blog ? 
        (typeof page.blog === 'string' ? JSON.parse(page.blog) : page.blog) : 
        {
          section_title: "From Our Workshop Blog",
          items: Array(3).fill({
            image: "", 
            image_alt: "",
            title: "", 
            excerpt: "",
            link: ""
          })
        }
    },
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = (values: HomePageFormValues) => {
    const updatedPage: PageData = {
      id: page?.id,
      page_name: "home",
      title: values.title,
      content: values.content,
      seo_title: values.seo_title || "",
      seo_description: values.seo_description || "",
      seo_keywords: values.seo_keywords || "",
      seo_canonical_url: values.seo_canonical_url || "",
      seo_image_alt: values.seo_image_alt || "",
      hero: JSON.stringify(values.hero),
      services: JSON.stringify(values.services),
      products: JSON.stringify(values.products),
      blog: JSON.stringify(values.blog)
    };
    
    updatePage.mutate(updatedPage, {
      onSuccess: () => {
        toast.success(`Home page saved successfully`);
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
      <h3 className="text-xl font-semibold mb-4">Edit Home Page</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Page Info */}
          <Collapsible open={openSections.content} onOpenChange={() => toggleSection('content')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Basic Page Information</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.content ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Main Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Hero Section */}
          <HeroSection 
            control={form.control}
            isOpen={openSections.hero}
            onToggle={() => toggleSection('hero')}
            watch={form.watch}
            setValue={form.setValue}
          />
          
          {/* Services Section */}
          <ServicesSection 
            control={form.control}
            isOpen={openSections.services}
            onToggle={() => toggleSection('services')}
            watch={form.watch}
            setValue={form.setValue}
          />
          
          {/* Products Section */}
          <ProductsSection
            control={form.control}
            isOpen={openSections.products}
            onToggle={() => toggleSection('products')}
            watch={form.watch}
            setValue={form.setValue}
          />
          
          {/* Blog Section */}
          <BlogSection
            control={form.control}
            isOpen={openSections.blog}
            onToggle={() => toggleSection('blog')}
            watch={form.watch}
            setValue={form.setValue}
          />
          
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
