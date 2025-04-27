
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-title";
import CategoryCard from "@/components/ui/category-card";

const ProductsPage = () => {
  // Product categories data
  const products = [
    { id: "doors-western", title: "Doors - Western Designs", image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1000" },
    { id: "doors-modern", title: "Doors - Modern Designs", image: "https://images.unsplash.com/photo-1612452600903-d7246211cc28?q=80&w=1000" },
    { id: "doors-middle-eastern", title: "Doors - Middle Eastern Designs", image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1000" },
    { id: "tv-cabinets", title: "TV Cabinets", image: "https://images.unsplash.com/photo-1588784142799-afa546b9dbad?q=80&w=1000" },
    { id: "teapoy", title: "Teapoy", image: "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?q=80&w=1000" },
    { id: "kitchen-cabinets", title: "Kitchen Cabinets", image: "https://images.unsplash.com/photo-1556910103-8b5c952482a6?q=80&w=1000" },
    { id: "wardrobes", title: "Wardrobes", image: "https://images.unsplash.com/photo-1551298698-66b830a4f11c?q=80&w=1000" },
    { id: "dining-tables", title: "Dining Table and Chairs", image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000" },
    { id: "wall-partitions", title: "Wall Partitions", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000" },
    { id: "study-tables", title: "Study Tables", image: "https://images.unsplash.com/photo-1554062090-6fe5efc9d7ea?q=80&w=1000" },
    { id: "wall-cladding", title: "Wall Cladding", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000" },
    { id: "office-furniture", title: "Reception and Office Furniture", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000" },
    { id: "bedroom-furniture", title: "Bedroom Furniture", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000" },
    { id: "dressing-tables", title: "Wooden Dressing Tables", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1000" },
    { id: "outdoor-swings", title: "Outdoor Swings", image: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?q=80&w=1000" },
    { id: "patio-furniture", title: "Patio Furniture", image: "https://images.unsplash.com/photo-1595515106865-dd0e8e7a8ea1?q=80&w=1000" },
    { id: "walk-in-closets", title: "Walk-in Closets", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1000" },
    { id: "parquet-flooring", title: "Wooden Parquet Flooring", image: "https://images.unsplash.com/photo-1622890376727-e9ecc9263015?q=80&w=1000" },
    { id: "book-shelves", title: "Book Shelves", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=1000" },
    { id: "showcases", title: "Showcases", image: "https://images.unsplash.com/photo-1595514535415-dae8970520fc?q=80&w=1000" },
  ];

  return (
    <div className="section-padding">
      <div className="container-custom">
        <SectionTitle
          title="Our Products"
          subtitle="Explore our comprehensive collection of handcrafted wooden furniture and architectural elements, all created with exceptional craftsmanship."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <CategoryCard
              key={product.id}
              title={product.title}
              image={product.image}
              href={`/product/${product.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
