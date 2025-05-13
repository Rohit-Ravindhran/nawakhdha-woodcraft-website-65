
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from "react-helmet-async";
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProductsSection from '@/components/home/ProductsSection';
import BlogSection from '@/components/home/BlogSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import { parseJSON } from '@/utils/jsonHelpers';
import { supabase } from '@/integrations/supabase/client';
import { PageData, HomeServiceData, HomeBlogCardData } from '@/hooks/content/types';
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Interface for the state of fetched data with loading and error states
 */
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Enum for standardized error messages
 */
enum ErrorMessages {
  PAGE_FETCH_ERROR = "Failed to load page data",
  SERVICES_FETCH_ERROR = "Failed to load services data",
  PRODUCTS_FETCH_ERROR = "Failed to load product data",
  BLOG_FETCH_ERROR = "Failed to load blog posts data",
  NETWORK_ERROR = "Network connection issue, please check your connection",
}

// Use PageData as the base for HomePageData interface
interface HomePageData extends PageData {
  hero?: string;
  services?: string;
  products?: string;
  blog?: string;
}

/**
 * Custom hook for fetching home page data
 * @returns FetchState<HomePageData> with data, loading and error states
 */
const useFetchHomePage = (): FetchState<HomePageData> => {
  const [state, setState] = useState<FetchState<HomePageData>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('page_name', 'home')
          .maybeSingle();

        if (error) throw error;

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        console.error("Error fetching home page:", error);
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : ErrorMessages.PAGE_FETCH_ERROR,
        });
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  return state;
};

/**
 * Custom hook for fetching home products
 * @returns FetchState<HomeProductData[]> with data, loading and error states
 */
const useFetchHomeProducts = (): FetchState<any[]> => {
  const [state, setState] = useState<FetchState<any[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const fetchProducts = async () => {
      try {
        // Restored original Supabase query as requested
        const { data, error } = await supabase
          .from('home_products')
          .select('*');

        if (error) throw error;

        setState({
          data: data || [],
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        console.error("Error fetching home products:", error);
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : ErrorMessages.PRODUCTS_FETCH_ERROR,
        });
      }
    };

    fetchProducts();

    return () => {
      abortController.abort();
    };
  }, []);

  return state;
};

/**
 * Custom hook for fetching home services
 * @returns FetchState<HomeServiceData[]> with data, loading and error states
 */
const useFetchHomeServices = (): FetchState<HomeServiceData[]> => {
  const [state, setState] = useState<FetchState<HomeServiceData[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const fetchServices = async () => {
      try {
        // Restored original Supabase query as requested
        const { data, error } = await supabase
          .from('home_services')
          .select('*');

        if (error) throw error;

        setState({
          data: data || [],
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        console.error("Error fetching home services:", error);
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : ErrorMessages.SERVICES_FETCH_ERROR,
        });
      }
    };

    fetchServices();

    return () => {
      abortController.abort();
    };
  }, []);

  return state;
};

/**
 * Custom hook for fetching blog posts
 * @returns FetchState<HomeBlogCardData[]> with data, loading and error states
 */
const useFetchBlogPosts = (): FetchState<HomeBlogCardData[]> => {
  const [state, setState] = useState<FetchState<HomeBlogCardData[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('home_blog_cards')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;

        setState({
          data: data || [],
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        console.error("Error fetching blog posts:", error);
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : ErrorMessages.BLOG_FETCH_ERROR,
        });
      }
    };

    fetchBlogPosts();

    return () => {
      abortController.abort();
    };
  }, []);

  return state;
};

/**
 * Format services data for display
 * @param services Raw services data from database
 * @returns Formatted services object with section title and items
 */
const formatServices = (services: HomeServiceData[]): { section_title: string; items: HomeServiceData[] } => {
  return {
    section_title: "Our Services",
    items: services.map(service => ({
      title: service.title || "Service",
      description: service.description || "",
      image_url: service.image_url || "https://placehold.co/400x400",
      alt_text: service.alt_text || "Service image",
      // Add image property for compatibility
      image: service.image_url || "https://placehold.co/400x400",
      image_alt: service.alt_text || "Service image"
    }))
  };
};

/**
 * Format products data for display
 * @param products Raw products data from database
 * @returns Formatted products object with section title and items
 */
const formatProducts = (products: any[]): { section_title: string; items: any[] } => {
  return {
    section_title: "Our Products",
    items: products.map(product => ({
      id: product.id,
      title: product.category_name || 'Product',
      image: product.image_url || '/placeholder.svg',
      image_alt: product.alt_text || `${product.category_name || 'Product'} image`,
      slug: product.slug
    }))
  };
};

/**
 * Format blog posts for display
 * @param posts Raw blog post data from database
 * @returns Formatted blog object with section title and items
 */
const formatBlogPosts = (posts: HomeBlogCardData[]): { section_title: string; items: any[] } => {
  return {
    section_title: "From Our Workshop Blog",
    items: posts.map(post => ({
      title: post.title || "Untitled Post",
      excerpt: post.description || "",
      image: post.image_url || "https://placehold.co/600x400?text=Blog+Image",
      image_alt: post.alt_text || `Blog post about ${post.title || 'woodworking'}`,
      slug: post.slug || "",
      published_at: new Date().toISOString()
    }))
  };
};

/**
 * HomePage component - main landing page of the application
 */
const HomePage: React.FC = () => {
  // Fetch all required data in parallel using custom hooks
  const { 
    data: homePageData, 
    loading: loadingPage, 
    error: pageError 
  } = useFetchHomePage();
  
  const { 
    data: productsData, 
    loading: loadingProducts, 
    error: productsError 
  } = useFetchHomeProducts();
  
  const {
    data: servicesData,
    loading: loadingServices,
    error: servicesError
  } = useFetchHomeServices();
  
  const {
    data: blogPostsData,
    loading: loadingBlogPosts,
    error: blogPostsError
  } = useFetchBlogPosts();

  // Track if any section is loading
  const isLoading = loadingPage || loadingProducts || loadingServices || loadingBlogPosts;
  
  // Collect all errors
  const errors = [];
  if (pageError) errors.push(`Page error: ${String(pageError)}`);
  if (productsError) errors.push(`Products error: ${String(productsError)}`);
  if (servicesError) errors.push(`Services error: ${String(servicesError)}`);
  if (blogPostsError) errors.push(`Blog error: ${String(blogPostsError)}`);
  
  // Combine errors for display
  const error = errors.length > 0 ? errors.join(', ') : null;

  /**
   * Handler for retrying data fetching
   */
  const handleRetry = useCallback(() => {
    // Re-fetch all data on retry
    window.location.reload();
  }, []);

  // Format data for section components
  const formattedServices = servicesData ? formatServices(servicesData) : null;
  const formattedProducts = productsData ? formatProducts(productsData) : null;
  const formattedBlogPosts = blogPostsData ? formatBlogPosts(blogPostsData) : null;

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Nawakhdha Woodcraft | Handcrafted Furniture</title>
          <meta name="description" content="Premium handcrafted furniture made with passion and expert craftsmanship" />
          <meta name="keywords" content="furniture, woodcraft, handcrafted, custom furniture" />
        </Helmet>
        
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="loading-overlay">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p className="text-center font-medium">Loading content...</p>
            <p className="text-center text-muted-foreground text-sm mt-2">
              Fetching the latest data from our servers
            </p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Helmet>
          <title>Nawakhdha Woodcraft | Handcrafted Furniture</title>
          <meta name="description" content="Premium handcrafted furniture made with passion and expert craftsmanship" />
          <meta name="keywords" content="furniture, woodcraft, handcrafted, custom furniture" />
        </Helmet>
        
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="error-overlay">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-center text-red-600 mb-4" data-testid="error-message">{String(error)}</p>
              <Button 
                onClick={handleRetry}
                className="w-full flex items-center justify-center"
                variant="default"
                data-testid="retry-button"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{homePageData?.seo_title || 'Nawakhdha Woodcraft | Handcrafted Furniture'}</title>
        <meta name="description" content={homePageData?.seo_description || 'Premium handcrafted furniture made with passion and expert craftsmanship'} />
        <meta name="keywords" content={homePageData?.seo_keywords || 'furniture, woodcraft, handcrafted, custom furniture'} />
      </Helmet>

      <HeroSection heroData={parseJSON(homePageData?.hero)} />
      
      <ServicesSection 
        servicesData={formattedServices}
        isLoading={loadingServices}
        error={servicesError}
      />
      
      <ProductsSection 
        productsData={formattedProducts}
        isLoading={loadingProducts}
        error={productsError ? String(productsError) : undefined}
      />
      
      <BlogSection 
        blogData={formattedBlogPosts}
        isLoading={loadingBlogPosts}
        error={blogPostsError}
      />
      
      <CallToActionSection />
    </>
  );
};

export default HomePage;
