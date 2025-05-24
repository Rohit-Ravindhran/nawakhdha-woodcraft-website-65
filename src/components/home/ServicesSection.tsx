
import React from "react";
import SectionTitle from "@/components/ui/section-title";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { HomeServiceData } from "@/hooks/content/types";

interface Service {
  title: string;
  description: string;
  image: string;
  image_alt?: string;
}

interface ServicesSectionProps {
  servicesData: {
    section_title?: string;
    items?: (HomeServiceData | Service)[];
  } | null;
  defaultServices?: Service[];
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Component for displaying the services section on the homepage
 */
const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  servicesData, 
  defaultServices = [],
  isLoading = false,
  error = null
}) => {
  // Display loading skeletons when loading
  if (isLoading) {
    return (
      <section className="section-padding bg-secondary/30" data-testid="services-loading">
        <div className="container-custom">
          <SectionTitle
            title="Our Services"
            subtitle="Loading our services..."
            centered={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={`skeleton-${index}`} className="bg-white p-6 rounded-lg shadow-sm">
                <Skeleton className="w-16 h-16 rounded-md mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Display error state
  if (error && (!servicesData || !servicesData.items || servicesData.items.length === 0)) {
    return (
      <section className="section-padding bg-secondary/30" data-testid="services-error">
        <div className="container-custom">
          <SectionTitle
            title="Our Services"
            subtitle="We're having trouble loading our services. Please check back soon."
            centered={true}
          />
          <div className="flex flex-col justify-center items-center py-10 text-red-500">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p className="text-center">Unable to load services data</p>
            {process.env.NODE_ENV !== 'production' && (
              <p className="text-sm text-muted-foreground mt-2">{String(error)}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Use services from props, ensuring we have valid data
  const services = servicesData?.items && Array.isArray(servicesData.items) && servicesData.items.length > 0
    ? servicesData.items.filter(item => item && (item.title || (item as HomeServiceData).title)) 
    : defaultServices;

  // Define the desired order mapping
  const getServiceOrder = (title: string): number => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('custom wooden doors') || lowerTitle.includes('doors & cabinets')) {
      return 1;
    } else if (lowerTitle.includes('civil maintenance') || lowerTitle.includes('carpentry services')) {
      return 2;
    } else if (lowerTitle.includes('bespoke interior') || lowerTitle.includes('interior design')) {
      return 3;
    } else if (lowerTitle.includes('gypsum') || lowerTitle.includes('partition works')) {
      return 4;
    } else if (lowerTitle.includes('aluminium works') || lowerTitle.includes('air conditioning')) {
      return 5;
    }
    return 6; // Default order for any other services
  };

  // Sort services according to the specified order
  const sortedServices = [...services].sort((a, b) => {
    const titleA = (a as Service).title || (a as HomeServiceData).title || '';
    const titleB = (b as Service).title || (b as HomeServiceData).title || '';
    return getServiceOrder(titleA) - getServiceOrder(titleB);
  });

  return (
    <section className="section-padding bg-secondary/30" data-testid="services-section">
      <div className="container-custom">
        <SectionTitle
          title={servicesData?.section_title || "Our Services"}
          subtitle="We offer a comprehensive range of woodworking and furniture services."
          centered={true}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {sortedServices.map((service, index) => {
            // Handle both HomeServiceData and Service types
            const title = (service as Service).title || (service as HomeServiceData).title || '';
            const description = (service as Service).description || (service as HomeServiceData).description || '';
            // Use either image or image_url property
            const imageUrl = (service as Service).image || (service as HomeServiceData).image_url || "https://placehold.co/400x400";
            const imageAlt = (service as Service).image_alt || (service as HomeServiceData).alt_text || `${title} service`;
            
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-border transition-transform hover:-translate-y-1"
                data-testid={`service-card-${index}`}
              >
                <figure className="mb-4">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-16 h-16 object-cover rounded-md"
                    loading="lazy"
                  />
                </figure>
                <h3 className="text-lg font-bold font-playfair mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ServicesSection);
