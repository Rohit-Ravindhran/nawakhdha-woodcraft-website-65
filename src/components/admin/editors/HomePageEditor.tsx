
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdatePage, PageData } from "@/hooks/content";
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
import { homePageSchema, HomePageFormValues } from "@/components/admin/PageSchemas";
import HeroSection from "@/components/admin/sections/HeroSection";
import ServicesSection from "@/components/admin/sections/ServicesSection";
import ProductsSection from "@/components/admin/sections/ProductsSection";
import BlogSection from "@/components/admin/sections/BlogSection";
import { BasicContentSection } from "@/components/admin/sections/BasicContentSection";
import { SeoSection } from "@/components/admin/sections/SeoSection";

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

  // Parse JSON fields if they are strings
  const parseJsonField = (field: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        return {};
      }
    }
    return field || {};
  };

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
      hero: JSON.stringify(parseJsonField(page?.hero)),
      services: JSON.stringify(parseJsonField(page?.services)),
      products: JSON.stringify(parseJsonField(page?.products)),
      blog: JSON.stringify(parseJsonField(page?.blog))
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
      hero: values.hero,
      services: values.services,
      products: values.products,
      blog: values.blog
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
          <BasicContentSection 
            control={form.control}
            isOpen={openSections.content}
            onToggle={() => toggleSection('content')}
          />
          
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
          <SeoSection
            control={form.control}
            isOpen={openSections.seo}
            onToggle={() => toggleSection('seo')}
          />
          
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
