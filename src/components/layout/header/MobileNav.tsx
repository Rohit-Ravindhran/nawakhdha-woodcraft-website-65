
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
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
          <a 
            href="/" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Home
          </a>
          
          <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 text-lg font-medium">
                Our Products
                <ChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2 ml-4">
              <a 
                href="/products" 
                className="block py-2 text-sm transition-colors hover:text-primary"
                onClick={handleLinkClick}
              >
                All Products
              </a>
              {products.map((product) => (
                <a 
                  key={product.name}
                  href={product.path} 
                  className="block py-2 text-sm transition-colors hover:text-primary"
                  onClick={handleLinkClick}
                >
                  {product.name}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <a 
            href="/building-maintenance-services" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Building Maintenance Services
          </a>
          
          <a 
            href="/about" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            About
          </a>
          
          <a 
            href="/contact" 
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={handleLinkClick}
          >
            Contact
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
