
import React from "react";
import { usePage } from "@/hooks/content";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import BlogSection from "@/components/home/BlogSection";

const HomePage = () => {
  const { data: page, isLoading } = usePage("home");
  
  // Parse JSON data from page if it exists
  const heroData = page?.hero ? 
    (typeof page.hero === 'string' ? JSON.parse(page.hero) : page.hero) : 
    null;
  
  const servicesData = page?.services ? 
    (typeof page.services === 'string' ? JSON.parse(page.services) : page.services) : 
    null;
  
  const productsData = page?.products ? 
    (typeof page.products === 'string' ? JSON.parse(page.products) : page.products) : 
    null;
  
  const blogData = page?.blog ? 
    (typeof page.blog === 'string' ? JSON.parse(page.blog) : page.blog) : 
    null;
  
  // Default products if not set in admin - Updated with new images and descriptions
  const defaultProducts = [
    {
      id: "doors-western",
      title: "Western Wooden Doors",
      image: "/lovable-uploads/45696e18-e786-427b-afb9-73fe39867839.png",
      image_alt: "premium western wooden doors in Bahrain",
      description: "Contemporary Western-style wooden doors designed for security, beauty, and long-lasting performance."
    },
    {
      id: "kitchen-cabinets",
      title: "Custom Kitchen Cabinets",
      image: "/lovable-uploads/8a5e7c00-cb95-422d-ab89-1482457d52fa.png",
      image_alt: "custom wooden kitchen cabinets in Bahrain",
      description: "Tailor-made wooden kitchen cabinets that combine sleek design and maximum storage, crafted for modern Bahraini homes."
    },
    {
      id: "wooden-wardrobes",
      title: "Wooden Wardrobes",
      image: "/lovable-uploads/fd7125fb-168c-46ac-a882-ca1c34f60941.png",
      image_alt: "built-in wooden wardrobes in Bahrain",
      description: "Elegant, space-efficient wardrobes built from premium wood for lasting style and utility in Bahraini interiors."
    },
    {
      id: "outdoor-furniture",
      title: "Outdoor Wooden Furniture",
      image: "/lovable-uploads/274a92b8-0cf0-43c7-a39c-049e10f312be.png",
      image_alt: "outdoor wooden furniture for patios in Bahrain",
      description: "Weather-resistant, stylish patio furniture crafted for outdoor comfort and durability in Bahrain's climate."
    }
  ];

  // Default blog posts if not set in admin
  const defaultBlogPosts = [
    {
      id: 1,
      title: "Top Trends in Wooden Furniture 2025",
      excerpt: "Discover the latest trends in wooden furniture design that are dominating the industry in 2025.",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000",
      image_alt: "Modern wooden furniture trend examples",
      date: "April 15, 2025",
      slug: "top-trends-wooden-furniture-2025"
    },
    {
      id: 2,
      title: "How to Maintain Custom Wooden Doors",
      excerpt: "Learn the best practices for maintaining your wooden doors to ensure they last for generations.",
      image: "https://images.unsplash.com/photo-1517857399767-a9a54424dace?q=80&w=1000",
      image_alt: "Wooden door maintenance techniques",
      date: "March 28, 2025",
      slug: "maintain-custom-wooden-doors"
    },
    {
      id: 3,
      title: "Choosing the Right Wood for Your Home",
      excerpt: "A comprehensive guide to selecting the perfect wood type for different furniture pieces in your home.",
      image: "https://images.unsplash.com/photo-1529316738131-4d0e0761a38e?q=80&w=1000",
      image_alt: "Different wood types for furniture",
      date: "March 10, 2025",
      slug: "choosing-right-wood-home"
    }
  ];

  // Default services updated with the new requirements
  const defaultServices = [
    {
      title: "Custom Furniture Design in Bahrain",
      description: "Tailored wooden furniture crafted to suit your space, style, and lifestyle. Perfect for modern and traditional homes in Bahrain.",
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=300",
      image_alt: "custom wooden furniture design Bahrain"
    },
    {
      title: "Experienced Bahraini Woodworkers",
      description: "Our master craftsmen bring decades of expertise to your furniture, delivering quality, durability, and timeless design.",
      image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=300",
      image_alt: "experienced wood craftsmen Bahrain"
    },
    {
      title: "High-Quality Wood & Finishes",
      description: "Only the finest imported and local woods are used to ensure long-lasting furniture and impeccable finishes.",
      image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=300",
      image_alt: "premium hardwood materials Bahrain"
    },
    {
      title: "Professional Installation in Bahrain",
      description: "We provide precise on-site installation of furniture and doors across Bahrain, ensuring a perfect fit and seamless experience.",
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=300",
      image_alt: "furniture installation services Bahrain"
    },
    {
      title: "Civil Maintenance Services in Bahrain",
      description: "Affordable and reliable carpentry, plumbing, and drainage solutions. Serving both residential and commercial properties in Bahrain.",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=300",
      image_alt: "carpentry plumbing drainage maintenance Bahrain"
    }
  ];

  const pageTitle = page?.seo_title || "Custom Wooden Furniture, Doors & Maintenance Services in Bahrain | Nawakhdha Woodcraft";
  const pageDescription = page?.seo_description || "Expert wooden furniture, doors, and civil maintenance services tailored for homes and businesses across Bahrain. Handcrafted quality and modern design.";
  const pageKeywords = page?.seo_keywords || "wooden furniture, doors, civil maintenance, Bahrain, custom furniture, carpentry, plumbing, drainage";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href="https://nawakhdha-woodcraft.com/" />
      </Helmet>

      <HeroSection heroData={heroData} />
      <ServicesSection servicesData={servicesData} defaultServices={defaultServices} />
      <ProductsSection productsData={productsData} defaultProducts={defaultProducts} />
      <CallToActionSection />
      <BlogSection blogData={blogData} defaultBlogPosts={defaultBlogPosts} />
    </>
  );
};

export default HomePage;
