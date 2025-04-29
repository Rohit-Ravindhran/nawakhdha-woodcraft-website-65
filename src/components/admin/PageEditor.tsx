
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePage, useUpdatePage, PageData } from "@/hooks/useContent";
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
import { 
  getPageSchemaByName, 
  getDefaultValues, 
  HomePageFormValues,
  BasePageFormValues,
  AboutPageFormValues,
  ContactPageFormValues
} from "@/components/admin/PageSchemas";

interface PageEditorProps {
  pageName: string;
}

type PageFormValues = HomePageFormValues | BasePageFormValues | AboutPageFormValues | ContactPageFormValues;

export default function PageEditor({ pageName }: PageEditorProps) {
  const { data: page, isLoading, error } = usePage(pageName);
  const updatePage = useUpdatePage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    hero: false, 
    services: false,
    products: false,
    blog: false,
    team: false,
    contacts: false,
    seo: false
  });
  
  // Use different schema based on page type
  const pageSchema = getPageSchemaByName(pageName);
  
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: getDefaultValues(pageName),
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (page) {
      // Parse JSON fields if they exist
      try {
        const parsedPage: any = {
          ...page,
          // Parse JSON fields if they are strings
          hero: page.hero ? 
            (typeof page.hero === 'string' ? JSON.parse(page.hero) : page.hero) : 
            form.getValues().hero,
          services: page.services ? 
            (typeof page.services === 'string' ? JSON.parse(page.services) : page.services) : 
            form.getValues().services,
          products: page.products ? 
            (typeof page.products === 'string' ? JSON.parse(page.products) : page.products) : 
            form.getValues().products,
          blog: page.blog ? 
            (typeof page.blog === 'string' ? JSON.parse(page.blog) : page.blog) : 
            form.getValues().blog
        };
        
        // Reset form with values from database
        form.reset({
          title: parsedPage.title || "",
          content: parsedPage.content || "",
          seo_title: parsedPage.seo_title || "",
          seo_description: parsedPage.seo_description || "",
          seo_keywords: parsedPage.seo_keywords || "",
          seo_canonical_url: parsedPage.seo_canonical_url || "",
          seo_image_alt: parsedPage.seo_image_alt || "",
          ...(pageName === "home" && {
            hero: parsedPage.hero,
            services: parsedPage.services,
            products: parsedPage.products,
            blog: parsedPage.blog
          }),
          // Add other page-specific fields as needed
        });
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
  }, [page, form, pageName]);

  const onSubmit = (values: PageFormValues) => {
    // Ensure all required fields have values
    const updatedPage: PageData = {
      id: page?.id,
      page_name: pageName,
      title: values.title,
      content: values.content,
      seo_title: values.seo_title || "",
      seo_description: values.seo_description || "",
      seo_keywords: values.seo_keywords || "",
      seo_canonical_url: (values as any).seo_canonical_url || "",
      seo_image_alt: values.seo_image_alt || "",
    };
    
    // Only add homepage-specific fields if this is the home page
    if (pageName === "home") {
      const homeValues = values as HomePageFormValues;
      
      updatedPage.hero = JSON.stringify(homeValues.hero);
      updatedPage.services = JSON.stringify(homeValues.services);
      updatedPage.products = JSON.stringify(homeValues.products);
      updatedPage.blog = JSON.stringify(homeValues.blog);
    }
    
    updatePage.mutate(updatedPage, {
      onSuccess: () => {
        toast.success(`Page "${pageName}" saved successfully`);
      },
      onError: (error) => {
        toast.error(`Error saving page: ${error.message}`);
      }
    });
  };

  const handleHeroImageUploaded = (url: string, alt: string) => {
    if (pageName !== "home") return;
    
    form.setValue('hero.background_image', url, { shouldValidate: true });
    form.setValue('hero.background_image_alt', alt, { shouldValidate: true });
  };

  const handleServiceImageUploaded = (index: number, url: string, alt: string) => {
    if (pageName !== "home") return;
    
    form.setValue(`services.items.${index}.image`, url, { shouldValidate: true });
    form.setValue(`services.items.${index}.image_alt`, alt, { shouldValidate: true });
  };

  const handleProductImageUploaded = (index: number, url: string, alt: string) => {
    if (pageName !== "home") return;
    
    form.setValue(`products.items.${index}.image`, url, { shouldValidate: true });
    form.setValue(`products.items.${index}.image_alt`, alt, { shouldValidate: true });
  };

  const handleBlogImageUploaded = (index: number, url: string, alt: string) => {
    if (pageName !== "home") return;
    
    form.setValue(`blog.items.${index}.image`, url, { shouldValidate: true });
    form.setValue(`blog.items.${index}.image_alt`, alt, { shouldValidate: true });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Changed error handling to create a new page if it doesn't exist
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-border">
        <h3 className="text-xl font-semibold mb-4">Create {pageName} Page</h3>
        <p className="text-orange-500 mb-4">
          This page doesn't exist yet. Fill in the details below to create it.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={10}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 border-t">
              <SeoFields control={form.control} />
            </div>
            
            <Button 
              type="submit" 
              disabled={updatePage.isPending}
              className="mt-4"
            >
              {updatePage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {page ? "Saving..." : "Creating..."}
                </>
              ) : (
                page ? "Save Changes" : "Create Page"
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  // Only render enhanced editor for homepage
  if (pageName === "home") {
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
            <Collapsible open={openSections.hero} onOpenChange={() => toggleSection('hero')}>
              <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
                <span>Hero Banner Section</span>
                <Button variant="ghost" size="sm" type="button">
                  {openSections.hero ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 px-1 space-y-4">
                <div className="mb-4">
                  <EnhancedImageUploader 
                    onImageUploaded={(url, alt) => handleHeroImageUploaded(url, alt)} 
                    bucket="homepage"
                    folder="hero"
                    initialImageUrl={form.watch('hero.background_image')}
                    initialAltText={form.watch('hero.background_image_alt')}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="hero.headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hero.subheadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subheadline</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hero.button_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hero.button_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/about" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Services Section */}
            <Collapsible open={openSections.services} onOpenChange={() => toggleSection('services')}>
              <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
                <span>Our Services Section</span>
                <Button variant="ghost" size="sm" type="button">
                  {openSections.services ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 px-1 space-y-6">
                <FormField
                  control={form.control}
                  name="services.section_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-8">
                  <h4 className="font-medium text-sm text-muted-foreground">Service Cards</h4>
                  
                  {[0, 1, 2, 3].map((index) => (
                    <div key={`service-${index}`} className="border p-4 rounded-md">
                      <h5 className="font-medium mb-3">Service Card {index + 1}</h5>
                      
                      <div className="mb-4">
                        <EnhancedImageUploader
                          onImageUploaded={(url, alt) => handleServiceImageUploaded(index, url, alt)}
                          bucket="homepage"
                          folder="services"
                          initialImageUrl={form.watch(`services.items.${index}.image`)}
                          initialAltText={form.watch(`services.items.${index}.image_alt`)}
                          imagePreviewHeight="24"
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`services.items.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`services.items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Service Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Products Section */}
            <Collapsible open={openSections.products} onOpenChange={() => toggleSection('products')}>
              <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
                <span>Our Products Section</span>
                <Button variant="ghost" size="sm" type="button">
                  {openSections.products ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 px-1 space-y-6">
                <FormField
                  control={form.control}
                  name="products.section_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-8">
                  <h4 className="font-medium text-sm text-muted-foreground">Product Cards</h4>
                  
                  {[0, 1, 2, 3].map((index) => (
                    <div key={`product-${index}`} className="border p-4 rounded-md">
                      <h5 className="font-medium mb-3">Product Card {index + 1}</h5>
                      
                      <div className="mb-4">
                        <EnhancedImageUploader
                          onImageUploaded={(url, alt) => handleProductImageUploaded(index, url, alt)}
                          bucket="homepage"
                          folder="products"
                          initialImageUrl={form.watch(`products.items.${index}.image`)}
                          initialAltText={form.watch(`products.items.${index}.image_alt`)}
                          imagePreviewHeight="24"
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`products.items.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`products.items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`products.items.${index}.link`}
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Product Link</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="/products/product-slug" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Blog Section */}
            <Collapsible open={openSections.blog} onOpenChange={() => toggleSection('blog')}>
              <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
                <span>From Our Workshop Blog Section</span>
                <Button variant="ghost" size="sm" type="button">
                  {openSections.blog ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 px-1 space-y-6">
                <FormField
                  control={form.control}
                  name="blog.section_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-8">
                  <h4 className="font-medium text-sm text-muted-foreground">Blog Post Cards</h4>
                  
                  {[0, 1, 2].map((index) => (
                    <div key={`blog-${index}`} className="border p-4 rounded-md">
                      <h5 className="font-medium mb-3">Blog Post {index + 1}</h5>
                      
                      <div className="mb-4">
                        <EnhancedImageUploader
                          onImageUploaded={(url, alt) => handleBlogImageUploaded(index, url, alt)}
                          bucket="homepage"
                          folder="blog"
                          initialImageUrl={form.watch(`blog.items.${index}.image`)}
                          initialAltText={form.watch(`blog.items.${index}.image_alt`)}
                          imagePreviewHeight="24"
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`blog.items.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blog Post Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`blog.items.${index}.excerpt`}
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Blog Excerpt</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`blog.items.${index}.link`}
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormLabel>Blog Post Link</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="/blog/post-slug" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
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
  
  // For non-home pages, render the regular editor with enhanced SEO
  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">Edit {pageName} Page</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={10}
                    className="min-h-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4 border-t">
            <SeoFields control={form.control} />
          </div>
          
          <Button 
            type="submit" 
            disabled={updatePage.isPending}
            className="mt-4"
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
