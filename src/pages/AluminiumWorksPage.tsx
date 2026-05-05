import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building,
  CheckCircle,
  Home,
  Layers,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

const AluminiumWorksPage = () => {
  const handleRequestQuote = () => {
    window.location.href = "/contact";
    toast.success("Redirecting to contact page for quote request");
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://anfurnwll.com/aluminium-work-bahrain#service",
    name: "Aluminium Works in Bahrain",
    description:
      "Custom aluminium fabrication and installation services in Bahrain including aluminium doors, windows, glass partitions, and shopfronts tailored to client requirements.",
    serviceType: "Aluminium Fabrication and Installation",
    provider: {
      "@type": "LocalBusiness",
      "@id": "https://anfurnwll.com/#business",
      name: "Al Nawakhdha Furnitures W.L.L",
      url: "https://anfurnwll.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nuwaidrat",
        addressRegion: "Al Asimah",
        addressCountry: "Bahrain",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Bahrain",
    },
    keywords: [
      "aluminium works Bahrain",
      "custom aluminium Bahrain",
      "aluminium fabrication Bahrain",
      "aluminium doors Bahrain",
      "aluminium windows Bahrain",
      "glass partition Bahrain",
      "aluminium contractor Bahrain",
      "aluminium company Bahrain",
      "اعمال الالمنيوم البحرين",
      "ابواب المنيوم البحرين",
      "نوافذ المنيوم البحرين",
    ],
  };

  const services = [
    "Aluminium doors (sliding, hinged, folding)",
    "Aluminium windows (casement, sliding, fixed)",
    "Glass partitions & office cabins",
    "Aluminium & glass shopfronts",
    "Curtain wall systems",
    "Aluminium cladding works",
    "Balcony aluminium railings",
    "Shower enclosures",
    "Custom aluminium fabrication",
  ];

  const reasons = [
    { icon: Wrench, title: "Experienced Fabricators", desc: "Skilled aluminium fabricators in Bahrain with years of on-site expertise." },
    { icon: ShieldCheck, title: "High-Quality Materials", desc: "Premium aluminium profiles, glass and hardware built to last." },
    { icon: Ruler, title: "Custom Designs", desc: "Tailored designs and sizes engineered around your space." },
    { icon: Layers, title: "Weather-Resistant", desc: "Strong, corrosion-resistant solutions made for Bahrain's climate." },
    { icon: Sparkles, title: "Clean Finishing", desc: "Precise, professional installation with a flawless final finish." },
    { icon: CheckCircle, title: "Competitive Pricing", desc: "Fair, transparent pricing aligned with the Bahrain market." },
  ];

  const applications = [
    "Villas & apartments",
    "Offices & corporate spaces",
    "Retail shops & showrooms",
    "Restaurants & cafes",
    "Commercial buildings",
  ];

  const process = [
    "Site visit & measurement",
    "Design & material selection",
    "Fabrication",
    "Installation",
    "Final quality check",
  ];

  return (
    <>
      <Helmet>
        <title>Aluminium Works in Bahrain | Aluminium Doors, Windows & Glass Solutions</title>
        <meta
          name="description"
          content="Professional aluminium works in Bahrain including aluminium doors, windows, partitions, and glass solutions. Custom fabrication by Al Nawakhdha Furnitures."
        />
        <meta
          name="keywords"
          content="aluminium works Bahrain, aluminium fabrication Bahrain, aluminium doors Bahrain, aluminium windows Bahrain, glass partition Bahrain, aluminium company Bahrain, aluminium shopfront Bahrain, aluminium contractor Bahrain, aluminium and glass work Bahrain, custom aluminium Bahrain, aluminium services Bahrain, aluminium fixing Bahrain, اعمال الالمنيوم البحرين, ابواب المنيوم البحرين, نوافذ المنيوم البحرين, شركة المنيوم البحرين, اعمال الزجاج والالمنيوم البحرين"
        />
        <link rel="canonical" href="https://anfurnwll.com/aluminium-work-bahrain" />

        <meta property="og:title" content="Aluminium Works in Bahrain | Aluminium Doors, Windows & Glass Solutions" />
        <meta property="og:description" content="Professional aluminium works in Bahrain including aluminium doors, windows, partitions, and glass solutions. Custom fabrication by Al Nawakhdha Furnitures." />
        <meta property="og:url" content="https://anfurnwll.com/aluminium-work-bahrain" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aluminium Works in Bahrain | Aluminium Doors, Windows & Glass Solutions" />
        <meta name="twitter:description" content="Professional aluminium works in Bahrain including aluminium doors, windows, partitions, and glass solutions. Custom fabrication by Al Nawakhdha Furnitures." />

        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Building className="h-16 w-16 text-primary" />
              </div>
              <h1 className="heading-xl mb-6 text-foreground">Aluminium Works in Bahrain</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Al Nawakhdha Furnitures, we provide high-quality aluminium works in Bahrain for residential, commercial, and industrial spaces. Our solutions combine durability, modern design, and precision fabrication to deliver long-lasting aluminium structures.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                From aluminium doors and windows to glass partitions and office enclosures, we ensure premium finishes and reliable installation across Bahrain.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">Our Aluminium Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((item) => (
                <Card key={item} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <p className="text-foreground font-medium">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">
              Why Choose Us for Aluminium Works in Bahrain
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reasons.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">Applications</h2>
            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div key={app} className="flex items-start space-x-3">
                  <Home className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground">{app}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">Our Process</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-6">
              {process.map((step, idx) => (
                <div key={step} className="text-center">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-foreground font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="heading-lg mb-6">Looking for reliable aluminium works in Bahrain?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Contact Al Nawakhdha Furnitures today for customized aluminium solutions tailored to your space.
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

export default AluminiumWorksPage;
