
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { useContactData } from "@/hooks/contact/useContactData";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { contactInfo, isLoading } = useContactData();

  // Format address with line breaks, handling both \n and /n patterns
  const formatAddress = (address: string) => {
    // Replace both \n and /n with actual line breaks
    const cleanAddress = address.replace(/\\n|\/n/g, '\n');
    return cleanAddress.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < cleanAddress.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 font-playfair">Al Nawakhdha</h3>
            <p className="text-sm text-muted-foreground mb-4">
              One of Bahrain's oldest and most reputed carpentry and furniture
              manufacturing workshops since 1975.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-playfair">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-playfair">Popular Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://nawakhdha-woodcraft-website-65.lovable.app/product/68ae2de3-747c-4bea-afd9-b3e7fa122276"
                  className="hover:text-primary transition-colors"
                >
                  Modern Wooden Doors
                </a>
              </li>
              <li>
                <a
                  href="https://nawakhdha-woodcraft-website-65.lovable.app/product/c8bf588b-b263-4802-9888-f309cc14530f"
                  className="hover:text-primary transition-colors"
                >
                  Kitchen Cabinets
                </a>
              </li>
              <li>
                <a
                  href="https://nawakhdha-woodcraft-website-65.lovable.app/product/cda7157c-db12-4e58-bbe2-a5b317a27f11"
                  className="hover:text-primary transition-colors"
                >
                  Bedroom Furniture
                </a>
              </li>
              <li>
                <a
                  href="https://nawakhdha-woodcraft-website-65.lovable.app/product/6c9754dc-781c-4161-a075-62157d85c6a5"
                  className="hover:text-primary transition-colors"
                >
                  Dining Tables & Chairs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-playfair">Contact Us</h3>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading contact info...</div>
            ) : (
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {contactInfo?.address ? formatAddress(contactInfo.address) : "Building #3828, Road No: 4368, Block No: 643, Nuwaidrat, Kingdom of Bahrain"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-primary shrink-0" />
                  {contactInfo?.phone ? (
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  ) : (
                    <span>Phone not available</span>
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  {contactInfo?.email ? (
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  ) : (
                    <span>Email not available</span>
                  )}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Al Nawakhdha Furniture W.L.L. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
