
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
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [services, setServices] = useState<HomeServiceData[]>([]);
  const [blogPosts, setBlogPosts] = useState<HomeBlogCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Use the hook to fetch home products with their related items
  const { 
    data: homeProductsWithItems, 
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useHomeProductsWithItems();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch page data with retry logic
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

        // Check for empty data
        if (!pageResult) {
          console.warn("No home page data found in database");
        }
        
        if (!servicesData || servicesData.length === 0) {
          console.warn("No services data found in database");
        }
        
        if (!blogData || blogData.length === 0) {
          console.warn("No blog data found in database");
        }

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
  }, [retryCount]);
  
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

  // Function to handle retry for all data fetching
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetchProducts();
  };

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
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p className="text-center font-medium">Loading content...</p>
            <p className="text-center text-muted-foreground text-sm mt-2">
              Fetching the latest data from our servers
            </p>
          </div>
        </div>
      )}

      {anyError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-center text-red-600 mb-4">{anyError}</p>
              <Button 
                onClick={handleRetry}
                className="w-full flex items-center justify-center"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
