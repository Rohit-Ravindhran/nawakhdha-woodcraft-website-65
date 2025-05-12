
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

const HomePage = () => {
  // Get page data
  const { data: homePageData, isLoading: loadingPage, error: pageError } = usePage('home');
  const { 
    data: homeProductsWithItems, 
    isLoading: productsLoading, 
    error: productsError 
  } = useHomeProductsWithCategories();

  // Track if any section is loading
  const isLoading = loadingPage || productsLoading;
  
  // Get errors if any
  const errors = [];
  if (pageError) errors.push(`Page error: ${String(pageError)}`);
  if (productsError) errors.push(`Products error: ${String(productsError)}`);
  
  // Combine errors for display
  const error = errors.length > 0 ? errors.join(', ') : null;

  return (
    <Layout>
      <HomePageSEO data={homePageData} />
      <PagePerformanceTracker pageName="home" />
      
      <HomePageStatus 
        isLoading={isLoading} 
        error={error} 
        pageExists={!!homePageData}
      />

      <HeroSection heroData={homePageData?.hero ? JSON.parse(homePageData.hero) : null} />
      
      <ServicesSection 
        servicesData={homePageData?.services ? JSON.parse(homePageData.services) : null} 
      />
      
      <ProductsSection 
        productsData={homePageData?.products ? JSON.parse(homePageData.products) : null}
        isLoading={productsLoading}
        error={productsError ? String(productsError) : undefined}
      />
      
      <BlogSection 
        blogData={homePageData?.blog ? JSON.parse(homePageData.blog) : null} 
      />
      
      <CallToActionSection />
    </Layout>
  );
};

export default HomePage;
