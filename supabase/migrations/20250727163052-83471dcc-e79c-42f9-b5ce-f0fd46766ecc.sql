-- Create table to store dynamic page content
CREATE TABLE IF NOT EXISTS page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  section_identifier TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Create unique constraint for page_slug + section_identifier
  UNIQUE(page_slug, section_identifier)
);

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for page_content
CREATE POLICY "Allow public read access to page_content" 
ON page_content 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated insert on page_content" 
ON page_content 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated update on page_content" 
ON page_content 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated delete on page_content" 
ON page_content 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- Insert initial content for interior-fitouts-bahrain page
INSERT INTO page_content (page_slug, section_identifier, content_type, content_value) VALUES
('interior-fitouts-bahrain', 'hero-title', 'heading', 'Interior Fit Out Company Bahrain | Commercial & Residential Fit Out Services'),
('interior-fitouts-bahrain', 'hero-description', 'description', 'Al Nawakhdha Furnitures is a leading interior fit out company Bahrain based in Nuwaidrat, offering comprehensive fit out works Bahrain including interior design Bahrain, bespoke furniture Bahrain, and turnkey interior fit out Bahrain solutions. As one of the top fit out companies in Bahrain, we specialize in luxury interior design Bahrain, affordable interior design Bahrain, villa interior design Bahrain, apartment interior design Bahrain, office fit out Bahrain, commercial fit out Bahrain, residential fit out Bahrain, hospitality fit out Bahrain, and retail fit out Bahrain projects with complete MEP works, civil maintenance services Bahrain, and custom joinery Bahrain.'),
('interior-fitouts-bahrain', 'meta-description', 'meta-tags', 'Leading interior fit out company Bahrain | Al Nawakhdha Furnitures offers comprehensive fit out works Bahrain including luxury interior design Bahrain, office fit out Bahrain, villa interior design Bahrain, retail fit out Bahrain, bespoke furniture Bahrain, custom joinery Bahrain, MEP works, and turnkey interior fit out Bahrain services in Nuwaidrat.'),
('interior-fitouts-bahrain', 'json-ld-description', 'json-ld', 'Full-service interior fit-outs and bespoke furniture manufacturing in Bahrain: design, joinery, installation, project management and MEP integration for residential, commercial and hospitality sectors.'),
('interior-fitouts-bahrain', 'seo-keywords', 'meta-tags', 'interior fit out company bahrain, fit out companies in bahrain, fit out contractor bahrain, interior design bahrain, bahrain interior design company, commercial fit out bahrain, residential fit out bahrain, office fit out bahrain, retail fit out bahrain, hospitality fit out bahrain, turnkey interior fit out bahrain, luxury interior design bahrain, villa interior design bahrain, apartment interior design bahrain, modern interior design bahrain, affordable interior design bahrain, best interior design company bahrain, interior designers bahrain, home renovation bahrain, office renovation bahrain, bespoke furniture bahrain, custom made wooden furniture bahrain, custom joinery bahrain, carpentry services bahrain, gypsum partition fitout, wall cladding fit out, glass partition installation, parquet flooring fitout, kitchen cabinet fitout, tv cabinet manufacturing, wooden doors bahrain, fire rated doors bahrain, MEP works, plumbing and sanitary works, electrical repair bahrain, aluminium works bahrain, commercial air conditioning bahrain, civil maintenance services bahrain, tailored bespoke furniture')
ON CONFLICT (page_slug, section_identifier) DO NOTHING;