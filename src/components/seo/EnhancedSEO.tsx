
import React from "react";
import { Helmet } from "react-helmet-async";
import { PageData } from "@/hooks/content/types";

interface EnhancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  data?: PageData;
  noIndex?: boolean;
}

/**
 * Enhanced SEO component with comprehensive meta tags
 * Includes Open Graph, Twitter Cards, and additional SEO optimizations
 */
const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  data,
  noIndex = false
}) => {
  // Use data from props or fallback to defaults
  const seoTitle = data?.seo_title || title || "Al Nawakhdha Furnitures W.L.L - Premium Woodcraft & Furniture";
  const seoDescription = data?.seo_description || description || "Bahrain's oldest and most reputed carpentry and furniture manufacturing workshop since 1975. Custom wooden furniture, doors, cabinets, and more crafted with excellence.";
  const seoKeywords = data?.seo_keywords || keywords || "furniture Bahrain, custom furniture, wooden doors, kitchen cabinets, wardrobes, dining tables, carpentry Bahrain, Al Nawakhdha";
  const seoImage = image || "https://anfurnwll.com/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png";
  const canonicalUrl = data?.seo_canonical_url || url || "https://anfurnwll.com";

  // Site name and additional info
  const siteName = "Al Nawakhdha Furnitures W.L.L";
  const locale = "en_US";
  const alternateLocale = "ar_BH"; // Arabic for Bahrain

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{`${siteName} | ${seoTitle}`}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={siteName} />
      <meta name="application-name" content={siteName} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geographic targeting for Bahrain */}
      <meta name="geo.region" content="BH" />
      <meta name="geo.placename" content="Bahrain" />
      <meta name="geo.position" content="26.130982;50.598547" />
      <meta name="ICBM" content="26.130982, 50.598547" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:alt" content={data?.seo_image_alt || "Al Nawakhdha Furniture - Premium Woodcraft"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content={alternateLocale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@alnawakhdha" />
      <meta name="twitter:creator" content="@alnawakhdha" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={data?.seo_image_alt || "Al Nawakhdha Furniture - Premium Woodcraft"} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#8B4513" />
      <meta name="msapplication-TileColor" content="#8B4513" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate language versions */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ar" href={`${canonicalUrl}?lang=ar`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://enqplizqtwvquxliiygz.supabase.co" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch for better performance */}
      <link rel="dns-prefetch" href="https://enqplizqtwvquxliiygz.supabase.co" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    </Helmet>
  );
};

export default EnhancedSEO;
