
import React from "react";
import { Helmet } from "react-helmet-async";

interface HomePageSEOProps {
  title: string;
  description: string;
  keywords: string;
  heroBackgroundImage?: string;
}

const HomePageSEO: React.FC<HomePageSEOProps> = ({ 
  title, 
  description, 
  keywords, 
  heroBackgroundImage 
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
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
