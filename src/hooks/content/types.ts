
// Common types used across content hooks

export interface PageData {
  id?: number;
  page_name: string;
  title: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_canonical_url?: string;
  seo_image_alt?: string;
  hero?: string;
  services?: string;
  products?: string;
  blog?: string;
  created_at?: string;
  // About Page Fields
  header_image?: string;
  header_image_alt?: string;
  company_story?: string;
  mission?: string;
  vision?: string;
  since_year?: string;
  // Contact Page Fields
  subtitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  map_url?: string;
  form_title?: string;
  form_description?: string;
}

export interface ProductData {
  id?: number; 
  product_name: string; 
  description: string;
  category_name: string;
  price?: string;
  dimensions?: string;
  material?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  gallery_images?: { url: string; caption: string; alt?: string }[];
  created_at?: string;
}

export interface BlogData {
  id?: number; 
  title: string; 
  body_content: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  slug: string;
  date: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface GalleryImageData {
  id?: number;
  image_url: string;
  caption: string;
  alt_text?: string;
}

export interface SettingsData {
  id?: number;
  background_color: string;
  site_title: string;
  site_description: string;
  site_keywords?: string;
  favicon_url?: string;
}
