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
  noIndex?: boolean; // ✅ Add this
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
  data,
  noIndex = false // ✅ default to false
}) => {
  // Enhanced SEO meta tags for Al Nawakhdha Furnitures
  const enhancedTitle = "Al Nawakhdha Furnitures | Civil Maintenance & Fitouts Bahrain";
  const enhancedDescription = "Al Nawakhdha Furnitures in Nuwaidrat, Bahrain provides expert civil maintenance (plumbing, electrical, repairs), interior fit-outs, cabinetry, flooring, wall cladding, safety doors, aluminium works & AC services – all delivered with precision and care.";
  const enhancedKeywords = "civil maintenance bahrain, plumbing services bahrain, electrical repairs bahrain, gypsum works, interior fitouts bahrain, parquet flooring, kitchen cabinets bahrain, tv cabinets, wall cladding, wooden doors, safety doors, carpentry services, aluminium works, ac repair bahrain, custom wooden furniture, commercial air conditioning";

  return (
    <>
      <EnhancedSEO
        title={enhancedTitle}
        description={enhancedDescription}
        keywords={enhancedKeywords}
        image={heroBackgroundImage}
        data={data}
        type="website"
        noIndex={noIndex}
      />
      <LocalBusinessSchema />
    </>
  );
};

export default React.memo(HomePageSEO);