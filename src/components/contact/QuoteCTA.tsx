
import React from "react";
import { Button } from "@/components/ui/button";

interface QuoteCTAProps {
  onRequestQuote: () => void;
}

const QuoteCTA: React.FC<QuoteCTAProps> = ({ onRequestQuote }) => {
  return (
    <section className="section-padding bg-wood-dark text-white">
      <div className="container-custom text-center">
        <h2 className="heading-md mb-4">Need a Custom Quote?</h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          For large projects or specialized custom work, let us prepare a detailed quote for you.
        </p>
        <Button 
          variant="secondary" 
          className="bg-white text-wood-dark hover:bg-white/90"
          onClick={onRequestQuote}
        >
          Request a Custom Quote
        </Button>
      </div>
    </section>
  );
};

export default QuoteCTA;
