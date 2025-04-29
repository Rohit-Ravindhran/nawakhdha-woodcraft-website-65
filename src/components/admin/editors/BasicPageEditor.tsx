
import React from "react";
import { Button } from "@/components/ui/button";
import { useUpdatePage, PageData } from "@/hooks/useContent";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SeoFields from "@/components/admin/SeoFields";
import { basePageSchema, BasePageFormValues } from "@/components/admin/PageSchemas";

interface BasicPageEditorProps {
  page: PageData | null;
  pageName: string;
  isLoading: boolean;
}

export default function BasicPageEditor({ page, pageName, isLoading }: BasicPageEditorProps) {
  const updatePage = useUpdatePage();
  
  const form = useForm<BasePageFormValues>({
    resolver: zodResolver(basePageSchema),
    defaultValues: {
      title: page?.title || "",
      content: page?.content || "",
      seo_title: page?.seo_title || "",
      seo_description: page?.seo_description || "",
      seo_keywords: page?.seo_keywords || "",
      seo_canonical_url: page?.seo_canonical_url || "",
      seo_image_alt: page?.seo_image_alt || "",
    },
  });

  const onSubmit = (values: BasePageFormValues) => {
    const updatedPage: PageData = {
      id: page?.id,
      page_name: pageName,
      title: values.title,
      content: values.content,
      seo_title: values.seo_title || "",
      seo_description: values.seo_description || "",
      seo_keywords: values.seo_keywords || "",
      seo_canonical_url: values.seo_canonical_url || "",
      seo_image_alt: values.seo_image_alt || "",
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // For pages that don't exist yet
  const isNewPage = !page;

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">
        {isNewPage ? `Create ${pageName} Page` : `Edit ${pageName} Page`}
      </h3>
      
      {isNewPage && (
        <p className="text-orange-500 mb-4">
          This page doesn't exist yet. Fill in the details below to create it.
        </p>
      )}
      
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
                {isNewPage ? "Creating..." : "Saving..."}
              </>
            ) : (
              isNewPage ? "Create Page" : "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
