
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBlog, useUpdateBlog } from "@/hooks/content";
import { useStorage } from "@/hooks/useStorage";
import ImageUploader from "./ImageUploader";
import { Loader2 } from "lucide-react";
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

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body_content: z.string(),
  excerpt: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  blogId?: number;
  onSave?: () => void;
}

export default function BlogEditor({ blogId, onSave }: BlogEditorProps) {
  const { data: blog, isLoading } = useBlog(blogId);
  const updateBlog = useUpdateBlog();
  const [featuredImage, setFeaturedImage] = useState<string>("");
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      body_content: "",
      excerpt: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || "",
        body_content: blog.body_content || "",
        excerpt: blog.excerpt || "",
        slug: blog.slug || "",
      });
      
      setFeaturedImage(blog.featured_image_url || "");
    }
  }, [blog, form]);

  const onSubmit = (values: BlogFormValues) => {
    // Ensure all required fields have values
    const updatedBlog = {
      id: blogId,
      title: values.title,
      body_content: values.body_content,
      featured_image_url: featuredImage,
      slug: values.slug,
      excerpt: values.excerpt,
      date: blog?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    updateBlog.mutate(updatedBlog, {
      onSuccess: () => {
        if (onSave) onSave();
      }
    });
  };

  const handleImageUploaded = (url: string) => {
    setFeaturedImage(url);
  };

  if (isLoading && blogId) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">
        {blogId ? `Edit ${blog?.title || "Blog Post"}` : "Add New Blog Post"}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Excerpt (Short Summary)</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
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
                <FormLabel>Blog Content</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={10}
                    className="min-h-[300px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4 border-t">
            <h4 className="text-lg font-medium mb-3">Featured Image</h4>
            
            {featuredImage && (
              <div className="mb-4">
                <img 
                  src={featuredImage} 
                  alt="Featured" 
                  className="w-full max-w-xl h-auto rounded mb-2"
                />
              </div>
            )}
            
            <ImageUploader 
              onImageUploaded={handleImageUploaded}
              bucket="blogs"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={updateBlog.isPending}
            className="mt-4"
          >
            {updateBlog.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Blog Post"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
