
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SectionTitle from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample product database - in a real implementation, this would come from an API or CMS
const productDatabase = {
  "doors-western": {
    title: "Western Design Doors",
    description: "Our collection of Western design doors combines classic European aesthetics with modern functionality. Each door is meticulously crafted from premium hardwoods like oak, mahogany, or walnut, and can be customized to fit any doorway dimension. The Western designs feature elegant panel work, architectural moldings, and optional glass inserts that allow light to flow between spaces while maintaining privacy.",
    detailedDescription: "Western design doors are characterized by their timeless appeal and versatility. Perfect for both traditional and contemporary homes, these doors add a touch of sophistication to any space. Our craftsmen pay special attention to the grain patterns, ensuring each door has a unique character while maintaining structural integrity throughout years of use.",
    images: [
      { src: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1000", caption: "Western style panel door in oak" },
      { src: "https://images.unsplash.com/photo-1580754504078-817030117240?q=80&w=1000", caption: "French-inspired double door with glass panels" },
      { src: "https://images.unsplash.com/photo-1685373482250-6160dd5c1557?q=80&w=1000", caption: "Contemporary western door with clean lines" },
      { src: "https://images.unsplash.com/photo-1580754504078-817030117240?q=80&w=1000", caption: "Ranch-style wooden door with iron details" },
      { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000", caption: "Craftsman inspired entrance door" },
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
          />
          
          <div className="mb-10">
            <div className="prose max-w-none">
              <p className="text-lg mb-4">{product.description}</p>
              <p className="mb-6">{product.detailedDescription}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Product Gallery</h2>
            {product.images.length === 0 ? (
              <p className="text-muted-foreground">No images available for this product.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.images.map((image, index) => (
                  <div key={index} className="cursor-pointer" onClick={() => openLightbox(index)}>
                    <div className="aspect-square overflow-hidden rounded-md border border-border">
                      <img 
                        src={image.src} 
                        alt={image.caption} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{image.caption}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild>
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
              alt={product.images[currentImageIndex].caption} 
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
