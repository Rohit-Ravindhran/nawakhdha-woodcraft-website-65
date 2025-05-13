import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProductsSection from '@/components/home/ProductsSection';
import BlogSection from '@/components/home/BlogSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import HomePageSEO from '@/components/home/HomePageSEO';
import HomePageStatus from '@/components/home/HomePageStatus';
import PagePerformanceTracker from '@/components/home/PagePerformanceTracker';
import { parseJSON } from '@/utils/jsonHelpers';
import { useHomeProductsWithCategories } from '@/hooks/content/products';
import { supabase } from '@/integrations/supabase/client';
import { 
  PageData,
  HomeServiceData, 
  HomeBlogCardData,
  HomeProductWithCategories,
  ServicesSectionData
} from '@/hooks/content/types';

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
  BLOG_FETCH_ERROR = "Failed to load blog posts data",
  NETWORK_ERROR = "Network connection issue, please check your connection",
}

/**
 * Interface for SEO configuration
 */
interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  heroBackgroundImage?: string;
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
const formatServices = (services: HomeServiceData[]): ServicesSectionData => {
  return {
    section_title: "Our Services",
    items: services.map(service => ({
      title: service.title || "Service",
      description: service.description || "",
      image: service.image_url || "https://placehold.co/400x400",
      image_alt: service.alt_text || "Service image",
      // Add image_url for HomeServiceData compatibility
      image_url: service.image_url || "https://placehold.co/400x400",
      alt_text: service.alt_text || "Service image"
    }))
  };
};

/**
 * Format products data for display
 * @param products Raw products data from database
 * @returns Formatted products object with section title and items
 */
const formatProducts = (products: HomeProductWithCategories[]): { section_title: string; items: Array<{ id?: string; title: string; image: string; image_alt?: string; slug?: string; }> } => {
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
const formatBlogPosts = (posts: HomeBlogCardData[]): { section_title: string; items: Array<{ title: string; excerpt?: string; image?: string; image_alt?: string; slug?: string; published_at?: string; }> } => {
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
 * Generate SEO configuration from page data
 * @param pageData Home page data from database
 * @returns SEO configuration object
 */
const generateSEOConfig = (pageData: HomePageData | null): SEOConfig => {
  const heroData = parseJSON<{ background_image?: string }>(pageData?.hero, {});
  
  return {
    title: pageData?.seo_title || 'Nawakhdha Woodcraft | Handcrafted Furniture',
    description: pageData?.seo_description || 'Premium handcrafted furniture made with passion and expert craftsmanship',
    keywords: pageData?.seo_keywords || 'furniture, woodcraft, handcrafted, custom furniture',
    heroBackgroundImage: heroData?.background_image
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
    data: homeProductsWithItems, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts
  } = useHomeProductsWithCategories();
  
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
  const isLoading = loadingPage || productsLoading || loadingServices || loadingBlogPosts;
  
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
    refetchProducts();
  }, [refetchProducts]);

  // Generate SEO configuration
  const seoConfig = generateSEOConfig(homePageData);

  // Format data for section components
  const formattedServices = servicesData ? formatServices(servicesData) : null;
  const formattedProducts = homeProductsWithItems ? formatProducts(homeProductsWithItems) : null;
  const formattedBlogPosts = blogPostsData ? formatBlogPosts(blogPostsData) : null;

  // Define elements to be rendered inside HomePageStatus
  const pageContent = (
    <>
      <HeroSection heroData={parseJSON(homePageData?.hero)} />
      <ServicesSection 
        servicesData={formattedServices}
        isLoading={loadingServices}
        error={servicesError}
      />
      <ProductsSection 
        productsData={formattedProducts}
        isLoading={productsLoading}
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

  return (
    <Layout>
      <HomePageSEO 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        heroBackgroundImage={seoConfig.heroBackgroundImage}
        data={homePageData}
      />
      
      <PagePerformanceTracker pageName="home" />
      
      <HomePageStatus 
        isLoading={isLoading} 
        error={error} 
        onRetry={handleRetry}
        pageExists={!!homePageData}
      >
        {pageContent}
      </HomePageStatus>
    </Layout>
  );
};

export default HomePage;
