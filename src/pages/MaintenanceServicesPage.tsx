
import React from 'react';
import { useMaintenanceCategories } from '@/hooks/content/maintenance';
import { CategoryCard } from '@/components/ui/category-card';
import SectionTitle from '@/components/ui/section-title';
import { CategoryCardSkeleton } from '@/components/ui/content-skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import BreadcrumbNavigation from '@/components/ui/breadcrumb-navigation';
import PageSEO from '@/components/seo/PageSEO';

export default function MaintenanceServicesPage() {
  const { data: categories, isLoading, error } = useMaintenanceCategories();

  if (error) {
    return (
      <div className="container-custom section-padding">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading maintenance services: {(error as Error).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Building Maintenance Services' }
  ];

  return (
    <>
      <PageSEO 
        title="Building Maintenance Services | Professional Maintenance Solutions"
        description="Comprehensive building maintenance services for commercial and residential properties. Expert solutions for all your maintenance needs."
        canonicalUrl="/building-maintenance-services"
      />
      
      <div className="container-custom section-padding">
        <BreadcrumbNavigation items={breadcrumbItems} />
        
        <SectionTitle
          title="Building Maintenance Services"
          subtitle="Professional maintenance solutions for all your property needs"
          centered
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[...Array(6)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.service_name || category.category_name || 'Maintenance Service'}
                image={category.category_image_url || ''}
                imageAlt={category.alt_text || category.category_name || 'Service image'}
                href={`/building-maintenance-services/${category.category_slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No maintenance services available at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}
