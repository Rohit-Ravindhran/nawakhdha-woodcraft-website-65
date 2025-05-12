import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import BlogSection from "@/components/home/BlogSection";
import { useHomeContent } from "@/hooks/content/useHomeContent";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { safeJsonParse } from "@/utils/jsonHelpers";

// Declare a global interface to add the ga property to the Window object
declare global {
  interface Window {
    ga?: (command: string, hitType: string, category: string, action: string, value?: number) => void;
  }
}

const HomePage = () => {
  const { 
    pageData, 
    services, 
    blogPosts, 
    homeProductsWithItems, 
    isLoading, 
    error, 
    refetch 
  } = useHomeContent();

  // Performance monitoring
  useEffect(() => {
    // Report page loading performance metrics
    if (typeof window !== 'undefined') {
      // Create PerformanceObserver for LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          console.log('LCP:', lastEntry.startTime / 1000, 'seconds');
          
          // Send to analytics if available
          if (window.ga) {
            window.ga('send', 'timing', 'Performance', 'LCP', lastEntry.startTime);
          }
        }
      });
      
      // Create PerformanceObserver for FID
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        if (firstEntry) {
          // Use type assertion for the FirstInputDelay entry
          const fidEntry = firstEntry as any;
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime, 'ms');
          
          // Send to analytics if available
          if (window.ga) {
            window.ga('send', 'timing', 'Performance', 'FID', 
              fidEntry.processingStart - fidEntry.startTime);
          }
        }
      });
      
      // Create PerformanceObserver for CLS
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
        
        // Send to analytics if available
        if (window.ga) {
          window.ga('send', 'event', 'Performance', 'CLS', clsValue);
        }
      });
      
      // Start observing
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Cleanup
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

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
    date: post.published_at || new Date().toLocaleDateString(),
    slug: post.slug || "",
  })).filter(post => post.title && post.slug); // Only show posts with title and slug

  const pageTitle = pageData?.seo_title || "Custom Wooden Furniture, Doors & Maintenance Services in Bahrain | Nawakhdha Woodcraft";
  const pageDescription = pageData?.seo_description || "Expert wooden furniture, doors, and civil maintenance services tailored for homes and businesses across Bahrain. Handcrafted quality and modern design.";
  const pageKeywords = pageData?.seo_keywords || "wooden furniture, doors, civil maintenance, Bahrain, custom furniture, carpentry, plumbing, drainage";

  // Parse hero data safely
  const heroData = safeJsonParse(pageData?.hero);

  // Handle retry for all data fetching
  const handleRetry = () => {
    refetch();
  };

  // Ensure homeProductsWithItems are properly mapped and validated
  const validatedProducts = React.useMemo(() => {
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
        
        {/* Preload critical assets */}
        {heroData?.background_image && (
          <link rel="preload" href={heroData.background_image} as="image" />
        )}
        
        {/* Preconnect to your CDN domain */}
        <link rel="preconnect" href="https://enqplizqtwvquxliiygz.supabase.co" />
        
        {/* Add resource hints for improved performance */}
        <link rel="dns-prefetch" href="https://enqplizqtwvquxliiygz.supabase.co" />
      </Helmet>

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

      {isLoading && (
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

      {error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-center text-red-600 mb-4">{String(error)}</p>
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
