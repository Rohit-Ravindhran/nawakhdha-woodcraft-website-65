
import React from "react";
import { usePage } from "@/hooks/content";
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
  
  // Default data if not set in admin
  const defaultProducts = [
    {
      id: "doors-western",
      title: "Western Doors",
      image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1000",
      image_alt: "Western style wooden door design"
    },
    {
      id: "kitchen-cabinets",
      title: "Kitchen Cabinets",
      image: "https://images.unsplash.com/photo-1556910103-8b5c952482a6?q=80&w=1000",
      image_alt: "Modern kitchen cabinet designs"
    },
    {
      id: "bedroom-furniture",
      title: "Bedroom Furniture",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000",
      image_alt: "Elegant wooden bedroom furniture set"
    },
    {
      id: "dining-tables",
      title: "Dining Tables",
      image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000",
      image_alt: "Handcrafted dining table"
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

  // Default services if not set in admin
  const defaultServices = [
    {
      title: "Custom Design",
      description: "Personalized furniture design services tailored to your specific needs and preferences.",
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=300",
      image_alt: "Custom furniture design sketches"
    },
    {
      title: "Professional Craftsmanship",
      description: "Expert craftsmen with decades of experience creating beautiful wooden masterpieces.",
      image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=300",
      image_alt: "Skilled craftsman working on wooden furniture"
    },
    {
      title: "Premium Materials",
      description: "Only the finest quality woods and materials are used in our furniture and products.",
      image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=300",
      image_alt: "High quality wood materials"
    },
    {
      title: "Installation Services",
      description: "Professional installation by our experienced team ensures perfect fit and finish.",
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=300",
      image_alt: "Furniture installation process"
    }
  ];

  return (
    <>
      <HeroSection heroData={heroData} />
      <ServicesSection servicesData={servicesData} defaultServices={defaultServices} />
      <ProductsSection productsData={productsData} defaultProducts={defaultProducts} />
      <CallToActionSection />
      <BlogSection blogData={blogData} defaultBlogPosts={defaultBlogPosts} />
    </>
  );
};

export default HomePage;
