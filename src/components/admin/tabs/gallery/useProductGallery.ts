
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GalleryImageData, ProductCategoryData } from "@/hooks/content/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

const galleryImageSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  image_url: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
  alt_text: z.string().optional(),
  position: z.coerce.number().int().optional(),
});

export type GalleryImageFormValues = z.infer<typeof galleryImageSchema>;

export function useProductGallery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryImageData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { session } = useAuth();
  
  const { data: productCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['product_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, category_name')
        .order('category_name');
        
      if (error) throw error;
      return data as Pick<ProductCategoryData, 'id' | 'category_name'>[];
    },
  });
  
  const { data: galleryImages, isLoading: loadingImages } = useQuery({
    queryKey: ['product_gallery', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('product_gallery')
        .select(`
          *,
          product_categories(id, category_name)
        `)
        .order('position', { ascending: true });
      
      if (selectedCategory && selectedCategory !== 'all-categories') {
        query = query.eq('category_id', selectedCategory);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
  
  const form = useForm<GalleryImageFormValues>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      category_id: "",
      image_url: "",
      caption: "",
      alt_text: "",
      position: 0,
    },
  });
  
  // Reset form when current image changes
  useEffect(() => {
    if (currentImage) {
      form.reset({
        id: currentImage.id,
        category_id: currentImage.category_id || "",
        image_url: currentImage.image_url || "",
        caption: currentImage.caption || "",
        alt_text: currentImage.alt_text || "",
        position: currentImage.position || 0,
      });
    } else {
      form.reset({
        category_id: selectedCategory !== 'all-categories' ? selectedCategory || "" : "",
        image_url: "",
        caption: "",
        alt_text: "",
        position: galleryImages?.length || 0,
      });
    }
    setErrorMessage(null);
  }, [currentImage, selectedCategory, galleryImages?.length, form]);
  
  const handleEdit = (image: any) => {
    setCurrentImage(image);
    form.reset({
      id: image.id,
      category_id: image.category_id || "",
      image_url: image.image_url || "",
      caption: image.caption || "",
      alt_text: image.alt_text || "",
      position: image.position || 0,
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentImage(null);
    form.reset({
      category_id: selectedCategory !== 'all-categories' ? selectedCategory || "" : "",
      image_url: "",
      caption: "",
      alt_text: "",
      position: galleryImages?.length || 0,
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (values: GalleryImageFormValues) => {
    if (!session) {
      setErrorMessage("You must be logged in to manage gallery images");
      return;
    }
    
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('product_gallery')
          .update({
            category_id: values.category_id,
            image_url: values.image_url,
            caption: values.caption,
            alt_text: values.alt_text,
            position: values.position,
          })
          .eq('id', values.id);
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to update gallery images");
          }
          throw error;
        }
        
        toast.success("Gallery image updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('product_gallery')
          .insert({
            category_id: values.category_id,
            image_url: values.image_url,
            caption: values.caption,
            alt_text: values.alt_text,
            position: values.position,
          });
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to create gallery images");
          }
          throw error;
        }
        
        toast.success("Gallery image added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['product_gallery', selectedCategory] });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving gallery image:", error);
      setErrorMessage(error.message || "An error occurred saving the gallery image");
      toast.error(`Error saving gallery image: ${error.message}`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!session) {
      toast.error("You must be logged in to delete gallery images");
      return;
    }
    
    if (confirm("Are you sure you want to delete this gallery image?")) {
      try {
        const { error } = await supabase
          .from('product_gallery')
          .delete()
          .eq('id', id);
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to delete gallery images");
          }
          throw error;
        }
        
        toast.success("Gallery image deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['product_gallery', selectedCategory] });
      } catch (error: any) {
        console.error("Error deleting gallery image:", error);
        toast.error(`Error deleting gallery image: ${error.message}`);
      }
    }
  };

  return {
    // State
    isDialogOpen,
    setIsDialogOpen,
    currentImage,
    setCurrentImage,
    selectedCategory,
    setSelectedCategory,
    errorMessage,
    setErrorMessage,
    
    // Data
    productCategories,
    galleryImages,
    loadingCategories,
    loadingImages,
    session,
    
    // Form
    form,
    
    // Actions
    handleEdit,
    handleAdd,
    onSubmit,
    handleDelete,
  };
}
