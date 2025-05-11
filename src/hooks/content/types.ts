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
  category_slug?: string; // Add this field to match the DB schema
  slug?: string; // For compatibility with home_products
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
}

// Types for gallery image data
export interface GalleryImageData {
  id?: string;
  image_url: string;
  caption: string;
  alt_text?: string;
  category_id?: string;
}
