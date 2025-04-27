
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog
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
                <Link
                  to="/product/doors-modern"
                  className="hover:text-primary transition-colors"
                >
                  Modern Wooden Doors
                </Link>
              </li>
              <li>
                <Link
                  to="/product/kitchen-cabinets"
                  className="hover:text-primary transition-colors"
                >
                  Kitchen Cabinets
                </Link>
              </li>
              <li>
                <Link
                  to="/product/bedroom-furniture"
                  className="hover:text-primary transition-colors"
                >
                  Bedroom Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/product/dining-tables"
                  className="hover:text-primary transition-colors"
                >
                  Dining Tables & Chairs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-playfair">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  Building 1234, Road 5678, Block 123
                  <br />
                  Manama, Kingdom of Bahrain
                </span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="tel:+97317777777"
                  className="hover:text-primary transition-colors"
                >
                  +973 1777 7777
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="mailto:nawakhdha2058@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  nawakhdha2058@gmail.com
                </a>
              </li>
            </ul>
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
