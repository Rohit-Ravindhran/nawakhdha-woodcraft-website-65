import { z } from "zod";

export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().optional(),
  body_content: z.string().optional(),
  excerpt: z.string().optional(),
  featured_image_url: z.string().optional(),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  author: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;

// Helper function for slug generation
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};