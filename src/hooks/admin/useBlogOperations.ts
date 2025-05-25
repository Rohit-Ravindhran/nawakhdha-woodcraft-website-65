
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BlogFormValues } from "@/components/admin/schemas/blogSchema";

export function useBlogOperations() {
  const queryClient = useQueryClient();
  
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });
  
  const saveBlog = async (values: BlogFormValues) => {
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('blogs')
          .update({
            title: values.title,
            slug: values.slug,
            content: values.content,
            body_content: values.body_content,
            excerpt: values.excerpt,
            featured_image_url: values.featured_image_url,
            image_url: values.image_url,
            alt_text: values.alt_text,
            date: values.date,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Blog post updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('blogs')
          .insert({
            title: values.title,
            slug: values.slug,
            content: values.content,
            body_content: values.body_content,
            excerpt: values.excerpt,
            featured_image_url: values.featured_image_url,
            image_url: values.image_url,
            alt_text: values.alt_text,
            date: values.date,
          });
          
        if (error) throw error;
        toast.success("Blog post added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    } catch (error: any) {
      console.error("Blog save error:", error);
      toast.error(`Error saving blog post: ${error.message}`);
    }
  };
  
  const deleteBlog = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Blog post deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
      } catch (error: any) {
        toast.error(`Error deleting blog post: ${error.message}`);
      }
    }
  };
  
  return {
    blogs,
    isLoading,
    saveBlog,
    deleteBlog,
  };
}
