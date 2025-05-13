
import React from "react";
import SectionTitle from "@/components/ui/section-title";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface Service {
  title: string;
  description: string;
  image: string;
  image_alt?: string;
}

interface ServicesSectionProps {
  servicesData: {
    section_title?: string;
    items?: Service[];
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
    ? servicesData.items.filter(item => item && item.title) 
    : defaultServices;

  return (
    <section className="section-padding bg-secondary/30" data-testid="services-section">
      <div className="container-custom">
        <SectionTitle
          title={servicesData?.section_title || "Our Services"}
          subtitle="We offer a comprehensive range of woodworking and furniture services."
          centered={true}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-border transition-transform hover:-translate-y-1"
              data-testid={`service-card-${index}`}
            >
              <figure className="mb-4">
                <img
                  src={service.image || "https://placehold.co/400x400"}
                  alt={service.image_alt || `${service.title} service`}
                  className="w-16 h-16 object-cover rounded-md"
                  loading="lazy"
                />
              </figure>
              <h3 className="text-lg font-bold font-playfair mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ServicesSection);
