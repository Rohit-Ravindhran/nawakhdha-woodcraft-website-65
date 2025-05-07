import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateBlog } from "@/hooks/content";  // Make sure this hook is implemented properly.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { BlogData } from "@/hooks/content/types";
import { BlogFormValues } from "./schemas/blogSchema";  // Ensure this type exists and matches the form data
import { blogPostSchema } from "@/components/admin/PageSchemas";  // Make sure this schema is correct
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

interface BlogEditorProps {
  blog?: BlogData;
  onComplete?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export default function BlogEditor({ blog, onComplete, onSave, isLoading = false }: BlogEditorProps) {
  const updateBlog = useUpdateBlog();

  // Ensure useForm is configured properly
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema), // Check this schema and ensure it's correct
    defaultValues: {
      title: blog?.title || "",
      body_content: blog?.body_content || "",
      featured_image_url: blog?.featured_image_url || "",
      slug: blog?.slug || "",
      excerpt: blog?.excerpt || "",
      date: blog?.date || "",
    },
  });

  const onSubmit = (values: BlogFormValues) => {
    if (!values.title || !values.body_content || !values.slug || !values.date) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    const blogToSubmit = {
      id: blog?.id,
      title: values.title,
      body_content: values.body_content,
      featured_image_url: values.featured_image_url,
      slug: values.slug,
      excerpt: values.excerpt,
      date: values.date,
    };

    updateBlog.mutate(blogToSubmit, {
      onSuccess: () => {
        if (onComplete) onComplete();
        if (onSave) onSave();
      },
      onError: (error: any) => {
        toast.error(`Failed to save blog post: ${error.message}`);
        console.error("Blog post update error:", error);
      }
    });
  };

  // Loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{blog?.id ? "Edit Blog Post" : "Add New Blog Post"}</h3>
      
      {/* Form for creating/updating blog */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Blog Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Body Content Field */}
          <FormField
            control={form.control}
            name="body_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Blog Content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Featured Image URL Field */}
          <FormField
            control={form.control}
            name="featured_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Featured Image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Slug Field */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Excerpt Field */}
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Input placeholder="Excerpt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="Date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={updateBlog.isPending} 
            className="mt-6"
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
