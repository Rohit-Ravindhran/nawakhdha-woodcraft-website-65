
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { CategoryCard } from "@/components/ui/category-card";
import { useProducts } from "@/hooks/content";
import { PageLoader } from "@/components/ui/page-loader";
import { CategoryCardSkeleton } from "@/components/ui/content-skeleton";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbNavigation from "@/components/ui/breadcrumb-navigation";
import InternalLinks from "@/components/seo/InternalLinks";
import { Helmet } from "react-helmet-async";

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

  const footerSeoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": "Al Nawakhdha Furnitures - Product Categories",
        "url": "https://anfurnwll.com/products",
        "numberOfItems": 20,
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Outdoor Swings", "url": "https://anfurnwll.com/outdoor-swings-bahrain"},
          {"@type": "ListItem", "position": 2, "name": "Study Tables", "url": "https://anfurnwll.com/study-tables-bahrain"},
          {"@type": "ListItem", "position": 3, "name": "TV Cabinets", "url": "https://anfurnwll.com/tv-cabinets-bahrain "},
          {"@type": "ListItem", "position": 4, "name": "Walk-in Closets", "url": "https://anfurnwll.com/walk-in-closets-bahrain"},
          {"@type": "ListItem", "position": 5, "name": "Wall Cladding", "url": "https://anfurnwll.com/wall-cladding-bahrain"},
          {"@type": "ListItem", "position": 6, "name": "Wardrobes", "url": "https://anfurnwll.com/wardrobes-bahrain"},
          {"@type": "ListItem", "position": 7, "name": "Western Design Doors", "url": "https://anfurnwll.com/western-design-doors-bahrain"},
          {"@type": "ListItem", "position": 8, "name": "Showcases", "url": "https://anfurnwll.com/showcases-bahrain"},
          {"@type": "ListItem", "position": 9, "name": "Book Shelves", "url": "https://anfurnwll.com/book-shelves-bahrain"},
          {"@type": "ListItem", "position": 10, "name": "Kitchen Cabinets", "url": "https://anfurnwll.com/kitchen-cabinets-bahrain"},
          {"@type": "ListItem", "position": 11, "name": "Modern Design Doors", "url": "https://anfurnwll.com/modern-design-doors-bahrain"},
          {"@type": "ListItem", "position": 12, "name": "Parquet Flooring", "url": "https://anfurnwll.com/parquet-flooring-bahrain"},
          {"@type": "ListItem", "position": 13, "name": "Patio Furniture", "url": "https://anfurnwll.com/patio-furniture-bahrain"},
          {"@type": "ListItem", "position": 14, "name": "Teapoy", "url": "https://anfurnwll.com/teapoy-bahrain"},
          {"@type": "ListItem", "position": 15, "name": "Wall Partitions", "url": "https://anfurnwll.com/wall-partitions-bahrain"},
          {"@type": "ListItem", "position": 16, "name": "Bedroom Furniture", "url": "https://anfurnwll.com/bedroom-furniture-bahrain"},
          {"@type": "ListItem", "position": 17, "name": "Dining Table with Chairs", "url": "https://anfurnwll.com/dining-tables-chairs-bahrain"},
          {"@type": "ListItem", "position": 18, "name": "Dressing Table", "url": "https://anfurnwll.com/dressing-tables-bahrain"},
          {"@type": "ListItem", "position": 19, "name": "Middle Eastern Doors", "url": "https://anfurnwll.com/middle-eastern-design-doors-bahrain"},
          {"@type": "ListItem", "position": 20, "name": "Office Furniture", "url": "https://anfurnwll.com/office-furniture-bahrain"}
        ]
      },
      {
        "@type": "LocalBusiness",
        "name": "Al Nawakhdha Furnitures W.L.L.",
        "url": "https://anfurnwll.com",
        "logo": "https://anfurnwll.com/logo.png",
        "image": "https://anfurnwll.com/factory-showcase.jpg",
        "description": "Custom carpentry and bespoke interior fit-out solutions in Bahrain. Specialized in wardrobes, kitchen cabinets, fire-rated doors, partitions, and turnkey fit-out projects.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Nuwaidrat, Bahrain",
          "addressCountry": "BH"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+973-XXXXXXX",
          "contactType": "Customer Support"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do you provide custom carpentry services for homes and offices in Bahrain?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Al Nawakhdha Furnitures W.L.L. specializes in custom carpentry solutions for both residential and commercial spaces. We design and manufacture bespoke furniture, partitions, doors, and fit-out solutions tailored to your exact requirements."
            }
          },
          {
            "@type": "Question",
            "name": "Can you design and install fire-rated doors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! We are certified suppliers and installers of fire-rated doors in Bahrain, ensuring compliance with safety standards while offering elegant design choices."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer turnkey interior fit-out services?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide end-to-end interior fit-out solutions, including carpentry, gypsum works, flooring, and customized furniture to deliver a fully finished space ready for use."
            }
          },
          {
            "@type": "Question",
            "name": "Can I request a site visit and custom design consultation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Certainly! We offer on-site visits and design consultations to understand your space and provide customized furniture and fit-out recommendations. You can contact us to schedule an appointment."
            }
          },
          {
            "@type": "Question",
            "name": "Do you manufacture kitchen cabinets and wardrobes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we specialize in custom kitchen cabinets, wardrobes, and walk-in closets, designed and built to match your style, space, and storage needs."
            }
          },
          {
            "@type": "Question",
            "name": "Are your services available across Bahrain?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we serve all areas in Bahrain, including Manama, Riffa, Muharraq, Hamad Town, and surrounding regions."
            }
          },
          {
            "@type": "Question",
            "name": "Do you use MDF or solid wood for your furniture?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer both MDF and solid wood materials based on the project requirements and client preferences. Our team will guide you on the best choice for durability and aesthetics."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to complete a custom furniture project?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The timeline depends on the complexity and scale of the project. Generally, custom furniture orders take 2-4 weeks from design approval to delivery."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide civil maintenance and repair services?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we offer civil maintenance services, including carpentry repairs, flooring fixes, door adjustments, and general handyman services for homes and offices."
            }
          },
          {
            "@type": "Question",
            "name": "How can I request a custom quote from Al Nawakhdha Furnitures W.L.L.?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can request a custom quote by visiting our contact page here: https://anfurnwll.com/contact"
            }
          }
        ]
      }
    ]
  };

  if (isLoading) {
    return (
      <>
        <PageSEO
          title="Product Designs - Al Nawakhdha Furniture W.L.L"
          description="Explore our comprehensive collection of handcrafted wooden furniture including doors, cabinets, wardrobes, dining sets and more. Premium furniture made in Bahrain since 1975."
          keywords="furniture Bahrain, wooden doors, kitchen cabinets, wardrobes, dining tables, custom furniture, handcrafted furniture, Al Nawakhdha"
          url="/products"
        />
        <div className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !products) {
    return (
      <>
        <PageSEO
          title="Product Designs - Al Nawakhdha Furniture W.L.L"
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
        title="Product Designs - Premium Handcrafted Furniture | Al Nawakhdha Furniture W.L.L"
        description="Explore our comprehensive collection of handcrafted wooden furniture including Western & Middle Eastern doors, kitchen cabinets, wardrobes, dining sets and more. Premium furniture made in Bahrain since 1975."
        keywords="furniture Bahrain, wooden doors, kitchen cabinets, wardrobes, dining tables, custom furniture, handcrafted furniture, Al Nawakhdha, Western doors, Middle Eastern doors, modern furniture"
        url="/products"
      />
      
      <div className="section-padding">
        <div className="container-custom">
          <BreadcrumbNavigation items={breadcrumbItems} className="mb-8" />
          
          <SectionTitle
            title="Product Designs"
            subtitle="Explore our comprehensive collection of handcrafted wooden furniture and architectural elements, all created with exceptional craftsmanship and attention to detail."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              // Prioritize category_slug over other URL options
              const productUrl = product.category_slug 
                ? `/product/${product.category_slug}` 
                : product.slug 
                  ? `/product/${product.slug}` 
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
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(footerSeoSchema)}
        </script>
      </Helmet>
    </>
  );
}

export default ProductsPage;
