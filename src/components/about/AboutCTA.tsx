
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutCTA = () => {
  return (
    <section className="section-padding bg-wood-dark text-white">
      <div className="container-custom text-center">
        <h2 className="heading-md mb-4">Ready to Create Your Dream Furniture?</h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Contact us today to discuss your custom furniture needs or to request a quote on any of our services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="secondary"
            className="bg-white text-wood-dark hover:bg-white/90"
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Link to="/products">Browse Our Collections</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
