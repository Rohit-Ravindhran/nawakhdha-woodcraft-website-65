
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-title";
import CategoryCard from "@/components/ui/category-card";
import BlogCard from "@/components/ui/blog-card";

const HomePage = () => {
  // Sample data for categories
  const products = [
    {
      id: "doors-western",
      title: "Western Doors",
      image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1000"
    },
    {
      id: "kitchen-cabinets",
      title: "Kitchen Cabinets",
      image: "https://images.unsplash.com/photo-1556910103-8b5c952482a6?q=80&w=1000"
    },
    {
      id: "bedroom-furniture",
      title: "Bedroom Furniture",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000"
    },
    {
      id: "dining-tables",
      title: "Dining Tables",
      image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000"
    }
  ];

  // Sample data for blog posts
  const blogPosts = [
    {
      id: 1,
      title: "Top Trends in Wooden Furniture 2025",
      excerpt: "Discover the latest trends in wooden furniture design that are dominating the industry in 2025.",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000",
      date: "April 15, 2025",
      slug: "top-trends-wooden-furniture-2025"
    },
    {
      id: 2,
      title: "How to Maintain Custom Wooden Doors",
      excerpt: "Learn the best practices for maintaining your wooden doors to ensure they last for generations.",
      image: "https://images.unsplash.com/photo-1517857399767-a9a54424dace?q=80&w=1000",
      date: "March 28, 2025",
      slug: "maintain-custom-wooden-doors"
    },
    {
      id: 3,
      title: "Choosing the Right Wood for Your Home",
      excerpt: "A comprehensive guide to selecting the perfect wood type for different furniture pieces in your home.",
      image: "https://images.unsplash.com/photo-1529316738131-4d0e0761a38e?q=80&w=1000",
      date: "March 10, 2025",
      slug: "choosing-right-wood-home"
    }
  ];

  // Services data
  const services = [
    {
      title: "Custom Design",
      description: "Personalized furniture design services tailored to your specific needs and preferences.",
      icon: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=300"
    },
    {
      title: "Professional Craftsmanship",
      description: "Expert craftsmen with decades of experience creating beautiful wooden masterpieces.",
      icon: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=300"
    },
    {
      title: "Premium Materials",
      description: "Only the finest quality woods and materials are used in our furniture and products.",
      icon: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=300"
    },
    {
      title: "Installation Services",
      description: "Professional installation by our experienced team ensures perfect fit and finish.",
      icon: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=300"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div
          className="h-[85vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format')"
          }}
        ></div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container-custom">
            <div className="max-w-2xl animate-fade-in">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Crafting Excellence Since 1975
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Bahrain's premier carpentry and furniture manufacturing workshop,
                bringing your vision to life with exceptional craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/about">Discover Our Story</Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                  <Link to="/contact">Request a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="Our Services"
            subtitle="We offer a comprehensive range of woodworking and furniture services."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-border transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-md overflow-hidden mb-4">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold font-playfair mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="Our Products"
            subtitle="Explore our diverse range of expertly crafted furniture products."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <CategoryCard
                key={product.id}
                title={product.title}
                image={product.image}
                href={`/product/${product.id}`}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1000&auto=format')"
          }}
        ></div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-4">
              Bring Your Vision to Life
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Ready to start your custom furniture project? Our expert team is
              ready to help transform your ideas into beautiful reality.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Link to="/contact">Request a Custom Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="From Our Workshop Blog"
            subtitle="Insights, tips, and updates from our furniture workshop."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                date={post.date}
                href={`/blog/${post.slug}`}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/blog">
                Read More Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
