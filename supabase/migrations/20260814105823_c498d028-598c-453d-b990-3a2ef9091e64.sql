ALTER TABLE public.projects_images ADD COLUMN IF NOT EXISTS page_slug text NOT NULL DEFAULT 'our-projects';
ALTER TABLE public.projects_videos ADD COLUMN IF NOT EXISTS page_slug text NOT NULL DEFAULT 'our-projects';
CREATE INDEX IF NOT EXISTS projects_images_page_slug_idx ON public.projects_images (page_slug);
CREATE INDEX IF NOT EXISTS projects_videos_page_slug_idx ON public.projects_videos (page_slug);