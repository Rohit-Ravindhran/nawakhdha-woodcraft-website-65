
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SectionTitle from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// Sample product database - in a real implementation, this would come from an API or CMS
const productDatabase = {
  "doors-western": {
    title: "Western Design Doors",
    description: "Experience timeless elegance with our collection of Western design wooden doors, handcrafted for Bahraini homes and villas. Combining European-inspired aesthetics with modern durability, these doors feature ornate moldings, raised panels, and premium hardwood finishes. Whether you prefer traditional opulence or contemporary classicism, each door is built with attention to grain, texture, and finish for long-lasting beauty and structural integrity. Ideal for interiors, entrances, or office spaces across Bahrain.",
    detailedDescription: "Our Western design doors are crafted by skilled artisans with decades of experience, ensuring exceptional quality and attention to detail. Each door is made from carefully selected hardwoods that are seasoned to perfection, resulting in doors that resist warping and maintain their beauty for generations. We offer a variety of finishes from natural wood tones to custom paint colors to match any interior design scheme.",
    images: [
      { src: "/lovable-uploads/11fc47b9-4a23-4b1c-b6a9-a98e15a429f6.png", caption: "Elegant Western-style panel door in oak", alt: "western oak panel door Bahrain" },
      { src: "/lovable-uploads/d779c87c-fcda-4bab-9527-b931d0aad2b7.png", caption: "French-inspired double door with glass panels", alt: "wooden double door with glass western style Bahrain" },
      { src: "/lovable-uploads/70bd368b-f5fa-45b5-b9cb-d955cb37963c.png", caption: "Contemporary Western door with clean lines", alt: "modern western wood door design Bahrain" },
      { src: "/lovable-uploads/cac0ea26-0826-4ffc-8412-997be7a75e56.png", caption: "Ornate crown-molded panel door", alt: "decorative western wood door with crown molding" },
      { src: "/lovable-uploads/d04f778e-da90-4787-911f-65780ae81c91.png", caption: "Victorian-style door with golden handle", alt: "victorian style western door in Bahrain" },
      { src: "/lovable-uploads/5b02fa26-f201-4d4d-8bf1-386cdfb2f333.png", caption: "Carved top border and matte panel finish", alt: "western wood door with carved crown and panels" },
      { src: "/lovable-uploads/34e6092e-2511-407a-86e5-5ed7cb089702.png", caption: "Mahogany door with oval glass insert", alt: "mahogany western door with glass and floral carving" },
      { src: "/lovable-uploads/02fd8abd-cf4c-4301-8df6-95f3da176120.png", caption: "Bronze accented floral centerpiece door", alt: "luxury bronze western wood door Bahrain" },
      { src: "/lovable-uploads/a19634c7-490f-434e-937b-c2240dc54394.png", caption: "Walnut grain door with traditional arch frame", alt: "walnut wood western door for villa entrance" },
      { src: "/lovable-uploads/b0466419-0e81-4862-b176-452ec96ac998.png", caption: "Minimalist deep panel Western door", alt: "classic western deep panel door in neutral tone" },
      { src: "/lovable-uploads/f449338e-e316-4be9-bee9-40f5fb795574.png", caption: "Natural wood textured panel door", alt: "solid teak western door for indoor use in Bahrain" },
      { src: "/lovable-uploads/f9916d2e-2955-494e-a196-287432b33f8e.png", caption: "Western arched double door with central medallion", alt: "arched carved double door for luxury homes Bahrain" },
      { src: "/lovable-uploads/c3f9692e-7f7e-4be2-a8e0-412d6a46756a.png", caption: "Embossed crest with gold trimmed handle", alt: "ornate western interior door with gold detailing" },
      { src: "/lovable-uploads/92c6ca48-8ef3-4d02-be15-f49242a083b1.png", caption: "Double door in rustic polished walnut", alt: "rustic double door western design in Bahrain" },
      { src: "/lovable-uploads/0f6f9118-0736-4daf-ab85-0d729320bd45.png", caption: "Raised panel Western door with arched top", alt: "arched top raised panel wood door Bahrain" },
      { src: "/lovable-uploads/b4143ab4-a7e6-4390-aae8-13de38530291.png", caption: "Deep framed triple panel door", alt: "triple raised panel classic western wooden door" },
      { src: "/lovable-uploads/120b2e46-f13b-4b00-8218-4f05c138806b.png", caption: "Antique-styled arched front door", alt: "antique arched western entry door for villas Bahrain" },
      { src: "/lovable-uploads/487b1627-660a-4ae8-9d3e-caac3c736084.png", caption: "Curved floral ironwork on dark wood finish", alt: "iron floral western style door in bronze finish" },
      { src: "/lovable-uploads/725541b8-3dc2-4866-8b9a-9b5cf3389c39.png", caption: "Minimalist contemporary wooden door", alt: "plain contemporary western interior door" },
      { src: "/lovable-uploads/f41aec33-a17f-4f75-b503-730cb333f132.png", caption: "Display of two carved wooden panel doors", alt: "classic woodwork display of western interior doors" }
    ]
  },
  "doors-modern": {
    title: "Modern Design Doors",
    description: "Our modern door collection features sleek, minimalist designs that complement contemporary architecture. These doors emphasize clean lines, hidden hardware, and innovative materials that combine beauty with functionality.",
    detailedDescription: "Modern design doors are perfect for those seeking a sleek, contemporary look. We utilize both traditional hardwoods and engineered materials to create doors with perfect geometry and exceptional durability. Features like concealed hinges, integrated handles, and flush designs create a seamless look that integrates perfectly with modern interior design concepts.",
    images: [
      { src: "https://images.unsplash.com/photo-1612452600903-d7246211cc28?q=80&w=1000", caption: "Minimalist flush door in dark walnut" },
      { src: "https://images.unsplash.com/photo-1526057565006-20beab8dd2ed?q=80&w=1000", caption: "Geometric pattern modern door" },
      { src: "https://images.unsplash.com/photo-1535655585277-6f2b35275f50?q=80&w=1000", caption: "Sleek interior door with hidden hardware" },
      { src: "https://images.unsplash.com/photo-1514462354494-435bd80e9076?q=80&w=1000", caption: "Two-tone contemporary door design" },
      { src: "https://images.unsplash.com/photo-1581275456228-b89f94b334ff?q=80&w=1000", caption: "Modern pivot door with glass accents" }
    ]
  },
  "kitchen-cabinets": {
    title: "Kitchen Cabinets",
    description: "Our custom kitchen cabinets are designed to maximize both beauty and functionality in the heart of your home. Built with premium materials and expert craftsmanship, these cabinets offer superior storage solutions while elevating your kitchen's aesthetic.",
    detailedDescription: "From traditional to contemporary styles, our kitchen cabinets can be customized to match any design preference. We use high-quality woods like maple, cherry, and oak, combined with precision hardware for smooth operation that will last for decades. Options include soft-close features, custom inserts for organization, and specialized storage solutions for everything from spices to large appliances.",
    images: [
      { src: "https://images.unsplash.com/photo-1556910103-8b5c952482a6?q=80&w=1000", caption: "Modern white and wood kitchen cabinet design" },
      { src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000", caption: "Traditional wood cabinetry with ornate details" },
      { src: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?q=80&w=1000", caption: "Contemporary kitchen cabinet with integrated handles" },
      { src: "https://images.unsplash.com/photo-1556909172-8c2f041fca1e?q=80&w=1000", caption: "Kitchen island with custom storage solutions" },
      { src: "https://images.unsplash.com/photo-1600125693227-050ded46c15a?q=80&w=1000", caption: "Minimalist kitchen cabinetry with clean lines" }
    ]
  },
  "bedroom-furniture": {
    title: "Bedroom Furniture",
    description: "Our bedroom furniture collection combines comfort with timeless design to create peaceful sleeping environments. Each piece is crafted with attention to detail, from the joinery to the final finish.",
    detailedDescription: "We offer complete bedroom sets or individual pieces that can be customized to your space and style preferences. Our bedroom furniture features solid wood construction, dovetail joinery in drawers, and premium hardware for durability. From statement bed frames to elegant nightstands and dressers with smart storage solutions, our bedroom collections are designed to stand the test of time both in style and construction.",
    images: [
      { src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000", caption: "King-size wooden platform bed" },
      { src: "https://images.unsplash.com/photo-1505692952047-1a78307d7f52?q=80&w=1000", caption: "Custom nightstand with drawer storage" },
      { src: "https://images.unsplash.com/photo-1584053595111-534e74825d2d?q=80&w=1000", caption: "Traditional six-drawer wooden dresser" },
      { src: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1000", caption: "Minimalist scandinavian style bed frame" },
      { src: "https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=1000", caption: "Custom wardrobe with sliding doors" }
    ]
  },
  // Add placeholders for the remaining products
  "doors-middle-eastern": {
    title: "Middle Eastern Design Doors",
    description: "Our Middle Eastern design doors showcase intricate patterns and ornate details inspired by traditional Arabic and Islamic architectural elements.",
    detailedDescription: "Each Middle Eastern door we create is a masterpiece of craftsmanship featuring geometric patterns, arabesque designs, and ornate inlay work. These doors often incorporate traditional motifs and can include metal accents, ornate carving, and sometimes colorful inlays. Perfect for creating a dramatic entrance or adding cultural richness to interior spaces.",
    images: [
      { src: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1000", caption: "Traditional arabesque pattern wooden door" },
      { src: "https://images.unsplash.com/photo-1560106426-c90e52d218d4?q=80&w=1000", caption: "Ornate Middle Eastern entrance door with metal accents" },
      { src: "https://images.unsplash.com/photo-1613490277829-e957a4872c01?q=80&w=1000", caption: "Geometric pattern door with traditional motifs" },
      { src: "https://images.unsplash.com/photo-1557010328-5eefa4b5d51a?q=80&w=1000", caption: "Hand-carved door panel with Islamic-inspired design" },
      { src: "https://images.unsplash.com/photo-1520438865223-4c9be730469b?q=80&w=1000", caption: "Elegant Middle Eastern door with brass details" }
    ]
  }
  // Default templates for remaining products would be added similarly
};

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get product data or fallback to default
  const product = productId && productDatabase[productId as keyof typeof productDatabase] 
    ? productDatabase[productId as keyof typeof productDatabase]
    : {
        title: "Product Not Found",
        description: "This product information is not available.",
        detailedDescription: "",
        images: []
      };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      <div className="section-padding">
        <div className="container-custom">
          <SectionTitle
            title={product.title}
            subtitle="Handcrafted with precision and passion"
            centered
          />
          
          <div className="mb-10">
            <div className="prose max-w-none text-center">
              <p className="text-lg mb-4 max-w-4xl mx-auto">{product.description}</p>
              <p className="mb-6 max-w-4xl mx-auto">{product.detailedDescription}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Product Gallery</h2>
            {product.images.length === 0 ? (
              <p className="text-muted-foreground text-center">No images available for this product.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.images.map((image, index) => (
                  <Card key={index} className="cursor-pointer overflow-hidden" onClick={() => openLightbox(index)}>
                    <figure className="relative">
                      <div className="aspect-square overflow-hidden border-b border-border">
                        <img 
                          src={image.src} 
                          alt={image.alt || image.caption} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <figcaption className="p-3 text-sm text-center text-muted-foreground">
                        {image.caption}
                      </figcaption>
                    </figure>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <a href="/contact">Request a Quote</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && product.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 text-white hover:text-gray-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] px-4">
            <img 
              src={product.images[currentImageIndex].src} 
              alt={product.images[currentImageIndex].alt || product.images[currentImageIndex].caption} 
              className="max-w-full max-h-[75vh] object-contain mx-auto"
            />
            <p className="text-center text-white mt-4">
              {product.images[currentImageIndex].caption}
            </p>
          </div>
          
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 text-white hover:text-gray-300"
            aria-label="Next image"
          >
            <ChevronRight className="h-12 w-12" />
          </button>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
