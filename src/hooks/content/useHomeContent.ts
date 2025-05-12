
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useHomeProductsWithItems } from "./useHomeProducts";
import { HomeServiceData, HomeBlogCardData } from "./types";
import { safeJsonParse } from "@/utils/jsonHelpers";

export function useHomeContent() {
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

  const isLoadingAny = isLoading || isLoadingProducts;
  const anyError = error || (productsError ? String(productsError) : null);

  // Function to handle retry for all data fetching
  const refetch = () => {
    setRetryCount(prev => prev + 1);
    refetchProducts();
  };

  return {
    pageData,
    services,
    blogPosts,
    homeProductsWithItems,
    isLoading: isLoadingAny,
    error: anyError,
    refetch
  };
}
