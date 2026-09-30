
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "./ProductsData";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsProductsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <Link 
            to="/" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Home
          </Link>
          
          <Link 
            to="/our-projects" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Our Projects
          </Link>

          <Link 
            to="/fire-rated-doors-bahrain" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Fire Rated Doors
          </Link>

          <Link 
            to="/aluminium-work-bahrain" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
            data-nav="aluminium-fabrication"
          >
            Aluminium and Steel Fabrication
          </Link>

          <Link 
            to="/interior-fitouts-bahrain" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
            data-nav="fit-outs"
          >
            Fit Outs
          </Link>

          <Link 
            to="/about" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            About
          </Link>

          <Link 
            to="/contact" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
