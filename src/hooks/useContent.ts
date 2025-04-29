
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Pages
export function usePage(pageName: string) {
  return useQuery({
    queryKey: ['page', pageName],
    queryFn: async () => {
      // Changed from .single() to .maybeSingle() to handle the case of no rows
      // or first() to handle the case of multiple rows
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_name', pageName)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: { 
      id?: number; 
      page_name: string; 
      title: string; 
      content: string;
      seo_title?: string;
      seo_description?: string;
      hero?: string;
      services?: string;
      products?: string;
      blog?: string;
    }) => {
      const { id, ...pageFields } = pageData;
      
      if (id) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update(pageFields)
          .eq('id', id);
          
        if (error) throw error;
        return pageData;
      } else {
        // Insert new page
        const { data, error } = await supabase
          .from('pages')
          .insert(pageFields)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page', data.page_name] });
      toast.success(`Page "${data.page_name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating page: ${error.message}`);
    }
  });
}

// Products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useProduct(productId?: number) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!productId
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: { 
      id?: number; 
      product_name: string; 
      description: string;
      category_name: string;
      gallery_images?: { url: string; caption: string }[];
    }) => {
      const { id, ...productFields } = productData;
      
      if (id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productFields)
          .eq('id', id);
          
        if (error) throw error;
        return { ...productData, id };
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('products')
          .insert(productFields)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success(`Product "${data.product_name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating product: ${error.message}`);
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success(`Product deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting product: ${error.message}`);
    }
  });
}

// Blogs
export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useBlog(blogId?: number) {
  return useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!blogId) return null;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!blogId
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogData: { 
      id?: number; 
      title: string; 
      body_content: string;
      featured_image_url?: string;
      slug: string;
      date: string;
      excerpt?: string;
    }) => {
      const { id, ...blogFields } = blogData;
      
      if (id) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogFields)
          .eq('id', id);
          
        if (error) throw error;
        return { ...blogData, id };
      } else {
        // Insert new blog
        const { data, error } = await supabase
          .from('blogs')
          .insert(blogFields)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', data.id] });
      toast.success(`Blog post "${data.title}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating blog post: ${error.message}`);
    }
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogId: number) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);
        
      if (error) throw error;
      return blogId;
    },
    onSuccess: (blogId) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
      toast.success(`Blog post deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting blog post: ${error.message}`);
    }
  });
}

// Gallery
export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useAddGalleryImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageData: { image_url: string; caption: string }) => {
      const { data, error } = await supabase
        .from('gallery')
        .insert(imageData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery image added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error adding gallery image: ${error.message}`);
    }
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageId: number) => {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', imageId);
        
      if (error) throw error;
      return imageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery image deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting gallery image: ${error.message}`);
    }
  });
}

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1) // Assuming settings are stored with id = 1
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settingsData: { 
      id?: number; 
      background_color: string; 
      site_title: string;
      site_description: string;
    }) => {
      if (settingsData.id) {
        // Update existing settings
        const { error } = await supabase
          .from('settings')
          .update({
            background_color: settingsData.background_color,
            site_title: settingsData.site_title,
            site_description: settingsData.site_description
          })
          .eq('id', settingsData.id);
          
        if (error) throw error;
        return settingsData;
      } else {
        // Insert new settings with id = 1
        const { data, error } = await supabase
          .from('settings')
          .insert({
            id: 1,
            background_color: settingsData.background_color,
            site_title: settingsData.site_title,
            site_description: settingsData.site_description
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Site settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error updating site settings: ${error.message}`);
    }
  });
}
