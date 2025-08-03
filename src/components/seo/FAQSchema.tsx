import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * Global FAQ Schema component that adds FAQPage JSON-LD structured data
 * This appears on all pages to help with FAQ Rich Results
 */
const FAQSchema: React.FC = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you provide custom carpentry services for homes and offices in Bahrain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Al Nawakhdha Furnitures W.L.L. specializes in custom carpentry solutions for both residential and commercial spaces. We design and manufacture bespoke furniture, partitions, doors, and fit-out solutions tailored to your exact requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Can you design and install fire-rated doors?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We are certified suppliers and installers of fire-rated doors in Bahrain, ensuring compliance with safety standards while offering elegant design choices."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer turnkey interior fit-out services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide end-to-end interior fit-out solutions, including carpentry, gypsum works, flooring, and customized furniture to deliver a fully finished space ready for use."
        }
      },
      {
        "@type": "Question",
        "name": "Can I request a site visit and custom design consultation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Certainly! We offer on-site visits and design consultations to understand your space and provide customized furniture and fit-out recommendations. You can contact us to schedule an appointment."
        }
      },
      {
        "@type": "Question",
        "name": "Do you manufacture kitchen cabinets and wardrobes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in custom kitchen cabinets, wardrobes, and walk-in closets, designed and built to match your style, space, and storage needs."
        }
      },
      {
        "@type": "Question",
        "name": "Are your services available across Bahrain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we serve all areas in Bahrain, including Manama, Riffa, Muharraq, Hamad Town, and surrounding regions."
        }
      },
      {
        "@type": "Question",
        "name": "Do you use MDF or solid wood for your furniture?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer both MDF and solid wood materials based on the project requirements and client preferences. Our team will guide you on the best choice for durability and aesthetics."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to complete a custom furniture project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The timeline depends on the complexity and scale of the project. Generally, custom furniture orders take 2-4 weeks from design approval to delivery."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide civil maintenance and repair services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer civil maintenance services, including carpentry repairs, flooring fixes, door adjustments, and general handyman services for homes and offices."
        }
      },
      {
        "@type": "Question",
        "name": "How can I request a custom quote from Al Nawakhdha Furnitures W.L.L.?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can request a custom quote by visiting our contact page here: https://anfurnwll.com/contact"
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export default React.memo(FAQSchema);