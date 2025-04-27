
import { useEffect } from "react";
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
import { Loader2 } from "lucide-react";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PageEditorProps {
  pageName: string;
}

export default function PageEditor({ pageName }: PageEditorProps) {
  const { data: page, isLoading, error } = usePage(pageName);
  const updatePage = useUpdatePage();
  
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      content: "",
      seo_title: "",
      seo_description: "",
    },
  });

  useEffect(() => {
    if (page) {
      form.reset({
        title: page.title || "",
        content: page.content || "",
        seo_title: page.seo_title || "",
        seo_description: page.seo_description || "",
      });
    }
  }, [page, form]);

  const onSubmit = (values: PageFormValues) => {
    // Ensure all required fields have values
    const updatedPage = {
      id: page?.id,
      page_name: pageName,
      title: values.title,
      content: values.content,
      seo_title: values.seo_title || "",
      seo_description: values.seo_description || ""
    };
    
    updatePage.mutate(updatedPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        Error loading page data: {(error as Error).message}
      </div>
    );
  }

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
