
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbNavigation from "@/components/ui/breadcrumb-navigation";
import InternalLinks from "@/components/seo/InternalLinks";

const AboutPage = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us' }
  ];

  const relatedLinks = [
    {
      title: 'Our Products',
      href: '/products',
      description: 'Explore our handcrafted furniture collection'
    },
    {
      title: 'Contact Us',
      href: '/contact',
      description: 'Get in touch for custom furniture projects'
    },
    {
      title: 'Workshop Blog',
      href: '/blog',
      description: 'Read about our latest projects and insights'
    }
  ];

  return (
    <>
      <PageSEO
        title="About Us - Bahrain's Premier Furniture Craftsmen Since 1975 | Al Nawakhdha Furniture W.L.L"
        description="Learn about Al Nawakhdha Furniture's rich heritage in Bahrain. Family-owned carpentry workshop since 1975, specializing in custom wooden furniture, doors, cabinets, and architectural elements."
        keywords="Al Nawakhdha, furniture Bahrain, carpentry workshop, custom furniture makers, handcrafted furniture, wooden doors Bahrain, furniture manufacturing, Nuwaidrat furniture"
        url="/about"
      />
      
      <div className="py-6">
        <div className="container-custom">
          <BreadcrumbNavigation items={breadcrumbItems} className="mb-6" />
        </div>
      </div>
      
      <AboutHero />
      <AboutStory />
      <AboutTeam />
      
      <div className="container-custom">
        <InternalLinks 
          title="Explore More" 
          links={relatedLinks}
          variant="grid"
          className="py-12"
        />
      </div>
      
      <AboutCTA />
    </>
  );
};

export default AboutPage;
