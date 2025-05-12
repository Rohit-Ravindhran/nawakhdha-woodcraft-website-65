
// Types for pages
export interface PageData {
  id?: string;
  page_name: string;
  title?: string;
  content?: string;
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
  // Extended properties for specific page types
  header_image?: string;
  header_image_alt?: string;
  company_story?: string;
  mission?: string;
  vision?: string;
  since_year?: string;
  subtitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  map_url?: string;
  form_title?: string;
  form_description?: string;
}

// Types for home products
export interface HomeProductData {
  id?: string;
  category_name?: string;
  image_url?: string;
  alt_text?: string;
  slug?: string;
}

// Types for home services
export interface HomeServiceData {
  id?: string;
  title?: string;
  description?: string;
  image_url?: string;
  alt_text?: string;
}

// Types for blog cards in home page
export interface HomeBlogCardData {
  id?: string;
  title?: string;
  description?: string;
  image_url?: string;
  alt_text?: string;
  slug?: string;
}

// Types for product categories data
export interface ProductCategoryData {
  id?: string;
  category_name?: string;
  product_name?: string;
  category_image_url?: string;
  alt_text?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  category_slug?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  gallery_images?: GalleryImage[];
}

// Types for product category details
export interface ProductDetailData {
  id?: string;
  category_id?: string;
  description?: string;
  product_name?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

// Types for blog data
export interface BlogData {
  id?: string;
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
  content?: string;
  image_url?: string;
  alt_text?: string;
}

// Types for gallery image data
export interface GalleryImageData {
  id?: string;
  image_url: string;
  caption: string;
  alt_text?: string;
  category_id?: string;
}

// Type for gallery images in product display
export interface GalleryImage {
  url: string;
  caption: string;
  alt?: string;
}

// Type for Product data
export interface ProductData extends ProductCategoryData, ProductDetailData {
  gallery_images?: GalleryImage[];
  slug?: string;
}

// Type for About Team Member data
export interface AboutTeamMemberData {
  id?: string;
  name?: string;
  role?: string;
  image_url?: string;
  alt_text?: string;
  bio?: string;
}

// Type for Contact Information data
export interface ContactInfoData {
  id?: string;
  address?: string;
  phone?: string;
  email?: string;
  business_hours_json?: string | object | null;
}
