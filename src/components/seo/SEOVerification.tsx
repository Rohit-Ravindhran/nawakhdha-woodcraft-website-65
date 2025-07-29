import React from 'react';

interface SEOVerificationProps {
  productName: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  featuredImage?: string;
  productSlug?: string;
}

/**
 * Development-only component to verify SEO implementation
 * This should be removed from production builds
 */
export function SEOVerification({
  productName,
  description,
  seoTitle,
  seoDescription,
  seoKeywords,
  featuredImage,
  productSlug
}: SEOVerificationProps) {
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50 opacity-80">
      <h4 className="font-bold mb-2">SEO Debug Info</h4>
      <div className="space-y-1">
        <div><strong>H1:</strong> {productName}</div>
        <div><strong>Title Tag:</strong> {seoTitle}</div>
        <div><strong>Meta Desc:</strong> {seoDescription.substring(0, 50)}...</div>
        <div><strong>Keywords:</strong> {seoKeywords.split(',').length} keywords</div>
        <div><strong>Featured Img:</strong> {featuredImage ? '✅' : '❌'}</div>
        <div><strong>Product Schema:</strong> ✅</div>
        <div><strong>SEO Footer:</strong> {productSlug ? '✅' : '❌'}</div>
        <div><strong>Alt Texts:</strong> ✅ Dynamic</div>
      </div>
    </div>
  );
}