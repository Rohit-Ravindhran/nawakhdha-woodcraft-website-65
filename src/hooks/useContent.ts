import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  pickBlogColumns,
  pickPageColumns,
  pickProductCategoryColumns,
} from './content/columnFilters';

export interface PageData {
  id?: string;
  page_name: string;
  title?: string; // Made optional as per requirements
  content?: string; // Made optional as per requirements
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_canonical_url?: string;
  seo_image_alt?: string;
  hero?: string;
  services?: string;
  products?: string;
  blog?: string;
  created_at?: string;
}

// Pages
export function usePage(pageName: string) {
  return useQuery({
    queryKey: ['page', pageName],
    queryFn: async () => {
      // Changed from .single() to .maybeSingle() to handle the case of no rows
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_name', pageName)
        .maybeSingle();

      if (error) throw error;
      // Using type assertion with as to ensure proper type conversion
      return data as unknown as PageData;
    }
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: PageData) => {
      const { id, ...pageFields } = pageData;
      const pageRow = pickPageColumns(pageFields as Record<string, unknown>);
      
      if (id) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update(pageRow)
          .eq('id', id);
          
        if (error) throw error;
        return pageData;
      } else {
        // Insert new page
        const { data, error } = await supabase
          .from('pages')
          .insert(pageRow)
          .select()
          .single();
          
        if (error) throw error;
        return data as unknown as PageData;
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

// Home Products
export function useHomeProducts() {
  return useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_products')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export function useProductCategory(categoryId?: string) {
  return useQuery({
    queryKey: ['product-category', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!categoryId
  });
}

export interface ProductData {
  id?: string; // Changed from number to string
  product_name: string; 
  description: string;
  category_name: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  gallery_images?: { url: string; caption: string; alt?: string }[];
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: ProductData) => {
      const { id, ...productFields } = productData;
      const productRow = pickProductCategoryColumns(productFields as Record<string, unknown>);
      
      if (id) {
        // Update existing product
        const { error } = await supabase
          .from('product_categories')
          .update(productRow)
          .eq('id', id);
          
        if (error) throw error;
        return { ...productData, id };
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('product_categories')
          .insert(productRow)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      queryClient.invalidateQueries({ queryKey: ['product-category', data.id] });
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
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      queryClient.invalidateQueries({ queryKey: ['product-category', productId] });
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

export function useBlog(blogId?: string) {
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

export interface BlogData {
  id?: string; // Changed from number to string
  title: string; 
  body_content: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  slug: string;
  date: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogData: BlogData) => {
      const { id, ...blogFields } = blogData;
      const blogRow = pickBlogColumns(blogFields as Record<string, unknown>);
      
      if (id) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogRow)
          .eq('id', id);
          
        if (error) throw error;
        return { ...blogData, id };
      } else {
        // Insert new blog
        const { data, error } = await supabase
          .from('blogs')
          .insert(blogRow)
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
    mutationFn: async (blogId: string) => {
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
        .from('product_gallery')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}

export interface GalleryImageData {
  id?: string;
  image_url: string;
  caption: string;
  alt_text?: string;
  category_id?: string;
  position?: number; // Added position property to match database
}

export function useAddGalleryImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageData: GalleryImageData) => {
      const { data, error } = await supabase
        .from('product_gallery')
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
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('product_gallery')
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
