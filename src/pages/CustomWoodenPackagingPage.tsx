import React from "react";
import PageSEO from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CustomWoodenPackagingPage: React.FC = () => {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom Wooden Packaging Solutions",
    provider: {
      "@type": "LocalBusiness",
      name: "Al Nawakhdha Furnitures and Wood Works",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nuwaidrat",
        addressRegion: "Southern Governorate",
        addressCountry: "BH",
      },
      telephone: "+973-33133750",
      url: "https://anfurnwll.com/custom-wooden-packaging-bahrain-saudi-arabia",
    },
    areaServed: [
      { "@type": "Country", name: "Bahrain" },
      { "@type": "Country", name: "Saudi Arabia" },
    ],
    serviceType: [
      "custom wooden packaging",
      "wooden crates",
      "wooden boxes",
      "heat-treated ISPM 15 packaging",
      "dunnage and wedges",
      "modular pallet collars",
      "industrial packaging",
      "lightweight packaging for fragile goods"
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: "https://anfurnwll.com/custom-wooden-packaging-bahrain-saudi-arabia",
    },
    keywords: [
      "custom wooden packaging Bahrain",
      "wooden crates Bahrain",
      "wooden boxes Bahrain",
      "ISPM 15 packaging Saudi Arabia",
      "dunnage Bahrain",
      "pallet collars Bahrain",
      "industrial wooden packaging",
      "fragile goods packaging"
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Custom Wooden Packaging in Bahrain & Saudi Arabia"
        description="Custom wooden packaging: crates, boxes, dunnage, pallet collars. ISPM 15 heat-treated. Serving Bahrain and Saudi Arabia."
        keywords="custom wooden packaging Bahrain, wooden crates Bahrain, wooden boxes Bahrain, ISPM 15 packaging Saudi Arabia, dunnage Bahrain, pallet collars Bahrain, industrial packaging, fragile goods packaging"
        url="/custom-wooden-packaging-bahrain-saudi-arabia"
        type="article"
        canonicalUrl="/custom-wooden-packaging-bahrain-saudi-arabia"
      />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      {/* Intro */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container-custom">
          <header className="max-w-5xl mx-auto text-center">
            <h1 className="heading-xl mb-6 font-extrabold text-primary">Custom Wooden Packaging Solutions in Bahrain and Saudi Arabia</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Al Nawakhdha Furnitures and Wood Works, based in Nuwaidrat, Bahrain, is a premier provider of <strong>custom wooden packaging solutions</strong> serving clients across Bahrain and Saudi Arabia, including Riyadh, Dammam, and Jeddah. We specialize in designing and manufacturing bespoke wooden crates, boxes, dunnage, and export-compliant packaging systems using durable hardwood and softwood materials. Our <strong>heat-treated, ISPM 15-certified</strong> packaging ensures safe international shipping while meeting strict phytosanitary regulations. Whether you require <strong>heavy-duty industrial packaging</strong> or <strong>lightweight solutions for fragile goods</strong>, our expert team crafts each product to your exact size and design specifications, guaranteeing superior protection and logistical efficiency.
            </p>
          </header>
        </div>
      </section>

      <main>
        {/* Products */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-foreground mb-6">Our Custom Wooden Packaging Products</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Wooden Crates and Boxes</h3>
                <p className="text-muted-foreground">Our robust <strong>wooden crates and boxes</strong> are expertly crafted using premium hardwood and softwood, tailored to protect your products during storage and transportation. Suitable for a wide range of industries, these crates provide superior resistance to impacts, moisture, and environmental stresses, ensuring your goods arrive in perfect condition across Bahrain and Saudi Arabia.</p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Export-Ready Heat-Treated Packaging</h3>
                <p className="text-muted-foreground">We offer <strong>heat-treated wooden packaging</strong> solutions that strictly comply with ISPM 15 standards, which are essential for international shipping. Our export crates and boxes prevent pest infestations and meet customs requirements, making us a trusted partner for businesses looking to ship products worldwide securely.</p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Dunnage and Wedges for Cargo Protection</h3>
                <p className="text-muted-foreground">Custom-designed <strong>dunnage and wedges</strong> stabilize and secure cargo within containers and trucks, minimizing movement and preventing damage during transit. These wooden accessories are critical for industries transporting heavy machinery, automotive parts, and hazardous materials in Bahrain and Saudi Arabia.</p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Modular Pallet Collars and Packaging Systems</h3>
                <p className="text-muted-foreground">Our innovative <strong>modular pallet collars</strong> offer flexible packaging options that adapt to varying load sizes. These collars are lightweight yet durable, enabling easier handling, stacking, and protection of goods while optimizing storage space for retail, agriculture, and manufacturing sectors.</p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Heavy-Duty Industrial Packaging</h3>
                <p className="text-muted-foreground">Constructed with high-quality hardwood, our <strong>heavy-duty industrial packaging</strong> solutions withstand harsh conditions and heavy loads. Ideal for petrochemical, construction, and manufacturing industries, these packages provide long-lasting protection during storage and rough transport environments.</p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Lightweight Packaging Solutions for Fragile Goods</h3>
                <p className="text-muted-foreground">For sensitive products such as electronics, pharmaceuticals, and delicate components, we provide <strong>lightweight wooden packaging</strong> designed to absorb shocks and prevent damage. Our designs combine protective cushioning with custom dimensions to safeguard fragile items during handling and shipment.</p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-foreground mb-3">Custom Sizes and Designs as Per Requirement</h3>
                <p className="text-muted-foreground">At Al Nawakhdha Furnitures and Wood Works, we understand that every product is unique. That’s why we offer fully <strong>customized packaging solutions</strong>, from dimensions and wood type selection to finishing touches, ensuring your wooden packaging precisely matches your logistics and product protection needs.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <h2 className="heading-lg text-foreground mb-6">Industries We Serve with Custom Packaging</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Automotive Packaging Solutions</h3>
                <p className="text-muted-foreground">Our custom wooden packaging secures automotive components like engines, tires, and heavy equipment. We use durable hardwood crates and dunnage systems designed to reduce movement and absorb shocks, ensuring parts arrive damage-free to assembly lines and warehouses across Bahrain and Saudi Arabia.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pharmaceutical and Healthcare Packaging</h3>
                <p className="text-muted-foreground">We provide sterile and compliant packaging solutions crafted from lightweight wood materials, ideal for transporting medical devices, drugs, and healthcare supplies. Our export-ready packaging meets stringent pharmaceutical regulations to maintain product integrity from Bahrain to international markets.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Electronics and Spare Parts Packaging</h3>
                <p className="text-muted-foreground">Specialized anti-static wooden crates and cushioned packaging protect sensitive electronic components and spare parts. Our packaging solutions minimize electrostatic discharge risks and physical shocks, making them perfect for high-value products in the electronics and telecommunications industries.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Petrochemical and Chemical Industry Packaging</h3>
                <p className="text-muted-foreground">We design heavy-duty packaging built to safely transport hazardous and volatile chemicals. Our wooden crates comply with export regulations and provide secure containment to minimize spillage or contamination risks throughout shipping routes in Bahrain and Saudi Arabia.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Agriculture and Food Packaging</h3>
                <p className="text-muted-foreground">Our weather-resistant wooden packaging solutions preserve the freshness and quality of agricultural products such as grains, fruits, and vegetables. Designed to endure varying climatic conditions, our crates and boxes optimize farm-to-market logistics.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Construction and Heavy Machinery Packaging</h3>
                <p className="text-muted-foreground">Robust hardwood packaging safeguards heavy machinery, steel components, and construction materials during shipment and onsite storage. Custom crate designs provide extra reinforcement for the harsh conditions typical in construction and industrial sectors.</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-foreground mb-2">Retail and E-commerce Packaging</h3>
                <p className="text-muted-foreground">We offer custom wooden packaging tailored for retail and e-commerce businesses, including display crates and modular packaging systems that improve product handling, storage efficiency, and shelf appeal, enhancing your brand’s visibility across Bahrain and Saudi Arabia.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-lg text-foreground mb-6">Why Choose Al Nawakhdha Furnitures and Wood Works for Custom Packaging</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground max-w-4xl">
              <li><strong>Local Expertise &amp; Manufacturing:</strong> Based in Nuwaidrat, Bahrain, we provide fast, reliable service and hands-on quality control.</li>
              <li><strong>Wide Regional Reach:</strong> Serving Bahrain and major Saudi Arabian cities including Riyadh, Dammam, and Jeddah.</li>
              <li><strong>ISPM 15 and Export Compliance:</strong> Our heat-treated wooden packaging adheres to international phytosanitary regulations.</li>
              <li><strong>Premium Materials:</strong> Selection of durable hardwood and softwood ensures optimal strength, longevity, and cost-efficiency.</li>
              <li><strong>Customization:</strong> We offer full customization in size, design, and finishing to meet the exact needs of your product and supply chain.</li>
              <li><strong>Sustainable Practices:</strong> We prioritize eco-friendly sourcing and recycling programs to reduce environmental impact.</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="heading-lg mb-6">Request a Quote</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              For reliable and expertly crafted <strong>custom wooden packaging solutions</strong> in Bahrain and Saudi Arabia, trust Al Nawakhdha Furnitures and Wood Works. Contact us today to discuss your packaging requirements and receive a competitive quote tailored to your business needs.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/contact" aria-label="Request a quote for custom wooden packaging solutions in Bahrain and Saudi Arabia">
                Request for Quote
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer aria-hidden="true" className="sr-only">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      </footer>
    </div>
  );
};

export default CustomWoodenPackagingPage;
