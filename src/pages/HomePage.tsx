
import React, { useMemo } from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import BlogSection from "@/components/home/BlogSection";
import { useHomeContent } from "@/hooks/content/useHomeContent";
import { safeJsonParse } from "@/utils/jsonHelpers";
import PagePerformanceTracker from "@/components/home/PagePerformanceTracker";
import HomePageSEO from "@/components/home/HomePageSEO";
import HomePageStatus from "@/components/home/HomePageStatus";

const HomePage: React.FC = () => {
  const { 
    pageData, 
    services, 
    blogPosts, 
    homeProductsWithItems, 
    isLoading, 
    error, 
    refetch 
  } = useHomeContent();

  // Format services data for the ServicesSection component
  const formattedServices = useMemo(() => services.map(service => ({
    title: service.title || "",
    description: service.description || "",
    image: service.image_url || "https://placehold.co/400x400",
    image_alt: service.alt_text || `${service.title || "Service"} image`
  })), [services]);
  
  // Format blog posts data for the BlogSection component
  const formattedBlogPosts = useMemo(() => blogPosts.map(post => ({
    id: post.id || "",
    title: post.title || "",
    excerpt: post.description || "",
    image: post.image_url || "https://placehold.co/400x400",
    image_alt: post.alt_text || `Blog post about ${post.title || "our workshop"}`,
    date: post.published_at || new Date().toLocaleDateString(),
    slug: post.slug || "",
  })).filter(post => post.title && post.slug), [blogPosts]); // Only show posts with title and slug

  // SEO data
  const pageTitle = pageData?.seo_title || "Custom Wooden Furniture, Doors & Maintenance Services in Bahrain | Nawakhdha Woodcraft";
  const pageDescription = pageData?.seo_description || "Expert wooden furniture, doors, and civil maintenance services tailored for homes and businesses across Bahrain. Handcrafted quality and modern design.";
  const pageKeywords = pageData?.seo_keywords || "wooden furniture, doors, civil maintenance, Bahrain, custom furniture, carpentry, plumbing, drainage";

  // Parse hero data safely
  const heroData = useMemo(() => safeJsonParse(pageData?.hero), [pageData?.hero]);

  // Ensure homeProductsWithItems are properly mapped and validated
  const validatedProducts = useMemo(() => {
    if (!homeProductsWithItems) return [];
    
    return homeProductsWithItems.filter(product => {
      // Check for critical fields - skip if missing
      if (!product.slug) {
        console.error(`Product ${product.id} missing slug`);
        return false;
      }
      return true;
    });
  }, [homeProductsWithItems]);

  return (
    <>
      <PagePerformanceTracker />
      
      <HomePageSEO 
        title={pageTitle} 
        description={pageDescription} 
        keywords={pageKeywords} 
        heroBackgroundImage={heroData?.background_image}
      />

      <HeroSection heroData={heroData} />
      <ServicesSection servicesData={{ items: formattedServices }} />
      <ProductsSection 
        productsData={null}
        homeProductsWithItems={validatedProducts}
        isLoading={isLoading}
        error={error ? String(error) : null}
      />
      <CallToActionSection />
      <BlogSection 
        blogData={{ items: formattedBlogPosts }}
        isLoading={isLoading}
        error={error} 
      />

      <HomePageStatus 
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </>
  );
};

export default HomePage;
