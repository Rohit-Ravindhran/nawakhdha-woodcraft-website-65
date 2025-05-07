
import { z } from "zod";

// Base page schema with common fields
export const basePageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  hero: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  seo_canonical_url: z.string().optional(),
  seo_image_alt: z.string().optional(),
});

export type BasePageFormValues = z.infer<typeof basePageSchema>;

// About page schema
export const aboutPageSchema = basePageSchema.extend({});

export type AboutPageFormValues = z.infer<typeof aboutPageSchema>;

// Contact page schema
export const contactPageSchema = basePageSchema.extend({});

export type ContactPageFormValues = z.infer<typeof contactPageSchema>;

// Home page schema
export const homePageSchema = basePageSchema.extend({
  services: z.string().optional(),
  products: z.string().optional(),
  blog: z.string().optional(),
});

export type HomePageFormValues = z.infer<typeof homePageSchema>;
