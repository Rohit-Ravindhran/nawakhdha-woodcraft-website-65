
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePage, useUpdatePage } from "@/hooks/useContent";
import { z } from "zod";
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
import { Loader2, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ImageUploader from "@/components/admin/ImageUploader";

// Define homepage-specific sections schema
const homePageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  hero: z.object({
    background_image: z.string().optional(),
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    button_text: z.string().optional(),
    button_link: z.string().optional(),
  }).optional(),
  services: z.object({
    section_title: z.string().optional(),
    items: z.array(z.object({
      image: z.string().optional(),
      title: z.string().optional(), 
      description: z.string().optional()
    })).optional()
  }).optional(),
  products: z.object({
    section_title: z.string().optional(),
    items: z.array(z.object({
      image: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    })).optional()
  }).optional(),
  blog: z.object({
    section_title: z.string().optional(),
    items: z.array(z.object({
      image: z.string().optional(),
      title: z.string().optional(),
      excerpt: z.string().optional(),
      link: z.string().optional(),
    })).optional()
  }).optional(),
});

// Regular page schema for non-home pages
const regularPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

interface PageEditorProps {
  pageName: string;
}

export default function PageEditor({ pageName }: PageEditorProps) {
  const { data: page, isLoading, error } = usePage(pageName);
  const updatePage = useUpdatePage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    hero: false, 
    services: false,
    products: false,
    blog: false,
    seo: false
  });
  
  // Use different schema based on page type
  const pageSchema = pageName === "home" ? homePageSchema : regularPageSchema;
  type PageFormValues = z.infer<typeof pageSchema>;
  
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      content: "",
      seo_title: "",
      seo_description: "",
      ...(pageName === "home" && {
        hero: {
          background_image: "",
          headline: "",
          subheadline: "",
          button_text: "",
          button_link: ""
        },
        services: {
          section_title: "Our Services",
          items: Array(4).fill({image: "", title: "", description: ""})
        },
        products: {
          section_title: "Our Products",
          items: Array(4).fill({image: "", title: "", description: ""})
        },
        blog: {
          section_title: "From Our Workshop Blog",
          items: Array(3).fill({image: "", title: "", excerpt: "", link: ""})
        }
      })
    },
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
      const parsedPage = {
        ...page,
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

      form.reset({
        title: parsedPage.title || "",
        content: parsedPage.content || "",
        seo_title: parsedPage.seo_title || "",
        seo_description: parsedPage.seo_description || "",
        ...(pageName === "home" && {
          hero: parsedPage.hero,
          services: parsedPage.services,
          products: parsedPage.products,
          blog: parsedPage.blog
        })
      });
    }
  }, [page, form, pageName]);

  const onSubmit = (values: PageFormValues) => {
    // Ensure all required fields have values
    const updatedPage = {
      id: page?.id,
      page_name: pageName,
      title: values.title,
      content: values.content,
      seo_title: values.seo_title || "",
      seo_description: values.seo_description || "",
      ...(pageName === "home" && {
        hero: JSON.stringify(values.hero),
        services: JSON.stringify(values.services),
        products: JSON.stringify(values.products),
        blog: JSON.stringify(values.blog)
      })
    };
    
    updatePage.mutate(updatedPage, {
      onSuccess: () => {
        toast.success(`Page "${pageName}" saved successfully`);
      },
      onError: (error) => {
        toast.error(`Error saving page: ${error.message}`);
      }
    });
  };

  const handleImageUploaded = (section: string, index: number | null, url: string) => {
    if (section === 'hero') {
      form.setValue('hero.background_image', url);
    } else if (section === 'services' && index !== null) {
      form.setValue(`services.items.${index}.image`, url);
    } else if (section === 'products' && index !== null) {
      form.setValue(`products.items.${index}.image`, url);
    } else if (section === 'blog' && index !== null) {
      form.setValue(`blog.items.${index}.image`, url);
    }
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
              <h4 className="text-lg font-medium mb-3">SEO Settings</h4>
              
              <FormField
                control={form.control}
                name="seo_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="seo_description"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <Button variant="ghost" size="sm">
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
                <Button variant="ghost" size="sm">
                  {openSections.hero ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 px-1 space-y-4">
                <div className="mb-4">
                  <Label className="block mb-2">Background Image</Label>
                  {form.watch('hero.background_image') && (
                    <div className="relative mb-4 bg-slate-100 p-2 rounded-md">
                      <img 
                        src={form.watch('hero.background_image')} 
                        alt="Hero background" 
                        className="max-h-40 object-cover rounded-md"
                      />
                      <div className="text-xs text-muted-foreground mt-1 break-all">
                        {form.watch('hero.background_image')}
                      </div>
                    </div>
                  )}
                  <ImageUploader 
                    onImageUploaded={(url) => handleImageUploaded('hero', null, url)} 
                    bucket="homepage"
                    folder="hero"
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
                <Button variant="ghost" size="sm">
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
                        <Label className="block mb-2">Service Image</Label>
                        {form.watch(`services.items.${index}.image`) && (
                          <div className="relative mb-2 bg-slate-100 p-2 rounded-md">
                            <img 
                              src={form.watch(`services.items.${index}.image`)} 
                              alt={`Service ${index + 1}`} 
                              className="max-h-24 object-cover rounded-md" 
                            />
                            <div className="text-xs text-muted-foreground mt-1 break-all">
                              {form.watch(`services.items.${index}.image`)}
                            </div>
                          </div>
                        )}
                        <ImageUploader 
                          onImageUploaded={(url) => handleImageUploaded('services', index, url)} 
                          bucket="homepage"
                          folder="services"
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
                <Button variant="ghost" size="sm">
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
                        <Label className="block mb-2">Product Image</Label>
                        {form.watch(`products.items.${index}.image`) && (
                          <div className="relative mb-2 bg-slate-100 p-2 rounded-md">
                            <img 
                              src={form.watch(`products.items.${index}.image`)} 
                              alt={`Product ${index + 1}`} 
                              className="max-h-24 object-cover rounded-md" 
                            />
                            <div className="text-xs text-muted-foreground mt-1 break-all">
                              {form.watch(`products.items.${index}.image`)}
                            </div>
                          </div>
                        )}
                        <ImageUploader 
                          onImageUploaded={(url) => handleImageUploaded('products', index, url)} 
                          bucket="homepage"
                          folder="products"
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
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Blog Section */}
            <Collapsible open={openSections.blog} onOpenChange={() => toggleSection('blog')}>
              <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
                <span>From Our Workshop Blog Section</span>
                <Button variant="ghost" size="sm">
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
                        <Label className="block mb-2">Blog Image</Label>
                        {form.watch(`blog.items.${index}.image`) && (
                          <div className="relative mb-2 bg-slate-100 p-2 rounded-md">
                            <img 
                              src={form.watch(`blog.items.${index}.image`)} 
                              alt={`Blog ${index + 1}`} 
                              className="max-h-24 object-cover rounded-md" 
                            />
                            <div className="text-xs text-muted-foreground mt-1 break-all">
                              {form.watch(`blog.items.${index}.image`)}
                            </div>
                          </div>
                        )}
                        <ImageUploader 
                          onImageUploaded={(url) => handleImageUploaded('blog', index, url)} 
                          bucket="homepage"
                          folder="blog"
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
                <Button variant="ghost" size="sm">
                  {openSections.seo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 px-1">
                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
  
  // For non-home pages, render the regular editor
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
            <h4 className="text-lg font-medium mb-3">SEO Settings</h4>
            
            <FormField
              control={form.control}
              name="seo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="seo_description"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
