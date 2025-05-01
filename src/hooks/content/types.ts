
// Common types used across content hooks

export interface PageData {
  id?: string;
  page_name?: string;
  hero?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface ProductCategoryData {
  id?: string; 
  category_slug?: string;
  category_name?: string;
  category_image_url?: string;
  alt_text?: string;
  product_name?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface ProductDetailData {
  id?: string;
  category_id?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface BlogData {
  id?: string; 
  title: string; 
  content?: string;
  body_content?: string;
  featured_image_url?: string;
  image_url?: string;
  alt_text?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
}

export interface GalleryImageData {
  id?: string;
  category_id?: string;
  image_url: string;
  caption: string;
  alt_text?: string;
  position?: number;
}

export interface HomeServiceData {
  id?: string;
  title: string;
  description: string;
  image_url?: string;
  alt_text?: string;
}

export interface HomeProductData {
  id?: string;
  category_name?: string;
  image_url?: string;
  alt_text?: string;
}

export interface HomeBlogCardData {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;
  alt_text?: string;
  slug?: string;
}

export interface AboutTeamMemberData {
  id?: string;
  name?: string;
  role?: string;
  bio?: string;
  image_url?: string;
  alt_text?: string;
}

export interface ContactInfoData {
  id?: string;
  address?: string;
  phone?: string;
  email?: string;
  business_hours_json?: any;
}

export interface SettingsData {
  id?: string;
  background_color: string;
  site_title: string;
  site_description: string;
  site_keywords?: string;
  favicon_url?: string;
}
