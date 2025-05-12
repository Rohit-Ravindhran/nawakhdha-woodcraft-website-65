
import { ProductCategoryData } from '../types';

// Type definition to make description optional
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

// Home product with its related categories
export interface HomeProductWithCategories {
  id?: string;
  category_name?: string;
  image_url?: string;
  alt_text?: string;
  slug?: string;
  product_categories: ProductCategoryWithOptionalDescription[];
}

