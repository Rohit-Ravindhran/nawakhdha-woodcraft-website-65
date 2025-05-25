
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { blogSchema, BlogFormValues, generateSlug } from "@/components/admin/schemas/blogSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import BlogImageUploadField from "./BlogImageUploadField";

interface BlogFormProps {
  currentBlog: BlogFormValues | null;
  onSubmit: (values: BlogFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function BlogForm({ currentBlog, onSubmit, onCancel }: BlogFormProps) {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      id: currentBlog?.id || undefined,
      title: currentBlog?.title || "",
      slug: currentBlog?.slug || "",
      content: currentBlog?.content || "",
      body_content: currentBlog?.body_content || "",
      excerpt: currentBlog?.excerpt || "",
      featured_image_url: currentBlog?.featured_image_url || "",
      image_url: currentBlog?.image_url || "",
      alt_text: currentBlog?.alt_text || "",
      date: currentBlog?.date ? format(new Date(currentBlog.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const handleGenerateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = generateSlug(title);
      form.setValue("slug", slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Blog post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="blog-post-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGenerateSlug}
                className="mb-[2px]"
              >
                Generate
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the post" 
                      {...field} 
                      rows={3}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <BlogImageUploadField
              control={form.control}
              name="featured_image_url"
              label="Featured Image"
              altTextName="alt_text"
            />
            
            <BlogImageUploadField
              control={form.control}
              name="image_url"
              label="Secondary Image"
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Short)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Short content or introduction" 
                  {...field} 
                  rows={5}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="body_content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Content (Full Article)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Full article content" 
                  {...field} 
                  rows={15}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Blog Post
          </Button>
        </div>
      </form>
    </Form>
  );
}
