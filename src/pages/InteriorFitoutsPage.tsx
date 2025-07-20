import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Building, Home, Hotel, Briefcase } from 'lucide-react';

const InteriorFitoutsPage: React.FC = () => {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Interior Fit outs & Bespoke Manufacturing Service",
    "provider": {
      "@type": "Organization",
      "name": "Al Nawakhdha Furnitures",
      "url": "https://anfurnwll.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nuwaidrat",
        "addressCountry": "BH"
      }
    },
    "description": "Full-service interior fit-outs and bespoke furniture manufacturing in Bahrain: design, joinery, installation, project management and MEP integration for residential, commercial and hospitality sectors.",
    "serviceType": [
      "Interior Fit-Outs",
      "Commercial Fit outs",
      "Custom Fit outs",
      "Bespoke Joinery",
      "Turnkey Interiors"
    ],
    "areaServed": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BH",
        "addressLocality": "Nuwaidrat"
      }
    },
    "keywords": [
      "Interior Fit Out Bahrain",
      "Custom Fit outs Bahrain", 
      "Commercial Fit out Services",
      "Residential Fit outs Bahrain",
      "Bespoke Furniture Bahrain",
      "Joinery Contractor Bahrain",
      "Retail Fit out Contractor",
      "Luxury Villa Fit out Bahrain",
      "MEP Integrated Fit out",
      "Turnkey Interior Fit outs"
    ]
  };

  const features = [
    "Full design, specification, production, and installation services by in-house craftsmen and designers as a leading fit out company in Bahrain",
    "Expertise in custom joinery, decorative timber, laminate, solid wood parquet flooring fitout, wall cladding fit out, kitchen cabinet fitout, TV cabinet manufacturing, and bespoke millwork",
    "Comprehensive project management including permits, MEP works, plumbing and sanitary works, electrical repair Bahrain, HVAC integration, civil maintenance services Bahrain, scheduling, procurement, and BOQ execution",
    "High-end materials sourced internationally (Germany, Italy, China) with bespoke finishes for luxury interior design Bahrain projects",
    "Reliable turnkey fitout service with quality, integrity, and timely delivery for affordable interior design Bahrain to luxury fit-outs"
  ];

  const sectors = [
    { icon: Home, title: "Residential Fit Out", description: "Villa interior design Bahrain, apartment interior design Bahrain, and home renovation Bahrain" },
    { icon: Briefcase, title: "Commercial Fit Out", description: "Office fit out Bahrain, office renovation Bahrain, retail fit out Bahrain & showrooms" },
    { icon: Hotel, title: "Hospitality Fit Out", description: "Hospitality fit out Bahrain for hotels, cafés, restaurants & leisure venues" },
    { icon: Building, title: "Healthcare & Public", description: "Modern interior design Bahrain for healthcare facilities and public-sector projects" }
  ];

  const uniquePoints = [
    "Local Bahraini craftsmanship aligned with global fit out standards as top fit out companies in Bahrain",
    "Tailored bespoke furniture and bespoke solutions designed by best interior design company Bahrain standards",
    "In-house production facility, custom joinery Bahrain workshop & carpentry services Bahrain capabilities",
    "Permit handling and coordination with Civil Defense & municipal authorities for fire rated doors Bahrain compliance",
    "Turnkey interior fit out Bahrain delivery with minimal client oversight and complete project management"
  ];

  const tags = [
    "interior fit out company bahrain", "fit out contractor bahrain", "fit out works bahrain", "turnkey interior fit out bahrain", 
    "custom joinery bahrain", "carpentry services bahrain", "bahrain interior design company", "interior designers bahrain",
    "wall cladding fit out", "gypsum partition fitout", "glass partition installation", "parquet flooring fitout",
    "bespoke furniture bahrain", "custom made wooden furniture bahrain", "plumbing and sanitary works", "MEP works", 
    "civil maintenance services bahrain", "electrical repair bahrain", "aluminium works bahrain", "commercial air conditioning bahrain",
    "kitchen cabinet fitout", "TV cabinet manufacturing", "wooden doors bahrain", "fire rated doors bahrain",
    "retail fit out bahrain", "office fit out bahrain", "commercial fit out bahrain", "residential fit out bahrain"
  ];

  const keywordLinks = {
    column1: [
      "Interior Fit Out Company Bahrain",
      "Fit Out Companies in Bahrain", 
      "Fit Out Contractor Bahrain",
      "Commercial Fit Out Bahrain",
      "Residential Fit Out Bahrain",
      "Office Fit Out Bahrain",
      "Luxury Interior Design Bahrain",
      "Affordable Interior Design Bahrain",
      "Villa Interior Design Bahrain",
      "Apartment Interior Design Bahrain",
      "Modern Interior Design Bahrain",
      "Best Interior Design Company Bahrain",
      "Interior Designers Bahrain",
      "Home Renovation Bahrain",
      "Office Renovation Bahrain"
    ],
    column2: [
      "Turnkey Interior Fit Out Bahrain",
      "Hospitality Fit Out Bahrain",
      "Retail Fit Out Bahrain",
      "Bespoke Furniture Bahrain",
      "Custom Made Wooden Furniture Bahrain",
      "Custom Joinery Bahrain",
      "Carpentry Services Bahrain",
      "Gypsum Partition Fitout",
      "Wall Cladding Fit Out",
      "Glass Partition Installation",
      "Parquet Flooring Fitout",
      "Kitchen Cabinet Fitout",
      "TV Cabinet Manufacturing",
      "Wooden Doors Bahrain",
      "Fire Rated Doors Bahrain"
    ]
  };

  return (
    <>
      <Helmet>
        <title>Interior Fit out & Bespoke Manufacturing Services in Bahrain | Al Nawakhdha Furnitures</title>
        <meta name="description" content="Leading interior fit out company Bahrain | Al Nawakhdha Furnitures offers comprehensive fit out works Bahrain including luxury interior design Bahrain, office fit out Bahrain, villa interior design Bahrain, retail fit out Bahrain, bespoke furniture Bahrain, custom joinery Bahrain, MEP works, and turnkey interior fit out Bahrain services in Nuwaidrat." />
        <meta name="keywords" content="interior fit out company bahrain, fit out companies in bahrain, fit out contractor bahrain, interior design bahrain, bahrain interior design company, commercial fit out bahrain, residential fit out bahrain, office fit out bahrain, retail fit out bahrain, hospitality fit out bahrain, turnkey interior fit out bahrain, luxury interior design bahrain, villa interior design bahrain, apartment interior design bahrain, modern interior design bahrain, affordable interior design bahrain, best interior design company bahrain, interior designers bahrain, home renovation bahrain, office renovation bahrain, bespoke furniture bahrain, custom made wooden furniture bahrain, custom joinery bahrain, carpentry services bahrain, gypsum partition fitout, wall cladding fit out, glass partition installation, parquet flooring fitout, kitchen cabinet fitout, tv cabinet manufacturing, wooden doors bahrain, fire rated doors bahrain, MEP works, plumbing and sanitary works, electrical repair bahrain, aluminium works bahrain, commercial air conditioning bahrain, civil maintenance services bahrain, tailored bespoke furniture" />
        <link rel="canonical" href="https://anfurnwll.com/interior-fitouts-bahrain" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              Interior Fit Out Company Bahrain | Commercial & Residential Fit Out Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Al Nawakhdha Furnitures is a leading interior fit out company Bahrain based in Nuwaidrat, offering comprehensive fit out works Bahrain including interior design Bahrain, bespoke furniture Bahrain, and turnkey interior fit out Bahrain solutions. As one of the top fit out companies in Bahrain, we specialize in luxury interior design Bahrain, affordable interior design Bahrain, villa interior design Bahrain, apartment interior design Bahrain, office fit out Bahrain, commercial fit out Bahrain, residential fit out Bahrain, hospitality fit out Bahrain, and retail fit out Bahrain projects with complete MEP works, civil maintenance services Bahrain, and custom joinery Bahrain.
            </p>
            <Button asChild size="lg" className="group">
              <Link to="/contact">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Our Fit out Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12">
              Why Choose Our Interior Fit Out Services Bahrain?
            </h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-secondary/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Applications & Sectors */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12">
            Fit Out Contractor Bahrain - Core Applications & Sectors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border border-border">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold font-playfair mb-2">{sector.title}</h3>
                  <p className="text-muted-foreground">{sector.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12">
              What Sets Us Apart as Bahrain Interior Design Company
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uniquePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-foreground text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us today for a consultation and discover how our turnkey interior fit out Bahrain services, custom made wooden furniture Bahrain, and interior decoration Bahrain can bring your vision to life with tailored bespoke furniture and complete project management.
          </p>
          <Button asChild size="lg" variant="secondary" className="group">
            <Link to="/contact">
              Get a Quote <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* SEO Footer Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12">
            Applications & Searches for Fit out Services in Bahrain
          </h2>
          
          {/* Keyword Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-3">
              {keywordLinks.column1.map((keyword, index) => (
                <Link 
                  key={index} 
                  to="/interior-fitouts-bahrain" 
                  className="block text-primary hover:text-primary-foreground hover:underline transition-colors"
                >
                  {keyword}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              {keywordLinks.column2.map((keyword, index) => (
                <Link 
                  key={index} 
                  to="/interior-fitouts-bahrain" 
                  className="block text-primary hover:text-primary-foreground hover:underline transition-colors"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InteriorFitoutsPage;