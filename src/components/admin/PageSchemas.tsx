
import { z } from "zod";

// Hero section schema for the home page
export const heroSchema = z.object({
  background_image: z.string().optional(),
  background_image_alt: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
});

// Services section schema
export const servicesSchema = z.object({
  section_title: z.string().optional(),
  items: z.array(z.object({
    image: z.string().optional(),
    image_alt: z.string().optional(),
    title: z.string().optional(), 
    description: z.string().optional()
  })).optional()
});

// Products section schema
export const productsSchema = z.object({
  section_title: z.string().optional(),
  items: z.array(z.object({
    image: z.string().optional(),
    image_alt: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    link: z.string().optional(),
  })).optional()
});

// Blog section schema
export const blogSchema = z.object({
  section_title: z.string().optional(),
  items: z.array(z.object({
    image: z.string().optional(),
    image_alt: z.string().optional(),
    title: z.string().optional(),
    excerpt: z.string().optional(),
    link: z.string().optional(),
  })).optional()
});

// Base page schema with common fields
export const basePageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  seo_canonical_url: z.string().optional(),
  seo_image_alt: z.string().optional(),
});

// Define homepage-specific schema
export const homePageSchema = basePageSchema.extend({
  hero: heroSchema.optional(),
  services: servicesSchema.optional(),
  products: productsSchema.optional(),
  blog: blogSchema.optional(),
});

// About page schema with team members section
export const aboutPageSchema = basePageSchema.extend({
  team_members: z.array(z.object({
    image: z.string().optional(),
    image_alt: z.string().optional(),
    name: z.string().optional(),
    position: z.string().optional(),
    bio: z.string().optional(),
  })).optional(),
});

// Contact page schema with contact details
export const contactPageSchema = basePageSchema.extend({
  contact_details: z.object({
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    hours: z.string().optional(),
    map_embed: z.string().optional(),
  }).optional(),
});

// Get the appropriate schema based on page name
export function getPageSchemaByName(pageName: string) {
  switch (pageName) {
    case "home":
      return homePageSchema;
    case "about":
      return aboutPageSchema;
    case "contact":
      return contactPageSchema;
    default:
      return basePageSchema;
  }
}

// Helper to get default values based on schema and page name
export function getDefaultValues(pageName: string) {
  const baseDefaults = {
    title: "",
    content: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_canonical_url: "",
    seo_image_alt: "",
  };
  
  switch (pageName) {
    case "home":
      return {
        ...baseDefaults,
        hero: {
          background_image: "",
          background_image_alt: "",
          headline: "",
          subheadline: "",
          button_text: "",
          button_link: ""
        },
        services: {
          section_title: "Our Services",
          items: Array(4).fill({
            image: "", 
            image_alt: "",
            title: "", 
            description: ""
          })
        },
        products: {
          section_title: "Our Products",
          items: Array(4).fill({
            image: "", 
            image_alt: "",
            title: "", 
            description: "",
            link: ""
          })
        },
        blog: {
          section_title: "From Our Workshop Blog",
          items: Array(3).fill({
            image: "", 
            image_alt: "",
            title: "", 
            excerpt: "",
            link: ""
          })
        }
      };
    case "about":
      return {
        ...baseDefaults,
        team_members: Array(3).fill({
          image: "",
          image_alt: "",
          name: "",
          position: "",
          bio: ""
        })
      };
    case "contact":
      return {
        ...baseDefaults,
        contact_details: {
          address: "",
          phone: "",
          email: "",
          hours: "",
          map_embed: ""
        }
      };
    default:
      return baseDefaults;
  }
}

export type HomePageFormValues = z.infer<typeof homePageSchema>;
export type AboutPageFormValues = z.infer<typeof aboutPageSchema>;
export type ContactPageFormValues = z.infer<typeof contactPageSchema>;
export type BasePageFormValues = z.infer<typeof basePageSchema>;
