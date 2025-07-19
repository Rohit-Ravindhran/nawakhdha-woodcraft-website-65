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
    "name": "Interior Fitout & Bespoke Manufacturing Service",
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
      "Interior Fit-Out",
      "Commercial Fitout",
      "Custom Fitouts",
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
      "Custom Fitouts Bahrain", 
      "Commercial Fitout Services",
      "Residential Fitouts Bahrain",
      "Bespoke Furniture Bahrain",
      "Joinery Contractor Bahrain",
      "Retail Fitout Contractor",
      "Luxury Villa Fitout Bahrain",
      "MEP Integrated Fitout",
      "Turnkey Interior Fitouts"
    ]
  };

  const features = [
    "Full design, specification, production, and installation services by in-house craftsmen and designers",
    "Expertise in joinery, decorative timber, laminate, solid wood parquet flooring, wall cladding, cabinetry, and millwork",
    "Project management including permits, MEP/HVAC/FIRE FIGHTING integration, scheduling, procurement, and BOQ execution",
    "High-end materials sourced internationally (Germany, Italy, China) with bespoke finishes",
    "Reliable service with quality, integrity, and timely delivery"
  ];

  const sectors = [
    { icon: Home, title: "Residential", description: "Villas, apartments & homes" },
    { icon: Briefcase, title: "Commercial", description: "Offices, retail spaces & showrooms" },
    { icon: Hotel, title: "Hospitality", description: "Hotels, cafés, restaurants" },
    { icon: Building, title: "Healthcare & Public", description: "Healthcare and public-sector fitouts" }
  ];

  const uniquePoints = [
    "Local Bahraini craftsmanship aligned with global fitout standards",
    "Bespoke solutions tailored to client style and function",
    "In-house production facility & joinery workshop",
    "Permit handling and coordination with Civil Defense & municipal authorities",
    "Turnkey delivery with minimal client oversight"
  ];

  const tags = [
    "bespoke fitout", "turnkey fitout", "custom joinery", "carpentry works", 
    "wall paneling", "interior wall cladding", "furniture & furnishing", 
    "plumbing & sanitary works", "MEP works", "civil works", "tailored bespoke furniture", 
    "retail fitouts", "commercial interiors", "residential interiors"
  ];

  const keywordLinks = {
    column1: [
      "Interior Fit Out Bahrain",
      "Custom Fitouts Bahrain", 
      "Commercial Fitout Services",
      "Residential Fitouts Bahrain",
      "Office Fit Out Company",
      "Bespoke Furniture Bahrain",
      "Joinery Contractor Bahrain",
      "Wall Cladding Fit Out",
      "Parquet Flooring Fitout",
      "Glass Partition Installation"
    ],
    column2: [
      "Luxury Villa Fitout Bahrain",
      "Retail Fitout Contractor",
      "Turnkey Interior Fitouts",
      "Hospitality Fitout Bahrain",
      "MEP Integrated Fitout",
      "Project Management Fitout",
      "Feature Lighting Fitout",
      "Gypsum Partition Fitout",
      "Bespoke Joinery Manufacturing",
      "Interior Decoration & Fit Out"
    ]
  };

  return (
    <>
      <Helmet>
        <title>Interior Fitout & Bespoke Manufacturing Services in Bahrain | Al Nawakhdha Furnitures</title>
        <meta name="description" content="Explore our comprehensive fitout services in Bahrain—from bespoke joinery and interior renovation to bespoke commercial fitouts. Al Nawakhdha Furnitures delivers quality craftsmanship in every space." />
        <meta name="keywords" content="interior fit out Bahrain, custom fitouts Bahrain, commercial fitout Bahrain, bespoke manufacturing Bahrain, residential fitouts Bahrain, office fit out Bahrain, turnkey fit out services, bespoke furniture Bahrain, joinery contractor Bahrain, wall paneling fitout, luxury villa fit out Bahrain, bespoke cabinetry Bahrain, MEP integration Bahrain, gypsum partitions Bahrain, project management fitout Bahrain, hospitality fit out Bahrain, retail fit out Bahrain, parquet flooring Bahrain, glass partition Bahrain, feature lighting fit out" />
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
              Interior & Commercial Fitout Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Al Nawakhdha Furnitures in Nuwaidrat, Bahrain offers expert interior fit-outs, custom fitouts, and bespoke furniture manufacturing. We blend design, functionality, and quality craftsmanship to deliver turnkey solutions for homes, offices, villas, retail, hospitality, and public sector projects.
            </p>
            <Button asChild size="lg" className="group">
              <Link to="/contact">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Our Fitout Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12">
              Why Choose Our Fitout Services?
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
            Core Applications & Sectors
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
              What Sets Us Apart
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
            Contact us today for a consultation and discover how our bespoke interior fitout services can bring your vision to life.
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
            Applications & Searches for Fitout Services in Bahrain
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