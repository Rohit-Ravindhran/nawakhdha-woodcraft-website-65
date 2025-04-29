
import { z } from "zod";

export const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category_name: z.string().min(1, "Category is required"),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema> & {
  gallery_images?: { url: string; caption: string; alt?: string }[];
};
