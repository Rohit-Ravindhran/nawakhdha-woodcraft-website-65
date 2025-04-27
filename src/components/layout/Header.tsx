
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const categories = [
    { name: "Doors - Western Designs", path: "/category/doors-western" },
    { name: "Doors - Modern Designs", path: "/category/doors-modern" },
    { name: "Doors - Middle Eastern Designs", path: "/category/doors-middle-eastern" },
    { name: "TV Cabinets", path: "/category/tv-cabinets" },
    { name: "Kitchen Cabinets", path: "/category/kitchen-cabinets" },
    { name: "Wardrobes", path: "/category/wardrobes" },
    { name: "Dining Tables & Chairs", path: "/category/dining-tables" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white bg-opacity-95 shadow-md backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 border-b border-border/50">
          <div className="text-sm text-muted-foreground">
            Since 1975 | Bahrain's Premier Furniture Workshop
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+97337777777"
              className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>+973 1777 7777</span>
            </a>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary font-playfair leading-none">
              Al Nawakhdha
              <span className="text-sm block font-normal text-muted-foreground">
                Furniture W.L.L
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
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
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/about" ? "text-primary" : ""
                  )}
                >
                  About
                </Link>
              </li>
              <li className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                    location.pathname.includes("/category") ? "text-primary" : ""
                  )}
                >
                  Categories <ChevronDown className="h-4 w-4" />
                </button>
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 z-50 w-64 bg-white shadow-lg rounded-md overflow-hidden">
                    <ul className="py-2">
                      {categories.map((category) => (
                        <li key={category.path}>
                          <Link
                            to={category.path}
                            className="block px-4 py-2 text-sm hover:bg-secondary"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/category"
                          className="block px-4 py-2 text-sm font-medium text-primary"
                        >
                          View All Categories →
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li>
                <Link
                  to="/contact"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/contact" ? "text-primary" : ""
                  )}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild>
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

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
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center justify-between w-full text-base font-medium"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isCategoriesOpen ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {isCategoriesOpen && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {categories.slice(0, 5).map((category) => (
                        <li key={category.path}>
                          <Link
                            to={category.path}
                            className="block text-sm hover:text-primary"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/category"
                          className="block text-sm font-medium text-primary"
                        >
                          View All Categories →
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
    </header>
  );
};

export default Header;
