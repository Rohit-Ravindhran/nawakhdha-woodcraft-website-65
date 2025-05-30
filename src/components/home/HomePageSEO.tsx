
import React from "react";
import { Helmet } from "react-helmet-async";
import { PageData } from "@/hooks/content/types";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import EnhancedSEO from "@/components/seo/EnhancedSEO";

interface HomePageSEOProps {
  title: string;
  description: string;
  keywords: string;
  heroBackgroundImage?: string;
  data?: PageData;
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
  return (
    <>
      <EnhancedSEO
        title={title}
        description={description}
        keywords={keywords}
        image={heroBackgroundImage}
        data={data}
        type="website"
      />
      <LocalBusinessSchema />
    </>
  );
};

export default React.memo(HomePageSEO);
