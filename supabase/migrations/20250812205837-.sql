-- 1) Ensure role infrastructure exists (enum + user_roles table + helper function)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 2) Tighten RLS on contact_form_submissions
ALTER TABLE public.contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Drop overly-permissive policies if they exist
DROP POLICY IF EXISTS "Allow read for all" ON public.contact_form_submissions;
DROP POLICY IF EXISTS "Allow update for all" ON public.contact_form_submissions;
DROP POLICY IF EXISTS "Allow delete for all" ON public.contact_form_submissions;
DROP POLICY IF EXISTS "Allow insert for all" ON public.contact_form_submissions;

-- Allow public inserts (so the public contact form continues to work)
CREATE POLICY "Allow public insert contact_form_submissions"
ON public.contact_form_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Restrict reads to admins only
CREATE POLICY "Admins can read contact submissions"
ON public.contact_form_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Optionally allow admins to update/delete (everything else denied by default)
CREATE POLICY "Admins can update contact submissions"
ON public.contact_form_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_form_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
