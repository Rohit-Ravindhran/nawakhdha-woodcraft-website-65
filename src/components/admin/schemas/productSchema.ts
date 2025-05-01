
import { z } from "zod";

export interface GalleryImage {
  url: string;
  caption: string;
  alt?: string;
}

export const productSchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  category_slug: z.string().min(1, "Slug is required"),
  category_image_url: z.string().optional(),
  alt_text: z.string().optional(),
  product_name: z.string().optional(),
  description: z.string().optional(),
  gallery_images: z
    .array(
      z.object({
        url: z.string(),
        caption: z.string().optional(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
