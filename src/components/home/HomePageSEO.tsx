
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

/**
 * Component for managing SEO metadata for the home page
 * Includes structured data for better search engine visibility
 */
const HomePageSEO: React.FC<HomePageSEOProps> = ({ 
  title, 
  description, 
  keywords, 
  heroBackgroundImage,
  data 
}) => {
  // If data is provided, use values from it
  const seoTitle = data?.seo_title || title || "Al Nawakhdha Furniture W.L.L - Premium Woodcraft & Furniture";
  const seoDescription = data?.seo_description || description;
  const seoKeywords = data?.seo_keywords || keywords;
  
  // Organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Al Nawakhdha Furniture W.L.L",
    "description": seoDescription,
    "url": "https://nawakhdha-woodcraft.com/",
    "logo": "https://nawakhdha-woodcraft.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/nawakhdha-woodcraft",
      "https://www.instagram.com/nawakhdha-woodcraft"
    ]
  };
  
  // LocalBusiness structured data
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://nawakhdha-woodcraft.com",
    "name": "Al Nawakhdha Furniture W.L.L",
    "image": heroBackgroundImage,
    "url": "https://nawakhdha-woodcraft.com",
    "telephone": "+973-1234-5678",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Workshop Area",
      "addressLocality": "Manama",
      "postalCode": "10101",
      "addressCountry": "BH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.2235,
      "longitude": 50.5876
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Friday", "Saturday"],
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$"
  };
  
  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://nawakhdha-woodcraft.com/" />
      {heroBackgroundImage && (
        <meta property="og:image" content={heroBackgroundImage} />
      )}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {heroBackgroundImage && (
        <meta name="twitter:image" content={heroBackgroundImage} />
      )}
      
      {/* Canonical tag */}
      <link rel="canonical" href="https://nawakhdha-woodcraft.com/" />
      
      {/* Favicon */}
      <link rel="icon" href="/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png" type="image/png" />
      <link rel="apple-touch-icon" href="/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png" />
      
      {/* Preload critical assets */}
      {heroBackgroundImage && (
        <link rel="preload" href={heroBackgroundImage} as="image" />
      )}
      
      {/* Preconnect to your CDN domain */}
      <link rel="preconnect" href="https://enqplizqtwvquxliiygz.supabase.co" />
      
      {/* Add resource hints for improved performance */}
      <link rel="dns-prefetch" href="https://enqplizqtwvquxliiygz.supabase.co" />
      
      {/* Structured data for better SEO */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default React.memo(HomePageSEO);
