
-- Create maintenance_categories table (mirrors product_categories)
CREATE TABLE public.maintenance_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT,
  category_slug TEXT,
  category_image_url TEXT,
  alt_text TEXT,
  service_name TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maintenance_category_details table (mirrors product_category_details)
CREATE TABLE public.maintenance_category_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.maintenance_categories(id) ON DELETE CASCADE,
  service_name TEXT,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maintenance_gallery table (mirrors product_gallery)
CREATE TABLE public.maintenance_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.maintenance_categories(id) ON DELETE CASCADE,
  image_url TEXT,
  alt_text TEXT,
  caption TEXT,
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for maintenance_categories
ALTER TABLE public.maintenance_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "maintenance_categories_select_policy" ON public.maintenance_categories
  FOR SELECT USING (true);

CREATE POLICY "maintenance_categories_insert_policy" ON public.maintenance_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "maintenance_categories_update_policy" ON public.maintenance_categories
  FOR UPDATE USING (true);

CREATE POLICY "maintenance_categories_delete_policy" ON public.maintenance_categories
  FOR DELETE USING (true);

-- Add RLS policies for maintenance_category_details
ALTER TABLE public.maintenance_category_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "maintenance_category_details_select_policy" ON public.maintenance_category_details
  FOR SELECT USING (true);

CREATE POLICY "maintenance_category_details_insert_policy" ON public.maintenance_category_details
  FOR INSERT WITH CHECK (true);

CREATE POLICY "maintenance_category_details_update_policy" ON public.maintenance_category_details
  FOR UPDATE USING (true);

CREATE POLICY "maintenance_category_details_delete_policy" ON public.maintenance_category_details
  FOR DELETE USING (true);

-- Add RLS policies for maintenance_gallery
ALTER TABLE public.maintenance_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "maintenance_gallery_select_policy" ON public.maintenance_gallery
  FOR SELECT USING (true);

CREATE POLICY "maintenance_gallery_insert_policy" ON public.maintenance_gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "maintenance_gallery_update_policy" ON public.maintenance_gallery
  FOR UPDATE USING (true);

CREATE POLICY "maintenance_gallery_delete_policy" ON public.maintenance_gallery
  FOR DELETE USING (true);

-- Create storage bucket for maintenance service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('maintenance-services', 'maintenance-services', true);

-- Add storage policies for maintenance-services bucket
CREATE POLICY "maintenance_services_bucket_select_policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'maintenance-services');

CREATE POLICY "maintenance_services_bucket_insert_policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'maintenance-services');

CREATE POLICY "maintenance_services_bucket_update_policy" ON storage.objects
  FOR UPDATE USING (bucket_id = 'maintenance-services');

CREATE POLICY "maintenance_services_bucket_delete_policy" ON storage.objects
  FOR DELETE USING (bucket_id = 'maintenance-services');
