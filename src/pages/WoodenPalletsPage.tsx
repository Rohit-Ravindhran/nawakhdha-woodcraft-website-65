import React from "react";
import PageSEO from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WoodenPalletsPage: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Wooden Pallets",
    brand: {
      "@type": "Organization",
      name: "Al Nawakhdha Furnitures and Wood Works",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nuwaidrat",
        addressRegion: "Southern Governorate",
        addressCountry: "BH",
      },
    },
    description:
      "Manufacturer and supplier of softwood and hardwood wooden pallets, including Euro pallets, ISPM 15 heat-treated export pallets, heavy-duty and custom sizes for Bahrain and Saudi Arabia.",
    areaServed: [
      { "@type": "Country", name: "Bahrain" },
      { "@type": "Country", name: "Saudi Arabia" },
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: "https://anfurnwll.com/wooden-pallets-bahrain-saudi-arabia",
    },
    keywords: [
      "wooden pallets Bahrain",
      "wooden pallets Saudi Arabia",
      "softwood pallets",
      "hardwood pallets",
      "ISPM 15 heat treated pallets",
      "Euro pallets EPAL",
      "custom wooden pallets",
      "pallet collars",
      "pallet boxes",
    ],
  };

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Al Nawakhdha Furnitures",
    "url": "https://anfurnwll.com/wooden-pallets-bahrain",
    "telephone": "+973-33133750",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nuwaidrat",
      "addressLocality": "Nuwaidrat",
      "addressRegion": "Bahrain",
      "postalCode": "644",
      "addressCountry": "BH"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Nuwaidrat"
      },
      {
        "@type": "Country",
        "name": "Bahrain"
      },
      {
        "@type": "City",
        "name": "Riyadh"
      },
      {
        "@type": "City",
        "name": "Dammam"
      },
      {
        "@type": "City",
        "name": "Jeddah"
      },
      {
        "@type": "Country",
        "name": "Saudi Arabia"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Wooden Pallets and Packaging Products",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Standard Wooden Pallets",
          "category": "Wooden Pallets"
        },
        {
          "@type": "Product",
          "name": "Euro Pallets",
          "category": "Wooden Pallets"
        },
        {
          "@type": "Product",
          "name": "2-Way Wooden Pallets",
          "category": "Wooden Pallets"
        },
        {
          "@type": "Product",
          "name": "4-Way Wooden Pallets",
          "category": "Wooden Pallets"
        },
        {
          "@type": "Product",
          "name": "Heat-Treated ISPM 15 Export Pallets",
          "category": "Export Pallets"
        },
        {
          "@type": "Product",
          "name": "Heavy-Duty Wooden Pallets",
          "category": "Industrial Pallets"
        },
        {
          "@type": "Product",
          "name": "Recycled & Eco-Friendly Pallets",
          "category": "Sustainable Pallets"
        },
        {
          "@type": "Product",
          "name": "Pallet Collars and Pallet Boxes",
          "category": "Packaging Accessories"
        },
        {
          "@type": "Product",
          "name": "Custom-Sized Wooden Pallets",
          "category": "Custom Pallets"
        }
      ]
    },
    "keywords": [
      "wooden pallets Bahrain",
      "wooden pallet suppliers Bahrain",
      "custom wooden pallets Bahrain",
      "heat treated pallets Bahrain",
      "ISPM 15 pallets",
      "wooden pallets Saudi Arabia",
      "wooden pallet suppliers Saudi Arabia",
      "Euro pallets Bahrain",
      "pallet collars Bahrain",
      "heavy duty pallets Saudi Arabia",
      "recycled pallets Bahrain",
      "export pallets Bahrain",
      "المنصات الخشبية البحرين",
      "شراء منصات خشبية البحرين",
      "مورد منصات خشبية البحرين",
      "بالتات خشبية السعودية",
      "منصات خشبية السعودية",
      "صناديق خشبية للتغليف البحرين",
      "بالتة خشب البحرين"
    ],
    "serviceType": [
      "wooden pallets",
      "custom wooden pallets",
      "heat treated pallets",
      "ISPM 15 certified pallets",
      "export wooden pallets",
      "industrial wooden pallets",
      "recycled wooden pallets",
      "pallet collars",
      "wooden pallet boxes",
      "custom-sized pallets"
    ],
    "department": [
      {
        "@type": "Organization",
        "name": "Automotive Pallets",
        "description": "Custom pallets for automotive parts including engines, tires, and heavy components."
      },
      {
        "@type": "Organization",
        "name": "Retail & E-commerce Pallets",
        "description": "Display pallets and shelf-ready packaging solutions for retail and e-commerce logistics."
      },
      {
        "@type": "Organization",
        "name": "Pharmaceuticals & Healthcare Pallets",
        "description": "Sterile and secure pallets designed for pharmaceutical and healthcare product transport."
      },
      {
        "@type": "Organization",
        "name": "Agricultural Pallets",
        "description": "Weather-resistant pallets for grains, fruits, and vegetables."
      },
      {
        "@type": "Organization",
        "name": "Petrochemical & Oil & Gas Pallets",
        "description": "Heavy-duty pallets designed for hazardous materials and petrochemical industry needs."
      },
      {
        "@type": "Organization",
        "name": "Construction & Heavy Machinery Pallets",
        "description": "Robust pallets for bulky construction materials and heavy machinery."
      },
      {
        "@type": "Organization",
        "name": "Electronics & Spare Parts Pallets",
        "description": "Anti-static pallets and protective packaging for delicate electronics and spare parts."
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": "+973-XXXXXXXX",
      "url": "https://anfurnwll.com/contact-us",
      "email": "info@anfurnwll.com"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Wooden Pallets in Bahrain & Saudi Arabia"
        description="Softwood and hardwood wooden pallets, Euro and ISPM 15 export pallets, custom sizes—manufactured in Bahrain, serving Bahrain and Saudi Arabia."
        keywords="wooden pallets Bahrain, wooden pallets Saudi Arabia, softwood pallets, hardwood pallets, Euro pallets, ISPM 15 pallets, custom pallets"
        url="/wooden-pallets-bahrain-saudi-arabia"
        type="product"
        canonicalUrl="/wooden-pallets-bahrain-saudi-arabia"
      />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero / Intro */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container-custom">
          <header className="max-w-5xl mx-auto text-center">
            <h1 className="heading-xl mb-6 font-extrabold text-primary">Wooden Pallets in Bahrain and Saudi Arabia</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Al Nawakhdha Furnitures and Wood Works, headquartered in Nuwaidrat, Bahrain, we specialize in crafting and supplying high-quality wooden pallets to businesses across Bahrain and the Saudi Arabian market, including Riyadh, Dammam, and Jeddah. Our range includes softwood pallets for lightweight, cost-effective applications and hardwood pallets for heavy-duty, long-lasting performance. From custom-sized pallets to ISPM 15 heat-treated export pallets, we deliver solutions tailored to your industry’s exact requirements. Whether you need pallets for automotive, agriculture, retail, or oil &amp; gas, we ensure your goods are stored, handled, and transported safely and efficiently — locally and internationally.
            </p>
          </header>
        </div>
      </section>

      {/* Range */}
      <main>
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-foreground mb-6">Our Range of Wooden Pallets</h2>
            <p className="text-muted-foreground mb-8 max-w-4xl">
              We manufacture a diverse range of wooden pallets in both softwood and hardwood varieties, ensuring you get the right balance of strength, durability, and cost-effectiveness for your specific needs. All pallets are designed to meet international standards, making them ideal for both domestic logistics and global exports.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Standard Wooden Pallets</h3>
                <p className="text-muted-foreground">
                  Our standard softwood and hardwood pallets are versatile, affordable, and ideal for everyday storage and distribution. Widely used in warehouses, factories, and shipping yards, they’re a staple for businesses across Bahrain and Saudi Arabia.
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Euro Pallets</h3>
                <p className="text-muted-foreground">
                  We supply Euro pallets compliant with EUR/EPAL standards, crafted in hardwood for durability or softwood for lighter loads. Perfect for companies exporting goods to Europe, they ensure compatibility with international supply chain systems.
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">2-Way and 4-Way Wooden Pallets</h3>
                <p className="text-muted-foreground">
                  Available in both 2-way and 4-way entry designs, these pallets allow flexible handling by forklifts and pallet jacks. Built from hardwood for strength or softwood for lighter use, they suit diverse industries from manufacturing to e-commerce.
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Heat-Treated ISPM 15 Export Pallets</h3>
                <p className="text-muted-foreground">
                  Our ISPM 15 heat-treated pallets meet strict export regulations, preventing pest contamination and ensuring safe shipment worldwide. We offer both hardwood for heavy loads and softwood for cost-effective shipping solutions.
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Heavy-Duty Wooden Pallets</h3>
                <p className="text-muted-foreground">
                  Constructed primarily from hardwood, these pallets handle bulky and heavy machinery, construction materials, and industrial equipment. Ideal for sectors like oil &amp; gas and foundry operations.
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Recycled &amp; Eco-Friendly Pallets</h3>
                <p className="text-muted-foreground">
                  Sustainability matters. Our recycled softwood and hardwood pallets reduce environmental impact while providing reliable performance. Suitable for businesses in retail, agriculture, and manufacturing seeking eco-conscious solutions.
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Pallet Collars and Pallet Boxes</h3>
                <p className="text-muted-foreground">
                  We manufacture adjustable pallet collars and pallet boxes in both softwood and hardwood, providing flexible containment for varied cargo sizes.
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Custom-Sized Wooden Pallets</h3>
                <p className="text-muted-foreground">
                  Whatever your industry, we can create custom wooden pallets to match your exact specifications. From small retail display pallets to oversized industrial platforms, our team delivers precision-built solutions.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <h2 className="heading-lg text-foreground mb-6">Industries We Serve</h2>
            <p className="text-muted-foreground mb-8 max-w-4xl">
              Our wooden pallets are trusted by a wide range of industries across Bahrain and Saudi Arabia. Each sector benefits from material selection (softwood for lighter goods, hardwood for durability), custom sizing, and industry-specific design features.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Automotive</h3>
                <p className="text-muted-foreground">We design custom hardwood pallets for engines, gearboxes, and automotive components, as well as softwood pallets for lighter parts and accessories. These pallets ensure safe, stable transport, reducing risk of damage.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Retail &amp; E-commerce</h3>
                <p className="text-muted-foreground">Our softwood display pallets and Euro pallets help retailers manage bulk deliveries while improving in-store product presentation. Ideal for both large-scale distribution and last-mile logistics.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pharmaceuticals &amp; Healthcare</h3>
                <p className="text-muted-foreground">Lightweight softwood pallets provide cost-effective transport for packaged medical goods, while hardwood pallets ensure stability for heavier equipment and supplies. Sterile, export-ready options meet industry regulations.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Agriculture</h3>
                <p className="text-muted-foreground">From weather-resistant hardwood pallets for bulk grain transport to softwood pallets for fruit and vegetable shipments, our solutions protect freshness and quality during transit.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Petrochemical &amp; Oil &amp; Gas</h3>
                <p className="text-muted-foreground">Hardwood industrial pallets provide the load-bearing capacity required for transporting hazardous materials and heavy drums, ensuring compliance with safety and export regulations.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Construction &amp; Heavy Machinery</h3>
                <p className="text-muted-foreground">Built from durable hardwood, these pallets handle extreme weights and harsh site conditions, perfect for steel, stone, and machinery transportation.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Electronics &amp; Spare Parts</h3>
                <p className="text-muted-foreground">We manufacture anti-static pallets and protective wooden crates for fragile electronics. Softwood pallets are used for lighter, sensitive items, while hardwood pallets support heavy spare parts.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-foreground mb-6">Why Choose Al Nawakhdha Furnitures and Wood Works</h2>
            <ol className="list-decimal pl-6 space-y-2 text-muted-foreground max-w-4xl">
              <li>Local manufacturing in Nuwaidrat, Bahrain, ensuring faster lead times and quality control.</li>
              <li>Serving Bahrain and Saudi Arabia (Riyadh, Dammam, Jeddah) with cross-border delivery.</li>
              <li>Softwood and hardwood pallet options tailored to weight, cost, and durability requirements.</li>
              <li>ISPM 15 certified for international exports.</li>
              <li>Durable, sustainable, and recyclable materials.</li>
              <li>Full custom sizing to meet exact client specifications.</li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="heading-lg mb-6">Request a Quote</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Looking for wooden pallets in Bahrain or custom wooden pallets in Saudi Arabia? Contact Al Nawakhdha Furnitures and Wood Works today for a competitive quotation.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/contact" aria-label="Request a quote for wooden pallets in Bahrain and Saudi Arabia">
                Request for Quote
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer aria-hidden="true" className="sr-only">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </footer>
    </div>
  );
};

export default WoodenPalletsPage;
