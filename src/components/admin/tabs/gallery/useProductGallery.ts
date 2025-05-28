
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGalleryData } from "./hooks/useGalleryData";
import { useGalleryForm } from "./hooks/useGalleryForm";
import { useGalleryOperations } from "./hooks/useGalleryOperations";
import { useGalleryDialog } from "./hooks/useGalleryDialog";

export function useProductGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { session } = useAuth();
  
  // Data fetching
  const {
    productCategories,
    galleryImages,
    loadingCategories,
    loadingImages,
  } = useGalleryData(selectedCategory);
  
  // Form management
  const form = useGalleryForm({
    currentImage: null,
    selectedCategory,
    galleryImagesLength: galleryImages?.length || 0,
  });
  
  // CRUD operations
  const {
    errorMessage,
    setErrorMessage,
    onSubmit: handleSubmit,
    handleDelete,
  } = useGalleryOperations(selectedCategory);
  
  // Dialog management
  const {
    isDialogOpen,
    setIsDialogOpen,
    currentImage,
    setCurrentImage,
    handleEdit,
    handleAdd,
  } = useGalleryDialog(form, selectedCategory, galleryImages?.length || 0);

  // Enhanced submit handler that closes dialog on success
  const onSubmit = async (values: any) => {
    const success = await handleSubmit(values);
    if (success) {
      setIsDialogOpen(false);
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

// Export the form type for use in other components
export type { GalleryImageFormValues } from "./hooks/useGalleryForm";
