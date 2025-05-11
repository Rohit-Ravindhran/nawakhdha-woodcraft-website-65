
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";
import { useHomeProducts, useHomeProductsWithItems } from "@/hooks/content";

interface Product {
  id?: string;
  title: string;
  image: string;
  image_alt?: string;
  link?: string;
  description?: string;
  slug?: string;
  category_slug?: string;
}

interface ProductsSectionProps {
  productsData: {
    section_title?: string;
    items?: Product[];
  } | null;
  defaultProducts?: Product[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  productsData, 
  defaultProducts = [] 
}) => {
  // Fetch both regular home products and the ones with related items
  const { data: homeProducts, isLoading: isLoadingBasic } = useHomeProducts();
  const { data: homeProductsWithItems, isLoading: isLoadingWithItems } = useHomeProductsWithItems();
  
  const isLoading = isLoadingBasic || isLoadingWithItems;
  
  // Map home products from database to the format expected by this component
  const mappedHomeProducts = homeProducts?.map(product => ({
    id: product.id,
    title: product.category_name || 'Product',
    image: product.image_url || '/placeholder.svg',
    image_alt: product.alt_text,
    slug: product.slug
  })) || [];

  // Use products from props if provided, otherwise use home products from DB
  const products = productsData?.items && productsData.items.length > 0
    ? productsData.items.filter(item => item.title && item.image) 
    : mappedHomeProducts.length > 0 ? mappedHomeProducts : defaultProducts;

  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionTitle
          title={productsData?.section_title || "Our Products"}
          subtitle="Explore our diverse range of expertly crafted furniture products."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            // Use the appropriate routing approach based on available data
            // First priority: slug from the product itself
            // Second priority: category_slug if available
            // Fallback: product ID or index-based URL
            const productUrl = product.slug 
              ? `/product/${product.slug}`
              : product.category_slug
                ? `/product/${product.category_slug}`
                : `/product/${product.id || `product-${index}`}`;
                
            return (
              <CategoryCard
                key={index}
                title={product.title}
                image={product.image}
                href={productUrl}
                imageAlt={product.image_alt || `${product.title} product`}
              />
            );
          })}
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
