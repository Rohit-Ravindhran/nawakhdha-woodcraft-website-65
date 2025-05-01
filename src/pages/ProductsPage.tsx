
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";
import { useProducts } from "@/hooks/content";
import { Loader2 } from "lucide-react";

const ProductsPage = () => {
  // Product categories data
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="section-padding">
        <div className="container-custom">
          <p className="text-center text-muted-foreground">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <SectionTitle
          title="Our Products"
          subtitle="Explore our comprehensive collection of handcrafted wooden furniture and architectural elements, all created with exceptional craftsmanship."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            return (
              <CategoryCard
                key={product.id}
                title={product.category_name || product.product_name || "Product"}
                image={product.category_image_url || "/placeholder.svg"}
                imageAlt={product.alt_text || product.category_name || "Product image"}
                href={`/product/${product.id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
