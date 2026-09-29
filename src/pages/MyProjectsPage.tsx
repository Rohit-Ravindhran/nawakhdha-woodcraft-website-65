import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CheckCircle, Award, Clock, Wrench, MapPin, Shield, DollarSign } from 'lucide-react';
import { useProjectsVideos, useProjectsImages } from '@/hooks/content/useProjects';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { useImageLightbox } from '@/hooks/use-image-lightbox';
import QuoteCTA from '@/components/contact/QuoteCTA';
import { useNavigate, Link } from 'react-router-dom';

const MyProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: videos = [], isLoading: videosLoading } = useProjectsVideos();
  const { data: images = [], isLoading: imagesLoading } = useProjectsImages();
  const { isOpen, currentImage, openLightbox, closeLightbox } = useImageLightbox();

  const metrics = [
    { icon: CheckCircle, label: "Completed Projects", value: "675+" },
    { icon: Award, label: "Years of Experience", value: "30+" },
    { icon: Shield, label: "Trusted After Sales Service", value: "✓" },
    { icon: Clock, label: "Ongoing Projects", value: "3+" },
    { icon: MapPin, label: "Custom Made in Bahrain", value: "✓" }
  ];

  const whyChooseUs = [
    { icon: Wrench, title: "Expert Craftsmanship", description: "30+ years of woodworking excellence" },
    { icon: Award, title: "Tailored Designs", description: "Custom solutions for every space" },
    { icon: CheckCircle, title: "End-to-End Interior Services", description: "From design to installation" },
    { icon: Clock, title: "Timely Delivery", description: "Projects completed on schedule" },
    { icon: Shield, title: "After Sales Service", description: "Comprehensive support and warranty" },
    { icon: Award, title: "Premium Materials", description: "High-quality imported materials" },
    { icon: DollarSign, title: "Transparent Pricing", description: "No hidden costs or surprises" }
  ];

  const handleRequestQuote = () => {
    navigate('/contact');
  };

  // Generate JSON-LD schema
  const generateSchema = () => {
    const itemListElements = images.map((image, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://www.anfurnwll.com/our-projects#project-${image.id}`,
      "name": image.caption || `Project ${index + 1}`,
      "image": image.image_url,
      "description": image.meta_description || image.caption || 'Custom furniture and interior project in Bahrain'
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Our Projects - Al Nawakhdha Furnitures Bahrain",
      "description": "Completed furniture and interior projects by Al Nawakhdha Furnitures in Bahrain.",
      "url": "https://www.anfurnwll.com/our-projects",
      "numberOfItems": images.length + videos.length,
      "itemListElement": itemListElements,
      "publisher": {
        "@type": "LocalBusiness",
        "name": "Al Nawakhdha Furnitures",
        "image": "https://www.anfurnwll.com/lovable-uploads/0185c8cc-c1e1-408e-b3fd-c7124284ad8e.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Building 425, Road 12, Block 712, Salmabad",
          "addressLocality": "Manama",
          "addressRegion": "Capital Governorate",
          "postalCode": "973",
          "addressCountry": "BH"
        },
        "telephone": "+973 3399 4456",
        "url": "https://www.anfurnwll.com"
      }
    };
  };

  return (
    <>
      <Helmet>
        <title>Furniture & Interior Projects in Bahrain | Al Nawakhdha Furnitures</title>
        <meta name="description" content="Explore completed furniture, fit-out, and interior design projects by Al Nawakhdha Furnitures in Bahrain. View real videos and images of our craftsmanship, quality, and custom designs." />
        <meta name="keywords" content="furniture projects Bahrain, interior fit-outs Bahrain, Al Nawakhdha Furnitures, custom furniture Bahrain, interior works Bahrain" />
        <link rel="canonical" href="https://www.anfurnwll.com/our-projects" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Furniture & Interior Projects in Bahrain | Al Nawakhdha Furnitures" />
        <meta property="og:description" content="Explore completed furniture, fit-out, and interior design projects by Al Nawakhdha Furnitures in Bahrain." />
        <meta property="og:image" content="https://www.anfurnwll.com/lovable-uploads/0185c8cc-c1e1-408e-b3fd-c7124284ad8e.png" />
        <meta property="og:url" content="https://www.anfurnwll.com/our-projects" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Furniture & Interior Projects in Bahrain | Al Nawakhdha Furnitures" />
        <meta name="twitter:description" content="Explore completed furniture, fit-out, and interior design projects by Al Nawakhdha Furnitures in Bahrain." />
        <meta name="twitter:image" content="https://www.anfurnwll.com/lovable-uploads/0185c8cc-c1e1-408e-b3fd-c7124284ad8e.png" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateSchema())}
        </script>
      </Helmet>

      {/* Hero Banner */}
      <section className="relative h-[280px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/lovable-uploads/0185c8cc-c1e1-408e-b3fd-c7124284ad8e.png)'
          }}
        >
          <div className="container-custom h-full flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mb-3">
              Our Completed Projects in Bahrain
            </h1>
            <p className="text-base md:text-lg max-w-3xl opacity-90">
              Explore our craftsmanship through completed furniture, fit-out, and interior projects across Bahrain.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section - Videos and Pictures */}
      <section className="section-padding">
        <div className="container-custom">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="videos" className="text-base">Videos</TabsTrigger>
              <TabsTrigger value="pictures" className="text-base">Pictures</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-0">
              {videosLoading ? (
                <div className="text-center py-12">Loading videos...</div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No videos available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {videos.map((video) => (
                    <div key={video.id} className="space-y-3">
                      <div className="rounded-lg overflow-hidden shadow-md bg-muted" style={{ minHeight: '300px' }}>
                        {video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be') ? (
                          <iframe
                            src={video.video_url.replace('watch?v=', 'embed/')}
                            className="w-full aspect-video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={video.alt_text || video.caption || 'Project video'}
                          />
                        ) : (
                          <video 
                            src={video.video_url} 
                            controls 
                            className="w-full h-auto object-contain max-h-[600px]"
                            aria-label={video.alt_text || video.caption || 'Project video'}
                          />
                        )}
                      </div>
                      {video.caption && (
                        <p className="text-center text-muted-foreground">{video.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pictures" className="mt-0">
              {imagesLoading ? (
                <div className="text-center py-12">Loading images...</div>
              ) : images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No images available yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      id={`project-${image.id}`}
                      className="relative rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-shadow group bg-muted"
                      style={{ minHeight: '200px' }}
                      onClick={() => openLightbox({
                        src: image.image_url,
                        alt: image.alt_text || image.caption || 'Project image',
                        caption: image.caption
                      })}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || image.caption || 'Custom furniture and interior project in Bahrain by Al Nawakhdha Furnitures'}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl text-center">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Al Nawakhdha Furnitures proudly showcases over 675+ completed projects across Bahrain, including <Link to="/products" className="text-primary hover:underline">custom furniture</Link>, <Link to="/interior-fitouts-bahrain" className="text-primary hover:underline">interior fit-outs</Link>, <Link to="/fire-rated-doors-bahrain" className="text-primary hover:underline">wooden doors</Link>, office interiors, and home renovations. Our work spans key areas such as Manama, Riffa, Muharraq, Juffair, and Isa Town, serving residential, commercial, and industrial clients. With 30+ years of expertise in woodworking and joinery, we deliver tailored designs, premium materials, and timely execution. Browse through our portfolio of real project videos and images to witness the quality and craftsmanship that sets us apart in Bahrain's furniture and interior industry.
          </p>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <div className="text-2xl md:text-3xl font-bold font-playfair text-primary mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <Icon className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold font-playfair mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <QuoteCTA onRequestQuote={handleRequestQuote} />

      {/* Lightbox */}
      {currentImage && (
        <ImageLightbox
          isOpen={isOpen}
          onClose={closeLightbox}
          src={currentImage.src}
          alt={currentImage.alt}
          caption={currentImage.caption}
        />
      )}
    </>
  );
};

export default MyProjectsPage;
