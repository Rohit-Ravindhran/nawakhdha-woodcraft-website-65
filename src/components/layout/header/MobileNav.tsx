
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
  const [isPalletsOpen, setIsPalletsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsProductsOpen(false);
    setIsPalletsOpen(false);
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

          <Collapsible open={isPalletsOpen} onOpenChange={setIsPalletsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 text-lg font-medium" data-nav="pallets-packaging">
                Pallets and Packaging
                <ChevronDown className={`h-4 w-4 transition-transform ${isPalletsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2 ml-4">
              <Link 
                to="/wooden-pallets-bahrain-saudi-arabia" 
                className="block py-2 text-sm transition-colors hover:text-primary min-h-[44px] flex items-center"
                onClick={handleLinkClick}
                data-nav-item="pallets"
              >
                Wooden Pallets
              </Link>
              <Link 
                to="/custom-wooden-packaging-bahrain-saudi-arabia" 
                className="block py-2 text-sm transition-colors hover:text-primary min-h-[44px] flex items-center"
                onClick={handleLinkClick}
                data-nav-item="packaging"
              >
                Wooden Packaging
              </Link>
            </CollapsibleContent>
          </Collapsible>

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
