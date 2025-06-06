
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";
import { useProducts } from "@/hooks/content";
import { Loader2 } from "lucide-react";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbNavigation from "@/components/ui/breadcrumb-navigation";
import InternalLinks from "@/components/seo/InternalLinks";

const ProductsPage = () => {
  // Product categories data
  const { data: products, isLoading, error } = useProducts();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products' }
  ];

  const relatedLinks = [
    {
      title: 'About Our Craftsmanship',
      href: '/about',
      description: 'Learn about our furniture making heritage since 1975'
    },
    {
      title: 'Request Custom Quote',
      href: '/contact',
      description: 'Get a personalized quote for your furniture project'
    },
    {
      title: 'Workshop Blog',
      href: '/blog',
      description: 'Read about our latest projects and woodworking insights'
    }
  ];

  if (isLoading) {
    return (
      <>
        <PageSEO
          title="Our Products - Al Nawakhdha Furniture W.L.L"
          description="Explore our comprehensive collection of handcrafted wooden furniture including doors, cabinets, wardrobes, dining sets and more. Premium furniture made in Bahrain since 1975."
          keywords="furniture Bahrain, wooden doors, kitchen cabinets, wardrobes, dining tables, custom furniture, handcrafted furniture, Al Nawakhdha"
          url="/products"
        />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </>
    );
  }

  if (error || !products) {
    return (
      <>
        <PageSEO
          title="Our Products - Al Nawakhdha Furniture W.L.L"
          description="Explore our comprehensive collection of handcrafted wooden furniture including doors, cabinets, wardrobes, dining sets and more. Premium furniture made in Bahrain since 1975."
          keywords="furniture Bahrain, wooden doors, kitchen cabinets, wardrobes, dining tables, custom furniture, handcrafted furniture, Al Nawakhdha"
          url="/products"
        />
        <div className="section-padding">
          <div className="container-custom">
            <p className="text-center text-muted-foreground">Failed to load products. Please try again later.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSEO
        title="Our Products - Premium Handcrafted Furniture | Al Nawakhdha Furniture W.L.L"
        description="Explore our comprehensive collection of handcrafted wooden furniture including Western & Middle Eastern doors, kitchen cabinets, wardrobes, dining sets and more. Premium furniture made in Bahrain since 1975."
        keywords="furniture Bahrain, wooden doors, kitchen cabinets, wardrobes, dining tables, custom furniture, handcrafted furniture, Al Nawakhdha, Western doors, Middle Eastern doors, modern furniture"
        url="/products"
      />
      
      <div className="section-padding">
        <div className="container-custom">
          <BreadcrumbNavigation items={breadcrumbItems} className="mb-8" />
          
          <SectionTitle
            title="Our Products"
            subtitle="Explore our comprehensive collection of handcrafted wooden furniture and architectural elements, all created with exceptional craftsmanship and attention to detail."
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
                />
              );
            })}
          </div>
          
          <InternalLinks 
            title="Explore More" 
            links={relatedLinks}
            variant="grid"
            className="mt-12"
          />
        </div>
      </div>
    </>
  );
}

export default ProductsPage;
