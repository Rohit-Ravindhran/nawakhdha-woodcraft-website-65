
export interface MaintenanceCategoryData {
  id?: string;
  category_name: string | null;
  category_slug: string | null;
  category_image_url: string | null;
  alt_text: string | null;
  service_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MaintenanceCategoryDetailData {
  id?: string;
  category_id: string | null;
  service_name: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at?: string;
  updated_at?: string;
  maintenance_categories?: {
    id: string;
    category_name: string;
  } | null;
}

export interface MaintenanceGalleryImage {
  id: string;
  image_url: string | null;
  alt_text: string | null;
  caption: string | null;
  position: number | null;
  maintenance_categories?: {
    category_name: string;
  } | null;
}
