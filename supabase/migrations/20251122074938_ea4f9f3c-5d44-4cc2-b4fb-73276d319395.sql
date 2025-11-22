-- Drop the existing incorrect admin insert policy
DROP POLICY IF EXISTS "Admins can insert product_gallery" ON public.product_gallery;

-- Create the correct admin insert policy that checks JWT app_metadata
CREATE POLICY "ADMIN insert into product_gallery"
ON public.product_gallery
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

-- Also update the UPDATE policy to use the same correct check
DROP POLICY IF EXISTS "Admins can update product_gallery" ON public.product_gallery;

CREATE POLICY "ADMIN update product_gallery"
ON public.product_gallery
FOR UPDATE
TO authenticated
USING (
  (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);

-- Also update the DELETE policy to use the same correct check
DROP POLICY IF EXISTS "Admins can delete product_gallery" ON public.product_gallery;

CREATE POLICY "ADMIN delete product_gallery"
ON public.product_gallery
FOR DELETE
TO authenticated
USING (
  (auth.jwt()->'app_metadata'->>'app_role') = 'admin'
);