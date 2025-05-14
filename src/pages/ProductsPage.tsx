
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";
import { useProducts } from "@/hooks/content";
import { Loader2 } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

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
            // Use the slug for URL if available, otherwise fall back to category_slug, and finally to ID
            const productUrl = product.slug 
              ? `/product/${product.slug}` 
              : product.category_slug 
                ? `/product/${product.category_slug}` 
                : `/product/${product.id}`;
              
            const imageUrl = product.category_image_url || product.image_url || "/placeholder.svg";
            const imageAlt = product.alt_text || product.category_name || "Product image";
              
            return (
              <CategoryCard
                key={product.id}
                title={product.category_name || product.product_name || "Product"}
                image={imageUrl}
                imageAlt={imageAlt}
                href={productUrl}
                imageComponent={
                  <OptimizedImage
                    src={imageUrl}
                    alt={imageAlt}
                    imageType="product"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
