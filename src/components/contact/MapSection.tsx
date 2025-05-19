
import React from "react";
import SectionTitle from "@/components/ui/section-title";
import { ContactInfoData } from "@/hooks/content/types";

interface MapSectionProps {
  mapUrl: string | null;
}

const MapSection: React.FC<MapSectionProps> = ({ mapUrl }) => {
  // Create a Google Maps embed URL with the provided coordinates
  // Coordinates: 26.130824,50.5985907
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7164.823402140004!2d50.5985907!3d26.130824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzUxLjAiTiA1MMKwMzUnNTUuMCJF!5e0!3m2!1sen!2sbh!4v1716388819786!5m2!1sen!2sbh";
  
  return (
    <section className="bg-secondary/30 py-12">
      <div className="container-custom">
        <SectionTitle
          title="Our Location"
          subtitle="Visit our workshop and showroom in Manama, Bahrain."
          centered
        />
        <div className="aspect-video rounded-lg overflow-hidden border border-border">
          <iframe 
            src={mapUrl || defaultMapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Nawakhdha Woodcraft Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
