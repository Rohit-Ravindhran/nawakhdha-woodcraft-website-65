import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * LocalBusiness structured data for Bahrain location
 * Helps with local SEO and avoids merchant warnings
 */
const LocalBusinessSchema = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://anfurnwll.com/#business",
    "name": "Al Nawakhdha Furnitures W.L.L",
    "alternateName": "Al Nawakhdha Woodcraft",
    "description": "Full-service civil maintenance and bespoke fitout company in Bahrain since 1975, offering plumbing, electrical, gypsum, flooring, cabinetry, wall cladding, safety doors, aluminium works, AC and turnkey interiors.",
    "url": "https://anfurnwll.com",
    "logo": "https://anfurnwll.com/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png",
    "image": [
      "https://anfurnwll.com/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png"
    ],
    "telephone": "+973-65008793",
    "email": "nawakhdha2058@gmail.com",
    "foundingDate": "1975",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Building #3828, Road No: 4368, Block No: 643",
      "addressLocality": "Nuwaidrat",
      "addressCountry": "BH",
      "addressRegion": "Bahrain"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.130982,
      "longitude": 50.598547
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "08:30",
        "closes": "17:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "08:30",
        "closes": "12:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "BHD",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "areaServed": {
      "@type": "Country",
      "name": "Bahrain"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 26.130982,
        "longitude": 50.598547
      },
      "geoRadius": "50000"
    },
    "keywords": [
      "civil maintenance Bahrain",
      "plumbing services Bahrain", 
      "electrical repairs Bahrain",
      "gypsum works Bahrain",
      "interior fitouts Bahrain",
      "parquet flooring Bahrain",
      "kitchen cabinets Bahrain",
      "tv cabinets Bahrain",
      "wall cladding Bahrain",
      "wooden doors Bahrain",
      "safety doors Bahrain",
      "custom wooden furniture",
      "carpentry services Bahrain",
      "aluminium works Bahrain",
      "commercial air conditioning Bahrain"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Civil Maintenance & Furniture Services",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Civil Maintenance Services",
          "description": "Comprehensive civil maintenance including plumbing, electrical repairs, and building maintenance"
        },
        {
          "@type": "Service",
          "name": "Interior Fit-outs",
          "description": "Complete interior fit-out solutions including gypsum works, parquet flooring, and wall cladding"
        },
        {
          "@type": "Service",
          "name": "Kitchen & TV Cabinets",
          "description": "Custom kitchen cabinetry and entertainment unit solutions"
        },
        {
          "@type": "Service",
          "name": "Wooden & Safety Doors",
          "description": "Custom wooden doors, fire-rated doors, and safety entrance doors"
        },
        {
          "@type": "Service",
          "name": "Carpentry & Aluminium Works",
          "description": "Professional carpentry services and aluminium fabrication works"
        },
        {
          "@type": "Service",
          "name": "Commercial Air Conditioning",
          "description": "Commercial AC installation, maintenance, and repair services"
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/alnawakhdha",
      "https://www.instagram.com/alnawakhdha"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://anfurnwll.com/#organization",
    "name": "Al Nawakhdha Furnitures W.L.L",
    "url": "https://anfurnwll.com",
    "logo": "https://anfurnwll.com/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png",
    "foundingDate": "1975",
    "founder": {
      "@type": "Person",
      "name": "Al Nawakhdha Family"
    },
    "numberOfEmployees": "10-50",
    "industry": "Furniture Manufacturing"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
