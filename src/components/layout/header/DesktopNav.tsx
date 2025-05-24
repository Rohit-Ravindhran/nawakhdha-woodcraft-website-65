
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  products: Array<{ name: string; path: string }>;
}

const DesktopNav = ({ products }: DesktopNavProps) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center justify-between flex-grow">
      {/* Main Navigation */}
      <nav className="hidden md:block ml-10">
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
          <li>
            <Link
              to="/products"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                (location.pathname.includes("/product") || location.pathname === "/products") ? "text-primary" : ""
              )}
            >
              Our Products
            </Link>
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
      <Button asChild>
        <Link to="/contact">Request a Quote</Link>
      </Button>
    </div>
  );
};

export default DesktopNav;
