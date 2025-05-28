
import { useState } from "react";
import { GalleryImageData } from "@/hooks/content/types";
import { UseFormReturn } from "react-hook-form";
import { GalleryImageFormValues } from "./useGalleryForm";

export function useGalleryDialog(
  form: UseFormReturn<GalleryImageFormValues>,
  selectedCategory: string | null,
  galleryImagesLength: number
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryImageData | null>(null);

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
      position: galleryImagesLength || 0,
    });
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    currentImage,
    setCurrentImage,
    handleEdit,
    handleAdd,
  };
}
