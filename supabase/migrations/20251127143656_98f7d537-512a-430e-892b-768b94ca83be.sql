-- Fix storage RLS policies for projects-videos and projects-images buckets
-- Drop any existing conflicting policies first
DROP POLICY IF EXISTS "Admins can upload project videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view project videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;

-- Create storage policies for projects-videos bucket
CREATE POLICY "Admins can upload project videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'projects-videos' 
  AND (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

CREATE POLICY "Admins can update project videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'projects-videos' 
  AND (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

CREATE POLICY "Admins can delete project videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'projects-videos' 
  AND (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

CREATE POLICY "Public can view project videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'projects-videos');

-- Create storage policies for projects-images bucket
CREATE POLICY "Admins can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'projects-images' 
  AND (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

CREATE POLICY "Admins can update project images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'projects-images' 
  AND (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

CREATE POLICY "Admins can delete project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'projects-images' 
  AND (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

CREATE POLICY "Public can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'projects-images');