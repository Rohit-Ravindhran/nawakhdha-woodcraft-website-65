
import React from "react";
import { Helmet } from "react-helmet-async";
import { PageData } from "@/hooks/content/types";

interface HomePageSEOProps {
  title: string;
  description: string;
  keywords: string;
  heroBackgroundImage?: string;
  data?: PageData; // Add data prop to support both ways of providing data
}

const HomePageSEO: React.FC<HomePageSEOProps> = ({ 
  title, 
  description, 
  keywords, 
  heroBackgroundImage,
  data 
}) => {
  // If data is provided, use values from it
  const seoTitle = data?.seo_title || title;
  const seoDescription = data?.seo_description || description;
  const seoKeywords = data?.seo_keywords || keywords;
  
  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <link rel="canonical" href="https://nawakhdha-woodcraft.com/" />
      
      {/* Preload critical assets */}
      {heroBackgroundImage && (
        <link rel="preload" href={heroBackgroundImage} as="image" />
      )}
      
      {/* Preconnect to your CDN domain */}
      <link rel="preconnect" href="https://enqplizqtwvquxliiygz.supabase.co" />
      
      {/* Add resource hints for improved performance */}
      <link rel="dns-prefetch" href="https://enqplizqtwvquxliiygz.supabase.co" />
    </Helmet>
  );
};

export default HomePageSEO;
