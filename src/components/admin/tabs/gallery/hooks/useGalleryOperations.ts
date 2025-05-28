
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { GalleryImageFormValues } from "./useGalleryForm";
import { GalleryImageData } from "@/hooks/content/types";

export function useGalleryOperations(selectedCategory: string | null) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { session } = useAuth();

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
      return true; // Success
    } catch (error: any) {
      console.error("Error saving gallery image:", error);
      setErrorMessage(error.message || "An error occurred saving the gallery image");
      toast.error(`Error saving gallery image: ${error.message}`);
      return false; // Failure
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
    errorMessage,
    setErrorMessage,
    onSubmit,
    handleDelete,
  };
}
