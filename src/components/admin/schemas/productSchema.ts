
import { z } from "zod";

export const productSchema = z.object({
  category_name: z.string().min(1, "Product category name is required"),
  category_slug: z.string().optional(),
  product_name: z.string().optional(),
  category_image_url: z.string().min(1, "Product image is required"),
  alt_text: z.string().optional(),
  description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  gallery_images: z.array(
    z.object({
      url: z.string(),
      caption: z.string(),
      alt: z.string().optional(),
    })
  ).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface GalleryImage {
  url: string;
  caption: string;
  alt?: string;
}
