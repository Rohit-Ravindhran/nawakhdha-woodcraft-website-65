
import { useRef } from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import MapSection from "@/components/contact/MapSection";
import QuoteCTA from "@/components/contact/QuoteCTA";
import { useContactData } from "@/hooks/contact/useContactData";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbNavigation from "@/components/ui/breadcrumb-navigation";
import InternalLinks from "@/components/seo/InternalLinks";

const ContactPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const { contactInfo, isLoading } = useContactData();
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Contact Us' }
  ];

  const relatedLinks = [
    {
      title: 'Our Products',
      href: '/products',
      description: 'View our furniture collection for your project'
    },
    {
      title: 'About Our Workshop',
      href: '/about',
      description: 'Learn about our craftsmanship and heritage'
    },
    {
      title: 'Workshop Blog',
      href: '/blog',
      description: 'Read about our latest furniture projects'
    }
  ];

  return (
    <>
      <PageSEO
        title="Contact Us - Get Custom Furniture Quote | Al Nawakhdha Furniture W.L.L"
        description="Contact Al Nawakhdha Furniture in Bahrain for custom wooden furniture quotes. Located in Nuwaidrat, serving Bahrain since 1975. Call +973-65008793 or visit our workshop."
        keywords="contact Al Nawakhdha, furniture quote Bahrain, custom furniture consultation, Nuwaidrat furniture workshop, wooden furniture makers Bahrain"
        url="/contact"
      />
      
      <div className="py-6">
        <div className="container-custom">
          <BreadcrumbNavigation items={breadcrumbItems} className="mb-6" />
        </div>
      </div>
      
      <ContactHero 
        title="Contact Us" 
        subtitle="Get in touch with our team to discuss your custom furniture needs and receive a personalized quote." 
      />

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm formRef={formRef} />
            </div>
            
            <div>
              <ContactInfo contactInfo={contactInfo} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <MapSection mapUrl={contactInfo?.map_url || null} />

      <div className="container-custom">
        <InternalLinks 
          title="Learn More About Us" 
          links={relatedLinks}
          variant="grid"
          className="py-12"
        />
      </div>

      {/* Request Quote CTA */}
      <QuoteCTA onRequestQuote={scrollToForm} />
    </>
  );
};

export default ContactPage;
