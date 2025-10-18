-- Create projects_videos table
CREATE TABLE public.projects_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects_images table
CREATE TABLE public.projects_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_images ENABLE ROW LEVEL SECURITY;

-- Create policies for projects_videos
CREATE POLICY "Public can read projects_videos" 
ON public.projects_videos 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert projects_videos" 
ON public.projects_videos 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update projects_videos" 
ON public.projects_videos 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete projects_videos" 
ON public.projects_videos 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for projects_images
CREATE POLICY "Public can read projects_images" 
ON public.projects_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert projects_images" 
ON public.projects_images 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update projects_images" 
ON public.projects_images 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete projects_images" 
ON public.projects_images 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates on projects_videos
CREATE TRIGGER update_projects_videos_updated_at
BEFORE UPDATE ON public.projects_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on projects_images
CREATE TRIGGER update_projects_images_updated_at
BEFORE UPDATE ON public.projects_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for projects
INSERT INTO storage.buckets (id, name, public) VALUES ('projects-videos', 'projects-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('projects-images', 'projects-images', true);

-- Create storage policies for projects-videos bucket
CREATE POLICY "Public can view projects videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projects-videos');

CREATE POLICY "Admins can upload projects videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'projects-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update projects videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'projects-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete projects videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'projects-videos' AND has_role(auth.uid(), 'admin'::app_role));

-- Create storage policies for projects-images bucket
CREATE POLICY "Public can view projects images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projects-images');

CREATE POLICY "Admins can upload projects images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'projects-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update projects images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'projects-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete projects images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'projects-images' AND has_role(auth.uid(), 'admin'::app_role));