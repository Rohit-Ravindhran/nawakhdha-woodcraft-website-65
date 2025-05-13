
import { ProductCategoryData } from '../types';

/**
 * Type definition to make description optional
 */
export interface ProductCategoryWithOptionalDescription {
  id: string;
  category_name: string | null;
  product_name: string | null;
  category_image_url: string | null;
  alt_text: string | null;
  category_slug: string | null;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
}

/**
 * Home product with its related categories
 */
export interface HomeProductWithCategories {
  id?: string;
  category_name?: string;
  image_url?: string;
  alt_text?: string;
  slug?: string;
  product_categories: ProductCategoryWithOptionalDescription[];
}

/**
 * Interface for homepage data structure
 */
export interface HomePageData {
  id?: string;
  page_name?: string;
  title?: string;
  content?: string;
  hero?: string;
  services?: string;
  products?: string;
  blog?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_canonical_url?: string;
  seo_image_alt?: string;
  created_at?: string;
}
