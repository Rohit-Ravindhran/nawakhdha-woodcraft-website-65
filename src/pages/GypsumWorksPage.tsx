import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Home,
  Layers,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
  PaintBucket,
} from "lucide-react";
import { toast } from "sonner";

const GypsumWorksPage = () => {
  const handleRequestQuote = () => {
    window.location.href = "/contact";
    toast.success("Redirecting to contact page for quote request");
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://anfurnwll.com/gypsum-work-bahrain#service",
    name: "Gypsum Works in Bahrain",
    description:
      "Custom gypsum works in Bahrain including false ceilings, gypsum partitions, decorative ceiling designs, and wall features tailored to residential and commercial projects.",
    serviceType: "Gypsum Ceiling and Partition Services",
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
      "gypsum works Bahrain",
      "false ceiling Bahrain",
      "gypsum ceiling Bahrain",
      "gypsum partition Bahrain",
      "ceiling contractor Bahrain",
      "gypsum board Bahrain",
      "decorative ceiling Bahrain",
      "gypsum company Bahrain",
      "اعمال الجبس البحرين",
      "سقف جبس البحرين",
      "جبس بورد البحرين",
      "ديكور جبس البحرين",
    ],
  };

  const services = [
    "Gypsum false ceiling",
    "Gypsum board partitions",
    "Decorative ceiling designs",
    "Bulkhead ceiling works",
    "TV wall gypsum designs",
    "Cove lighting ceiling",
    "Office partition gypsum work",
    "Moisture-resistant gypsum solutions",
  ];

  const reasons = [
    { icon: Wrench, title: "Skilled Gypsum Workers", desc: "Experienced gypsum craftsmen in Bahrain delivering precise, professional results." },
    { icon: Sparkles, title: "Smooth Finishing", desc: "Detailed craftsmanship with seamless joints and flawless surfaces." },
    { icon: Ruler, title: "Modern & Custom Designs", desc: "Tailored ceiling and partition designs matched to your space." },
    { icon: ShieldCheck, title: "Durable & Crack-Resistant", desc: "Long-lasting installations built to maintain their finish over time." },
    { icon: Layers, title: "On-Time Completion", desc: "Reliable schedules and clean handovers on every project." },
    { icon: CheckCircle, title: "Affordable Solutions", desc: "Competitive gypsum pricing aligned with the Bahrain market." },
  ];

  const applications = [
    "Villas & apartments",
    "Offices & workspaces",
    "Retail shops",
    "Restaurants & cafes",
    "Commercial interiors",
  ];

  const process = [
    "Site inspection",
    "Design planning",
    "Material selection",
    "Installation",
    "Finishing & inspection",
  ];

  return (
    <>
      <Helmet>
        <title>Gypsum Works in Bahrain | False Ceiling, Partitions & Wall Designs</title>
        <meta
          name="description"
          content="Expert gypsum works in Bahrain including false ceilings, gypsum partitions, wall designs, and decorative ceilings. Professional installation by Al Nawakhdha Furnitures."
        />
        <meta
          name="keywords"
          content="gypsum works Bahrain, false ceiling Bahrain, gypsum ceiling Bahrain, gypsum partition Bahrain, ceiling contractor Bahrain, gypsum board Bahrain, gypsum design Bahrain, decorative ceiling Bahrain, gypsum company Bahrain, ceiling work Bahrain, اعمال الجبس البحرين, سقف جبس البحرين, جبس بورد البحرين, ديكور جبس البحرين, شركة جبس البحرين"
        />
        <link rel="canonical" href="https://anfurnwll.com/gypsum-work-bahrain" />

        <meta property="og:title" content="Gypsum Works in Bahrain | False Ceiling, Partitions & Wall Designs" />
        <meta property="og:description" content="Expert gypsum works in Bahrain including false ceilings, gypsum partitions, wall designs, and decorative ceilings. Professional installation by Al Nawakhdha Furnitures." />
        <meta property="og:url" content="https://anfurnwll.com/gypsum-work-bahrain" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gypsum Works in Bahrain | False Ceiling, Partitions & Wall Designs" />
        <meta name="twitter:description" content="Expert gypsum works in Bahrain including false ceilings, gypsum partitions, wall designs, and decorative ceilings. Professional installation by Al Nawakhdha Furnitures." />

        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <PaintBucket className="h-16 w-16 text-primary" />
              </div>
              <h1 className="heading-xl mb-6 text-foreground">Gypsum Works in Bahrain</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Al Nawakhdha Furnitures offers professional gypsum works in Bahrain, delivering modern and elegant interior solutions for homes and commercial spaces.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                From false ceilings to decorative gypsum wall designs, our team ensures smooth finishing, precise detailing, and high-quality workmanship.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-center mb-12 text-foreground">Our Gypsum Services</h2>
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
              Why Choose Us for Gypsum Works in Bahrain
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
            <h2 className="heading-lg mb-6">Upgrade your interiors with professional gypsum works in Bahrain</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Contact Al Nawakhdha Furnitures for customized ceiling and partition solutions.
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

        {/* Hidden SEO Footer */}
        <footer className="seo-footer-hidden">
          <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        </footer>
      </div>
    </>
  );
};

export default GypsumWorksPage;
