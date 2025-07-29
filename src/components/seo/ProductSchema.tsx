import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductSchemaProps {
  productName: string;
  description: string;
  categoryName: string;
  featuredImage?: string;
  galleryImages?: Array<{ url: string; alt?: string; caption?: string }>;
  productSlug?: string;
  seoKeywords?: string;
  specifications?: Array<{ name: string; value: string }>;
}

export function ProductSchema({
  productName,
  description,
  categoryName,
  featuredImage,
  galleryImages = [],
  productSlug,
  seoKeywords,
  specifications = []
}: ProductSchemaProps) {
  
  // Process keywords - limit to 15-20 keywords
  const processedKeywords = seoKeywords 
    ? seoKeywords.split(',').map(k => k.trim()).slice(0, 20)
    : [productName, categoryName, 'furniture Bahrain', 'custom furniture', 'Al Nawakhdha'];

  // Build image array
  const productImages = [];
  if (featuredImage) {
    productImages.push(featuredImage);
  }
  galleryImages.forEach(img => {
    if (img.url && !productImages.includes(img.url)) {
      productImages.push(img.url);
    }
  });

  // Product Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://anfurnwll.com/product/${productSlug || productName.toLowerCase().replace(/\s+/g, '-')}`,
    'name': productName,
    'description': description || `Premium ${productName} crafted by Al Nawakhdha Furniture. Custom wooden furniture manufacturing in Bahrain since 1975.`,
    'category': categoryName,
    'brand': {
      '@type': 'Brand',
      'name': 'Al Nawakhdha Furnitures W.L.L',
      '@id': 'https://anfurnwll.com/#organization'
    },
    'manufacturer': {
      '@type': 'Organization',
      'name': 'Al Nawakhdha Furnitures W.L.L',
      '@id': 'https://anfurnwll.com/#organization'
    },
    'image': productImages,
    'keywords': processedKeywords,
    'offers': {
      '@type': 'Offer',
      'availability': 'https://schema.org/InStock',
      'priceCurrency': 'BHD',
      'seller': {
        '@type': 'Organization',
        'name': 'Al Nawakhdha Furnitures W.L.L',
        '@id': 'https://anfurnwll.com/#organization'
      },
      'areaServed': {
        '@type': 'Country',
        'name': 'Bahrain'
      }
    },
    'isRelatedTo': {
      '@type': 'Organization',
      '@id': 'https://anfurnwll.com/#business'
    }
  };

  // Add specifications as additionalProperty if available
  if (specifications.length > 0) {
    productSchema['additionalProperty'] = specifications.map(spec => ({
      '@type': 'PropertyValue',
      'name': spec.name,
      'value': spec.value
    }));
  }

  // Add material property for furniture
  productSchema['material'] = 'Wood';
  productSchema['color'] = 'Natural Wood';

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
}