import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, CheckCircle, Award, Building, Home, Star } from "lucide-react";
import { toast } from "sonner";

const FireRatedDoorsPage = () => {
  const handleRequestQuote = () => {
    // Navigate to contact page or open contact form
    window.location.href = "/contact";
    toast.success("Redirecting to contact page for quote request");
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wooden Fire-Rated Door",
    "brand": {
      "@type": "Organization",
      "name": "Al Nawakhdha Furnitures",
      "url": "https://anfurnwll.com"
    },
    "description": "Elevated wooden fire-rated doors (30–120 min) with flame-retardant core, intumescent seals, smoke seals, self-closing hardware, sound-insulation, compliant with UL, NFPA, EN standards.",
    "image": "https://anfurnwll.com/images/fire-rated-door.jpg",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BHD",
      "availability": "https://schema.org/InStock",
      "url": "https://anfurnwll.com/fire-rated-doors"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Al Nawakhdha Furnitures",
      "url": "https://anfurnwll.com"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Fire Rating",
        "value": "30, 60, 90, 120 minutes"
      },
      {
        "@type": "PropertyValue",
        "name": "Compliance",
        "value": "UL 10B/C, NFPA 80, EN 1634, BS 476"
      },
      {
        "@type": "PropertyValue",
        "name": "Features",
        "value": "Intumescent seals, Smoke seals, Self-closing hardware, Solid wood core"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Fire-Rated & Fire-Resistant Wooden Doors | Al Nawakhdha Furnitures Bahrain</title>
        <meta 
          name="description" 
          content="Discover premium fire-rated safety doors in Bahrain from Al Nawakhdha Furnitures. Our wooden fire doors offer 30–120 min protection, UL/EN/NFPA-compliant assemblies, elegant finishes, and reliable performance for residential and commercial use." 
        />
        <meta 
          name="keywords" 
          content="wooden fire doors, fire-rated doors, fire-resistant doors, safety doors, flame retardant doors, 30-minute fire door, 60-minute fire door, 90-minute fire door, 120-minute fire door, fire door assemblies, UL-listed fire doors, NFPA 80 compliant doors, EN 1634 rated doors, BS 476 fire doors, intumescent seals, smoke seals, fire-rated hardware, self-closing fire doors, self-latching fire doors, sound-insulated fire doors, custom fire doors, elegant fire doors, residential fire doors, commercial fire doors" 
        />
        <link rel="canonical" href="https://anfurnwll.com/fire-rated-doors" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Fire-Rated & Fire-Resistant Wooden Doors | Al Nawakhdha Furnitures Bahrain" />
        <meta property="og:description" content="Discover premium fire-rated safety doors in Bahrain from Al Nawakhdha Furnitures. Our wooden fire doors offer 30–120 min protection, UL/EN/NFPA-compliant assemblies, elegant finishes, and reliable performance for residential and commercial use." />
        <meta property="og:url" content="https://anfurnwll.com/fire-rated-doors" />
        <meta property="og:type" content="product" />
        <meta property="og:image" content="https://anfurnwll.com/images/fire-rated-door.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fire-Rated & Fire-Resistant Wooden Doors | Al Nawakhdha Furnitures Bahrain" />
        <meta name="twitter:description" content="Discover premium fire-rated safety doors in Bahrain from Al Nawakhdha Furnitures. Our wooden fire doors offer 30–120 min protection, UL/EN/NFPA-compliant assemblies, elegant finishes, and reliable performance for residential and commercial use." />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <h1 className="heading-xl mb-6 text-foreground">
                Fire-Rated & Fire-Resistant Doors
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Al Nawakhdha Furnitures is a trusted manufacturer of premium wooden fire-rated doors, 
                located in Nuwaidrat, Bahrain. Our doors are crafted to combine safety, compliance, 
                and elegant design, perfect for residential and commercial use.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Our Fire Doors Section */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">Why Choose Our Fire Doors?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Certified Fire Protection</h3>
                  <p className="text-muted-foreground">30, 60, 90, or 120 minutes of certified fire protection for maximum safety compliance.</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Solid Construction</h3>
                  <p className="text-muted-foreground">Built with flame-retardant cores and equipped with intumescent seals and smoke seals for comprehensive protection.</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Award className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Multiple Styles Available</h3>
                  <p className="text-muted-foreground">Choose from Flush, Grooved, Hand-Carved, CNC Carved, and Stile & Rail designs to match your aesthetic.</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Global Compliance</h3>
                  <p className="text-muted-foreground">Meets NFPA 80, EN 1634, BS 476, UL 10B/C, and ASTM E119 standards for international quality assurance.</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Star className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Advanced Features</h3>
                  <p className="text-muted-foreground">Self-closing, self-latching mechanisms with optional vision panels and fire-rated hardware.</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Home className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Elegant Finishes</h3>
                  <p className="text-muted-foreground">Beautiful wood finishes tailored to your interiors with acoustic insulation for added privacy and comfort.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">Applications</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Home className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Residential Applications</h3>
                    <p className="text-muted-foreground">Perfect for apartments, homes, staircases, kitchens, and corridors requiring fire safety compliance.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Building className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Commercial Spaces</h3>
                    <p className="text-muted-foreground">Ideal for office buildings, corporate spaces, and fire escape routes in commercial facilities.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Public Facilities</h3>
                    <p className="text-muted-foreground">Essential for hospitals, schools, government facilities, and other public buildings requiring enhanced safety measures.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Safety Critical Areas</h3>
                    <p className="text-muted-foreground">Specially designed for fire escape routes and areas where fire-resistant barriers are mandatory.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart Section */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">What Sets Us Apart</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Award className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Local Expertise + Global Compliance</h3>
                      <p className="text-muted-foreground">Combining Bahraini craftsmanship with international safety standards for unmatched quality.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Star className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Beauty Without Compromise</h3>
                      <p className="text-muted-foreground">Elegant finishes that maintain aesthetic appeal while ensuring maximum fire protection.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Complete Fire Door Assemblies</h3>
                      <p className="text-muted-foreground">Full assemblies including door leaf, frame, hardware, seals, and all necessary components.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Custom Solutions Available</h3>
                      <p className="text-muted-foreground">Custom sizes and finishes available on request to meet your specific project requirements.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="heading-lg mb-6">Ready to Enhance Your Fire Safety?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Contact us today for a custom quote on our premium fire-rated doors. 
              Our experts will help you choose the perfect solution for your project.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleRequestQuote}
              className="bg-background text-foreground hover:bg-background/90"
            >
              Request a Quote
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default FireRatedDoorsPage;