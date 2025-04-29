
import { z } from "zod";

export const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category_name: z.string().min(1, "Category is required"),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

// Define the shape of gallery images for consistency
export const galleryImageSchema = z.object({
  url: z.string().url("Image URL must be valid").min(1, "URL is required"),
  caption: z.string().optional(),
  alt: z.string().optional(),
});

export type GalleryImage = z.infer<typeof galleryImageSchema>;

export type ProductFormValues = z.infer<typeof productSchema> & {
  gallery_images?: GalleryImage[];
};
