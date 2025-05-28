
import React from "react";

interface MapSectionProps {
  mapUrl: string | null;
}

const MapSection: React.FC<MapSectionProps> = ({ mapUrl }) => {
  console.log("🗺️ MapSection rendering with mapUrl:", mapUrl);

  // Default Google Maps embed URL with the provided coordinates
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.5648951!2d50.59854778465576!3d26.13098293201307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzUxLjUiTiA1MMKwMzUnNTQuOCJF!5e0!3m2!1sen!2sus!4v1000000000000!5m2!1sen!2sus";

  const embedUrl = mapUrl || defaultMapUrl;

  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="heading-md text-center mb-8">Find Us</h2>
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Al Nawakhdha Furniture Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
