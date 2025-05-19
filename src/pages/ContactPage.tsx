
import { useRef } from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import MapSection from "@/components/contact/MapSection";
import QuoteCTA from "@/components/contact/QuoteCTA";
import { useContactData } from "@/hooks/contact/useContactData";

const ContactPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const { contactInfo, isLoading } = useContactData();
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <ContactHero 
        title="Contact Us" 
        subtitle="Get in touch with our team to discuss your custom furniture needs." 
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

      {/* Request Quote CTA */}
      <QuoteCTA onRequestQuote={scrollToForm} />
    </>
  );
};

export default ContactPage;
