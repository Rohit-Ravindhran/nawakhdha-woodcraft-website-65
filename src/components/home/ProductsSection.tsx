
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";
import { HomeProductData } from "@/hooks/content/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeProductsWithCategories } from "@/hooks/content/products";

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

// Interface with updated type definition
interface ProductsSectionProps {
  productsData: {
    section_title?: string;
    items?: Product[];
  } | null;
  defaultProducts?: Product[];
  isLoading?: boolean;
  error?: unknown;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  productsData, 
  defaultProducts = [],
  isLoading: propsIsLoading = false,
  error: propsError = null
}) => {
  // Use the refactored hook for fetching home products with categories
  const { 
    data: homeProductsWithItems, 
    isLoading: homeProductsIsLoading, 
    error: homeProductsError 
  } = useHomeProductsWithCategories();

  // Combine loading states from props and hook
  const isLoading = propsIsLoading || homeProductsIsLoading;
  
  // Use first non-null error
  const error = propsError || homeProductsError;
  
  // Map home products from database to the format expected by this component
  const mappedHomeProducts = React.useMemo(() => {
    return homeProductsWithItems?.map(product => ({
      id: product.id,
      title: product.category_name || 'Product',
      image: product.image_url || '/placeholder.svg',
      image_alt: product.alt_text || `${product.category_name || 'Product'} image`,
      slug: product.slug,
      category_slug: product.slug // Use the same slug for consistency
    })) || [];
  }, [homeProductsWithItems]);

  // Use products from props if provided, otherwise use home products from DB
  const products = React.useMemo(() => {
    // First try products from props (CMS data)
    if (productsData?.items && productsData.items.length > 0) {
      // Filter out items that don't have the minimum required data
      const validPropsProducts = productsData.items.filter(item => 
        item && (item.title || item.category_slug) && item.image
      );
      
      if (validPropsProducts.length > 0) {
        return validPropsProducts;
      }
    }
    
    // If no valid props products, use mapped home products from DB
    if (mappedHomeProducts.length > 0) {
      return mappedHomeProducts;
    }
    
    // Finally fall back to default products
    return defaultProducts;
  }, [productsData, mappedHomeProducts, defaultProducts]);

  // Debug information
  React.useEffect(() => {
    console.log('ProductsSection - Data loaded:', {
      fromPropsCount: productsData?.items?.length || 0,
      validPropsProducts: productsData?.items?.filter(item => 
        item && (item.title || item.category_slug) && item.image
      ).length || 0,
      fromDBCount: mappedHomeProducts.length,
      fromDefaultCount: defaultProducts.length,
      displayingCount: products.length,
      error: error ? String(error) : null,
      productsDataItems: productsData?.items,
      mappedHomeProducts: mappedHomeProducts
    });
  }, [productsData, mappedHomeProducts, defaultProducts, products, error]);

  // Handle loading state with skeleton UI
  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            title="Our Products"
            subtitle="Loading our product collection..."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={`skeleton-${index}`} className="flex flex-col space-y-2">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error && products.length === 0) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            title="Our Products"
            subtitle="We're having trouble loading our products. Please check back soon."
            centered
          />
          <div className="flex flex-col justify-center items-center py-10 text-red-500">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p className="text-center">Unable to load product data</p>
            {process.env.NODE_ENV !== 'production' && (
              <p className="text-sm text-muted-foreground mt-2">{String(error)}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // If we have no products to show
  if (products.length === 0) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            title={productsData?.section_title || "Our Products"}
            subtitle="Our product collection will be available soon."
            centered
          />
          <div className="flex justify-center items-center py-10">
            <p className="text-muted-foreground">No products available at the moment</p>
          </div>
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
            const productUrl = product.slug 
              ? `/product/${product.slug}`
              : product.category_slug
                ? `/product/${product.category_slug}`
                : `/product/${product.id || `product-${index}`}`;
                
            return (
              <CategoryCard
                key={product.id || index}
                title={product.title || product.category_slug || `Product ${index + 1}`}
                image={product.image}
                href={productUrl}
                imageAlt={product.image_alt || `${product.title || 'Product'} image`}
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
