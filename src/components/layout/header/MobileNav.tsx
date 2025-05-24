
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  products: Array<{ name: string; path: string }>;
}

const MobileNav = ({ products }: MobileNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button className="md:hidden" onClick={toggleMenu}>
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border/50">
          <div className="container-custom py-4">
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className={cn(
                      "block text-base font-medium",
                      location.pathname === "/" ? "text-primary" : ""
                    )}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className={cn(
                      "block text-base font-medium",
                      location.pathname === "/about" ? "text-primary" : ""
                    )}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="flex items-center justify-between w-full text-base font-medium"
                  >
                    <span>Our Products</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isProductsOpen ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {isProductsOpen && (
                    <ul className="mt-2 ml-4 space-y-2 max-h-[200px] overflow-y-auto">
                      {products.map((product) => (
                        <li key={product.path}>
                          <Link
                            to={product.path}
                            className="block text-sm hover:text-primary"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/products"
                          className="block text-sm font-medium text-primary"
                        >
                          View All Products →
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={cn(
                      "block text-base font-medium",
                      location.pathname === "/contact" ? "text-primary" : ""
                    )}
                  >
                    Contact
                  </Link>
                </li>
                <li className="pt-2">
                  <Button asChild className="w-full">
                    <Link to="/contact">Request a Quote</Link>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
