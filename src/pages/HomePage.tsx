
import React, { useEffect, useState } from "react";
import { usePage } from "@/hooks/content";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import BlogSection from "@/components/home/BlogSection";
import { useHomeProductsWithItems } from "@/hooks/content/useHomeProducts";
import { supabase } from "@/integrations/supabase/client";
import { parseJSON } from "@/utils/jsonHelpers";
import { HomeServiceData, HomeBlogCardData } from "@/hooks/content/types";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [services, setServices] = useState<HomeServiceData[]>([]);
  const [blogPosts, setBlogPosts] = useState<HomeBlogCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the hook to fetch home products with their related items
  const { 
    data: homeProductsWithItems, 
    isLoading: isLoadingProducts,
    error: productsError 
  } = useHomeProductsWithItems();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch page data
        const { data: pageResult, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('page_name', 'home')
          .maybeSingle();
        
        if (pageError) throw pageError;

        // Fetch services from home_services table
        const { data: servicesData, error: servicesError } = await supabase
          .from('home_services')
          .select('*');
        
        if (servicesError) throw servicesError;

        // Fetch blog posts from home_blog_cards table
        const { data: blogData, error: blogError } = await supabase
          .from('home_blog_cards')
          .select('*');
        
        if (blogError) throw blogError;

        // Set data only if we received it
        if (pageResult) setPageData(pageResult);
        if (servicesData) setServices(servicesData);
        if (blogData) setBlogPosts(blogData);

        // Log for debugging
        console.log("Home page data loaded:", {
          pageData: !!pageResult,
          servicesCount: servicesData?.length || 0,
          blogPostsCount: blogData?.length || 0
        });

      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Parse JSON data from page if it exists, using the safe parser
  const heroData = pageData?.hero ? parseJSON(pageData.hero) : null;
  
  // Format services data for the ServicesSection component
  const formattedServices = services.map(service => ({
    title: service.title || "",
    description: service.description || "",
    image: service.image_url || "https://placehold.co/400x400",
    image_alt: service.alt_text || `${service.title || "Service"} image`
  }));
  
  // Format blog posts data for the BlogSection component
  const formattedBlogPosts = blogPosts.map(post => ({
    id: post.id || "",
    title: post.title || "",
    excerpt: post.description || "",
    image: post.image_url || "https://placehold.co/400x400",
    image_alt: post.alt_text || `Blog post about ${post.title || "our workshop"}`,
    date: new Date().toLocaleDateString(),
    slug: post.slug || ""
  }));

  const pageTitle = pageData?.seo_title || "Custom Wooden Furniture, Doors & Maintenance Services in Bahrain | Nawakhdha Woodcraft";
  const pageDescription = pageData?.seo_description || "Expert wooden furniture, doors, and civil maintenance services tailored for homes and businesses across Bahrain. Handcrafted quality and modern design.";
  const pageKeywords = pageData?.seo_keywords || "wooden furniture, doors, civil maintenance, Bahrain, custom furniture, carpentry, plumbing, drainage";

  const isLoadingAny = isLoading || isLoadingProducts;
  const anyError = error || (productsError ? String(productsError) : null);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href="https://nawakhdha-woodcraft.com/" />
      </Helmet>

      <HeroSection heroData={heroData} />
      <ServicesSection servicesData={{ items: formattedServices }} />
      <ProductsSection 
        productsData={{ items: [] }} 
        homeProductsWithItems={homeProductsWithItems}
        isLoading={isLoadingProducts}
        error={productsError ? String(productsError) : null}
      />
      <CallToActionSection />
      <BlogSection 
        blogData={{ items: formattedBlogPosts }}
        isLoading={isLoading}
        error={error} 
      />

      {isLoadingAny && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md">
            <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
            <p>Loading content...</p>
          </div>
        </div>
      )}

      {anyError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md max-w-md">
            <p className="text-red-500 mb-2">Error loading data:</p>
            <p className="mb-4">{anyError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
