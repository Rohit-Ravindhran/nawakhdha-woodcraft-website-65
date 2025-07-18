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
    "description": "Certified wooden fire-rated doors designed to protect homes and commercial spaces in Bahrain. Rated for 30, 60, 90, and 120 minutes of fire resistance. Manufactured using flame-retardant cores, intumescent seals, and UL/EN/GSO-compliant fire hardware.",
    "image": "https://anfurnwll.com/images/fire-rated-door.jpg",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BHD",
      "availability": "https://schema.org/InStock",
      "url": "https://anfurnwll.com/fire-rated-doors-bahrain"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Al Nawakhdha Furnitures",
      "url": "https://anfurnwll.com"
    },
    "keywords": [
      "fire rated doors",
      "wooden fire doors",
      "fire resistant doors",
      "steel fire doors",
      "fire rated door Bahrain",
      "2 hour fire rated door",
      "90 minute fire door",
      "Class A fire door",
      "Class B fire door",
      "fire door manufacturers in Bahrain",
      "GSO certified fire door",
      "UL listed fire door",
      "EN 1634 fire door",
      "NFPA 80 fire door",
      "fireproof doors for homes",
      "commercial fire doors",
      "explosion proof door",
      "self-closing fire door",
      "double-leaf fire rated door"
    ],
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Fire Rating",
        "value": "30, 60, 90, 120 minutes"
      },
      {
        "@type": "PropertyValue",
        "name": "Compliance",
        "value": "UL 10B/C, NFPA 80, EN 1634, BS 476, GSO"
      },
      {
        "@type": "PropertyValue",
        "name": "Features",
        "value": "Intumescent seals, Smoke seals, Self-closing hardware, Solid wood or steel core"
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
          content="fire rated doors, fire resistant doors, wooden fire doors, steel fire doors, fire rated door Bahrain, 2 hour fire rated door, 90 minute fire door, Class A fire door, Class B fire door, fire door manufacturers in Bahrain, GSO certified fire door, UL listed fire door, EN 1634 fire door, NFPA 80 fire door, fireproof doors for homes, commercial fire doors, self-closing fire door, smoke-seal fire door, explosion proof door, double-leaf fire rated door" 
        />
        <link rel="canonical" href="https://anfurnwll.com/fire-rated-doors-bahrain" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Fire-Rated & Fire-Resistant Wooden Doors | Al Nawakhdha Furnitures Bahrain" />
        <meta property="og:description" content="Discover premium fire-rated safety doors in Bahrain from Al Nawakhdha Furnitures. Our wooden fire doors offer 30–120 min protection, UL/EN/NFPA-compliant assemblies, elegant finishes, and reliable performance for residential and commercial use." />
        <meta property="og:url" content="https://anfurnwll.com/fire-rated-doors-bahrain" />
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
                Al Nawakhdha Furniture is a trusted fire door manufacturer in Bahrain, specializing in premium wooden fire-rated doors. Based in Nuwaidrat, Bahrain, we craft fire doors that seamlessly blend safety, compliance, and elegant design—ideal for both residential and commercial applications.
                Our GSO-certified and Bahrain Civil Defense-approved fire doors are engineered to meet the highest fire safety standards. We offer a full range of fire-rated durations including 30, 60, 90, and 120 minutes, ensuring tailored protection for every building type and regulatory requirement.
                Whether you're looking for fireproof wooden doors for homes or commercial-grade fire doors, Al Nawakhdha delivers craftsmanship you can trust, backed by decades of experience and regional certification.
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
                  <p className="text-muted-foreground">90 minute fire door and 2 hour fire rated door options with Class A fire door and Class B fire door certifications for maximum safety compliance.</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Solid Construction</h3>
                  <p className="text-muted-foreground">Built with flame-retardant cores and equipped with smoke-seal fire door technology and intumescent seals for comprehensive protection.</p>
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
                  <p className="text-muted-foreground">UL listed fire door meeting NFPA 80 fire door, EN 1634 fire door, and GSO certified fire door standards for international quality assurance.</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Star className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Advanced Features</h3>
                  <p className="text-muted-foreground">Self-closing fire door mechanisms with optional vision panels, explosion proof door features, and double-leaf fire rated door configurations.</p>
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
                    <p className="text-muted-foreground">Perfect fireproof doors for homes, apartments, staircases, kitchens, and corridors requiring fire resistant doors compliance.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Building className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Commercial Spaces</h3>
                    <p className="text-muted-foreground">Ideal commercial fire doors for office buildings, corporate spaces, and fire escape routes in commercial facilities.</p>
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