import React from "react";
import { Helmet } from "react-helmet-async";

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  author,
  category
}) => {
  const siteUrl = "https://anfurnwll.com";
  const siteName = "Al Nawakhdha Furnitures W.L.L";
  
  // Block indexing if on Lovable subdomain
  const isLovableDomain = typeof window !== 'undefined' && window.location.hostname.includes('lovable.app');
  const shouldNoIndex = noIndex || isLovableDomain;
  
  // Normalize the canonical URL to always use the custom domain
  const normalizeUrl = (incomingUrl: string | undefined) => {
    if (!incomingUrl) return siteUrl;
    try {
      const parsedUrl = new URL(incomingUrl, siteUrl);
      return `${siteUrl}${parsedUrl.pathname}`;
    } catch {
      return `${siteUrl}${incomingUrl.startsWith("/") ? incomingUrl : "/" + incomingUrl}`;
    }
  };

  const fullUrl = normalizeUrl(url);
  const canonical = normalizeUrl(canonicalUrl || url);
  const seoImage = image || `${siteUrl}/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png`;

  return (
    <Helmet>
      <title>{`${siteName} | ${title}`}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={shouldNoIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="author" content={siteName} />
      <meta name="application-name" content={siteName} />

      {/* Canonical URL (forced to use correct domain) */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={`${siteName} | ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && category && (
        <meta property="article:section" content={category} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional SEO */}
      <meta name="geo.region" content="BH" />
      <meta name="geo.placename" content="Bahrain" />
      <meta name="language" content="English" />
    </Helmet>
  );
};

export default PageSEO;
