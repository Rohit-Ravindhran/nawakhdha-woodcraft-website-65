-- Create table for content change requests and approvals
CREATE TABLE public.content_change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  page_title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'description', 'json-ld', 'meta-tags', etc.
  section_identifier TEXT NOT NULL, -- specific section being updated
  current_content TEXT NOT NULL,
  proposed_content TEXT NOT NULL,
  change_reason TEXT,
  seo_keywords_added TEXT[], -- array of new keywords added
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'declined'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT, -- could be admin user identifier
  scheduled_publish_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.content_change_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow authenticated read access to content_change_requests" 
ON public.content_change_requests 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated insert access to content_change_requests" 
ON public.content_change_requests 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated update access to content_change_requests" 
ON public.content_change_requests 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated delete access to content_change_requests" 
ON public.content_change_requests 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- Create indexes for better performance
CREATE INDEX idx_content_change_requests_status ON public.content_change_requests(status);
CREATE INDEX idx_content_change_requests_page_slug ON public.content_change_requests(page_slug);
CREATE INDEX idx_content_change_requests_created_at ON public.content_change_requests(created_at DESC);

-- Create table for storing page content analysis
CREATE TABLE public.page_content_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  current_content_snapshot JSONB NOT NULL,
  business_context JSONB, -- extracted business information
  brand_voice_analysis JSONB, -- style and tone analysis
  key_services TEXT[], -- identified services
  target_keywords TEXT[], -- current SEO keywords
  last_analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for page content analysis
ALTER TABLE public.page_content_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for page content analysis
CREATE POLICY "Allow authenticated access to page_content_analysis" 
ON public.page_content_analysis 
FOR ALL 
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_page_content_analysis_updated_at
    BEFORE UPDATE ON public.page_content_analysis
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();