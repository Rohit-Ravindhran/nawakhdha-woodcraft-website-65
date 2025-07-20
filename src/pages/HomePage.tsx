import React from "react";
import { useLocation } from "react-router-dom";
import { PageLoader } from "@/components/ui/page-loader";
import { useHomeContent } from "@/hooks/content";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import BlogSection from "@/components/home/BlogSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import HomePageSEO from "@/components/home/HomePageSEO";
import { safeJsonParse } from "@/utils/jsonHelpers";

const HomePage = () => {
  const { pageData, services, blogPosts, homeProductsWithItems, isLoading, error } = useHomeContent();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const hasUnwantedQuery = searchParams.has("elementor_library");

  const defaultTitle = "Al Nawakhdha Furniture W.L.L - Premium Woodcraft & Furniture in Bahrain";
  const defaultDescription =
    "Bahrain's oldest and most reputed carpentry and furniture manufacturing workshop since 1975. Custom wooden furniture, doors, cabinets, wardrobes, dining tables and more crafted with excellence in Nuwaidrat, Bahrain.";
  const defaultKeywords =
    "furniture Bahrain, custom furniture, wooden doors Bahrain, kitchen cabinets, wardrobes, dining tables, carpentry Bahrain, Al Nawakhdha, Nuwaidrat furniture, handcrafted furniture, wooden furniture manufacturer";

  const heroData = pageData?.hero ? safeJsonParse(pageData.hero) : null;
  const servicesData = pageData?.services ? safeJsonParse(pageData.services) : { section_title: "Our Services", items: services };
  const productsData = pageData?.products ? safeJsonParse(pageData.products) : { section_title: "Product Designs", items: homeProductsWithItems };
  const blogData = pageData?.blog ? safeJsonParse(pageData.blog) : { section_title: "From Our Workshop Blog", items: blogPosts };

  if (isLoading) {
    return <PageLoader size="lg" text="Loading homepage content..." className="min-h-screen" />;
  }

  if (error) {
    console.error("❌ HomePage error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomePageSEO
        title={pageData?.seo_title || defaultTitle}
        description={pageData?.seo_description || defaultDescription}
        keywords={pageData?.seo_keywords || defaultKeywords}
        data={pageData}
        noIndex={hasUnwantedQuery}
      />

      <div className="min-h-screen">
        <HeroSection heroData={heroData} />
        <ServicesSection servicesData={servicesData} isLoading={isLoading} error={error} />
        <ProductsSection productsData={productsData} isLoading={isLoading} error={error} />
        <BlogSection blogData={blogData} isLoading={isLoading} error={error} />
        <CallToActionSection />
      </div>
    </>
  );
};

export default HomePage;
