
import React from "react";
import SectionTitle from "@/components/ui/section-title";

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
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  servicesData, 
  defaultServices = [] 
}) => {
  // Use services from props, ensuring we have valid data
  const services = servicesData?.items && servicesData.items.length > 0
    ? servicesData.items.filter(item => item.title) 
    : defaultServices;

  return (
    <section className="section-padding bg-secondary/30">
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
            >
              <figure className="mb-4">
                <img
                  src={service.image}
                  alt={service.image_alt || `${service.title} service`}
                  className="w-16 h-16 object-cover rounded-md"
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

export default ServicesSection;
