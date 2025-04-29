import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";
import { useProducts } from "@/hooks/content";
import { Loader2 } from "lucide-react";

const ProductsPage = () => {
  // Product categories data
  const products = useProducts();

  return (
    <div className="section-padding">
      <div className="container-custom">
        <SectionTitle
          title="Our Products"
          subtitle="Explore our comprehensive collection of handcrafted wooden furniture and architectural elements, all created with exceptional craftsmanship."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <CategoryCard
              key={product.id}
              title={product.title}
              image={product.image}
              href={`/product/${product.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
