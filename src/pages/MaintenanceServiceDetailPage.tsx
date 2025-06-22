
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMaintenanceCategoryBySlug, useMaintenanceDetailsByCategory, useMaintenanceGalleryByCategory } from '@/hooks/content/maintenance';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductMainContent } from '@/components/products/ProductMainContent';
import { ProductGalleryGrid } from '@/components/products/ProductGalleryGrid';
import { ProductNotFound } from '@/components/products/ProductNotFound';
import { ProductLoading } from '@/components/products/ProductLoading';
import BreadcrumbNavigation from '@/components/ui/breadcrumb-navigation';
import { PageSEO } from '@/components/seo/PageSEO';

export default function MaintenanceServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: category, isLoading: categoryLoading, error: categoryError } = useMaintenanceCategoryBySlug(slug!);
  const { data: details, isLoading: detailsLoading } = useMaintenanceDetailsByCategory(category?.id || '');
  const { data: galleryImages, isLoading: galleryLoading } = useMaintenanceGalleryByCategory(category?.id || '');

  if (categoryLoading || detailsLoading || galleryLoading) {
    return <ProductLoading />;
  }

  if (categoryError || !category) {
    return <ProductNotFound />;
  }

  const serviceName = category.service_name || category.category_name || 'Maintenance Service';
  const categoryName = category.category_name || 'Building Maintenance Services';
  const description = details?.description || '';
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Building Maintenance Services', href: '/building-maintenance-services' },
    { label: serviceName }
  ];

  const seoTitle = details?.seo_title || `${serviceName} | Building Maintenance Services`;
  const seoDescription = details?.seo_description || `Professional ${serviceName} services. ${description.substring(0, 120)}...`;

  return (
    <>
      <PageSEO 
        title={seoTitle}
        description={seoDescription}
        keywords={details?.seo_keywords || `${serviceName}, building maintenance, professional services`}
        canonicalUrl={`/building-maintenance-services/${slug}`}
      />
      
      <div className="container-custom section-padding">
        <BreadcrumbNavigation items={breadcrumbItems} />
        
        <ProductHeader 
          categoryName={categoryName}
          productName={serviceName}
        />
        
        <ProductMainContent
          featuredImage={category.category_image_url || undefined}
          featuredImageAlt={category.alt_text || serviceName}
          productName={serviceName}
          description={description}
          categoryName={categoryName}
          productSlug={slug}
          galleryImages={galleryImages}
        />

        {galleryImages && galleryImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Service Gallery</h2>
            <ProductGalleryGrid 
              images={galleryImages.map(img => ({
                id: img.id,
                image_url: img.image_url,
                alt_text: img.alt_text,
                caption: img.caption,
                position: img.position
              }))}
            />
          </div>
        )}
      </div>
    </>
  );
}
