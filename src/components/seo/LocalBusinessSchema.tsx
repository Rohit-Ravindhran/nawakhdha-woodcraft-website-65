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
    "@id": "https://nawakhdha-woodcraft-website-65.lovable.app/#business",
    "name": "Al Nawakhdha Furniture W.L.L",
    "alternateName": "Al Nawakhdha Woodcraft",
    "description": "Bahrain's oldest and most reputed carpentry and furniture manufacturing workshop since 1975. Custom wooden furniture, doors, cabinets, and more crafted with excellence.",
    "url": "https://nawakhdha-woodcraft-website-65.lovable.app",
    "logo": "https://nawakhdha-woodcraft-website-65.lovable.app/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png",
    "image": [
      "https://nawakhdha-woodcraft-website-65.lovable.app/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png"
    ],
    "telephone": "+973-65008793",
    "email": "info@alnawakhdha.com",
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
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Available Services",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Custom Furniture Manufacturing",
          "description": "Handcrafted wooden furniture including doors, cabinets, wardrobes, and dining sets"
        },
        {
          "@type": "Service",
          "name": "Carpentry Services",
          "description": "Professional carpentry and woodworking services"
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
    "@id": "https://nawakhdha-woodcraft-website-65.lovable.app/#organization",
    "name": "Al Nawakhdha Furniture W.L.L",
    "url": "https://nawakhdha-woodcraft-website-65.lovable.app",
    "logo": "https://nawakhdha-woodcraft-website-65.lovable.app/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png",
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
