
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";

const CallToActionSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1000&auto=format"
          alt="Carpentry workshop with tools and wood"
          imageType="hero"
          className="w-full h-full object-cover"
          cacheBusting={true}
        />
      </div>
      <div className="container-custom relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-lg text-white mb-4">
            Bring Your Vision to Life
          </h2>
          <p className="text-white/80 mb-4 text-lg">
            Ready to start your custom furniture project? Our expert team is
            ready to help transform your ideas into beautiful reality.
          </p>
          <p className="text-white/80 mb-8">
            Beyond joinery, we deliver{" "}
            <Link to="/interior-fitouts-bahrain" className="underline underline-offset-4 hover:text-white">
              complete interior fit-out services in Bahrain
            </Link>
            , fabricate{" "}
            <Link to="/aluminium-work-bahrain" className="underline underline-offset-4 hover:text-white">
              aluminium doors and windows
            </Link>{" "}
            and finish every space with{" "}
            <Link to="/gypsum-work-bahrain" className="underline underline-offset-4 hover:text-white">
              false ceiling and gypsum partition work
            </Link>
            .
          </p>

          <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            <Link to="/contact">Request a Custom Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
