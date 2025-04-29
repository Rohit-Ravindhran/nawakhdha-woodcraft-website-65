
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  heroData: {
    background_image?: string;
    background_image_alt?: string;
    headline?: string;
    subheadline?: string;
    button_text?: string;
    button_link?: string;
  } | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroData }) => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div
        className="h-[85vh] bg-cover bg-center"
        style={{
          backgroundImage: `url('${heroData?.background_image || "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format"}')`
        }}
        role="img"
        aria-label={heroData?.background_image_alt || "Carpentry workshop banner"}
      ></div>
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container-custom">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {heroData?.headline || "Crafting Excellence Since 1975"}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {heroData?.subheadline || "Bahrain's premier carpentry and furniture manufacturing workshop, bringing your vision to life with exceptional craftsmanship."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {heroData?.button_text && (
                <Button asChild size="lg">
                  <Link to={heroData?.button_link || "/about"}>{heroData.button_text}</Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                <Link to="/contact">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
