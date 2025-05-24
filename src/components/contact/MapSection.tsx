
import React from "react";

interface MapSectionProps {
  mapUrl: string | null;
}

const MapSection: React.FC<MapSectionProps> = ({ mapUrl }) => {
  console.log("🗺️ MapSection rendering with mapUrl:", mapUrl);

  if (!mapUrl) {
    console.warn("⚠️ No map URL provided to MapSection");
    return null;
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="heading-md text-center mb-8">Find Us</h2>
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
