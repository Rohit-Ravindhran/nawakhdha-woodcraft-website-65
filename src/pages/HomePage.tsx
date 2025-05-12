
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProductsSection from '@/components/home/ProductsSection';
import BlogSection from '@/components/home/BlogSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import HomePageSEO from '@/components/home/HomePageSEO';
import { usePage } from '@/hooks/content';
import { useHomeProductsWithCategories } from '@/hooks/content/products';
import HomePageStatus from '@/components/home/HomePageStatus';
import PagePerformanceTracker from '@/components/home/PagePerformanceTracker';
import { parseJSON } from '@/utils/jsonHelpers';

const HomePage = () => {
  // Get page data
  const { data: homePageData, isLoading: loadingPage, error: pageError, refetch: refetchPage } = usePage('home');
  const { 
    data: homeProductsWithItems, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts
  } = useHomeProductsWithCategories();

  // Track if any section is loading
  const isLoading = loadingPage || productsLoading;
  
  // Get errors if any
  const errors = [];
  if (pageError) errors.push(`Page error: ${String(pageError)}`);
  if (productsError) errors.push(`Products error: ${String(productsError)}`);
  
  // Combine errors for display
  const error = errors.length > 0 ? errors.join(', ') : null;

  const handleRetry = () => {
    refetchPage();
    refetchProducts();
  };

  // Default SEO values in case homePageData doesn't exist
  const defaultSeo = {
    title: 'Nawakhdha Woodcraft | Handcrafted Furniture',
    description: 'Premium handcrafted furniture made with passion and expert craftsmanship',
    keywords: 'furniture, woodcraft, handcrafted, custom furniture',
  };

  return (
    <Layout>
      <HomePageSEO 
        title={defaultSeo.title}
        description={defaultSeo.description}
        keywords={defaultSeo.keywords}
        data={homePageData}
      />
      
      <PagePerformanceTracker pageName="home" />
      
      <HomePageStatus 
        isLoading={isLoading} 
        error={error} 
        onRetry={handleRetry}
      />

      <HeroSection heroData={parseJSON(homePageData?.hero)} />
      
      <ServicesSection 
        servicesData={parseJSON(homePageData?.services)} 
      />
      
      <ProductsSection 
        productsData={parseJSON(homePageData?.products)}
        isLoading={productsLoading}
        error={productsError ? String(productsError) : undefined}
      />
      
      <BlogSection 
        blogData={parseJSON(homePageData?.blog)} 
      />
      
      <CallToActionSection />
    </Layout>
  );
};

export default HomePage;
