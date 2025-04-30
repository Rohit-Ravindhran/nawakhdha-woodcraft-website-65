
import { z } from "zod";

// Gallery image schema
export const galleryImageSchema = z.object({
  url: z.string(),
  caption: z.string().optional(),
  alt: z.string().optional()
});

export type GalleryImage = {
  url: string;
  caption: string;
  alt?: string;
};

// Product schema with gallery images
export const productSchema = z.object({
  id: z.number().optional(),
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category_name: z.string().min(1, "Category is required"),
  price: z.string().optional(),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  gallery_images: z.array(galleryImageSchema)
    .nonempty("At least one image is required")
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
