
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { GalleryImageData } from "@/hooks/content/types";

const galleryImageSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  image_url: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
  alt_text: z.string().optional(),
  position: z.coerce.number().int().optional(),
});

export type GalleryImageFormValues = z.infer<typeof galleryImageSchema>;

interface UseGalleryFormProps {
  currentImage: GalleryImageData | null;
  selectedCategory: string | null;
  galleryImagesLength: number;
}

export function useGalleryForm({ 
  currentImage, 
  selectedCategory, 
  galleryImagesLength 
}: UseGalleryFormProps) {
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
        position: galleryImagesLength || 0,
      });
    }
  }, [currentImage, selectedCategory, galleryImagesLength, form]);

  return form;
}
