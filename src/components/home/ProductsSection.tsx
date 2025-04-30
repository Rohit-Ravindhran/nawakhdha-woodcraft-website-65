
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";

interface Product {
  id?: string;
  title: string;
  image: string;
  image_alt?: string;
  link?: string;
}

interface ProductsSectionProps {
  productsData: {
    section_title?: string;
    items?: Product[];
  } | null;
  defaultProducts: Product[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ productsData, defaultProducts }) => {
  // Use admin-defined products or default if not available
  const products = productsData?.items && productsData.items.length > 0
    ? productsData.items.filter(item => item.title && item.image) 
    : defaultProducts;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          title={productsData?.section_title || "Our Products"}
          subtitle="Explore our diverse range of expertly crafted furniture products."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <CategoryCard
              key={index}
              title={product.title}
              image={product.image}
              href={product.link || `/product/${product.id || `product-${index}`}`}
              imageAlt={product.image_alt || `${product.title} product`}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link to="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
