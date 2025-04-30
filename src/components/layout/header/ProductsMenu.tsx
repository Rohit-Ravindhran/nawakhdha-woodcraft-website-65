
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

type Product = {
  name: string;
  path: string;
};

interface ProductsMenuContentProps {
  products: Product[];
}

const ProductsMenuContent = ({ products }: ProductsMenuContentProps) => {
  return (
    <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
      {products.map((product) => (
        <li key={product.path}>
          <NavigationMenuLink asChild>
            <Link
              to={product.path}
              className="block select-none space-y-1 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            >
              {product.name}
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
      <li className="md:col-span-2">
        <NavigationMenuLink asChild>
          <Link
            to="/products"
            className="block select-none rounded-md p-3 text-sm font-medium text-primary leading-none no-underline outline-none transition-colors hover:bg-accent"
          >
            View All Products →
          </Link>
        </NavigationMenuLink>
      </li>
    </ul>
  );
};

export default ProductsMenuContent;
