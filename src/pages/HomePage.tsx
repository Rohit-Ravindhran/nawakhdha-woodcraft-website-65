
import React from "react";
import { useHomeContent } from "@/hooks/content";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import BlogSection from "@/components/home/BlogSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import HomePageSEO from "@/components/home/HomePageSEO";

const HomePage = () => {
  const { data: homeData, isLoading, error } = useHomeContent();

  console.log("🏠 HomePage rendering with data:", { homeData, isLoading, error });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
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

  // Default values for SEO
  const defaultTitle = "Al Nawakhdha Furniture W.L.L - Premium Woodcraft & Furniture in Bahrain";
  const defaultDescription = "Bahrain's oldest and most reputed carpentry and furniture manufacturing workshop since 1975. Custom wooden furniture, doors, cabinets, wardrobes, dining tables and more crafted with excellence in Nuwaidrat, Bahrain.";
  const defaultKeywords = "furniture Bahrain, custom furniture, wooden doors Bahrain, kitchen cabinets, wardrobes, dining tables, carpentry Bahrain, Al Nawakhdha, Nuwaidrat furniture, handcrafted furniture, wooden furniture manufacturer";

  return (
    <>
      <HomePageSEO
        title={homeData?.seo_title || defaultTitle}
        description={homeData?.seo_description || defaultDescription}
        keywords={homeData?.seo_keywords || defaultKeywords}
        data={homeData}
      />
      
      <div className="min-h-screen">
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <BlogSection />
        <CallToActionSection />
      </div>
    </>
  );
};

export default HomePage;
