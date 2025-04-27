
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionTitle from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CategoryData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
}

const CATEGORIES_DATA: Record<string, CategoryData> = {
  "doors-western": {
    id: "doors-western",
    title: "Western Design Doors",
    description: "Elegant wooden doors crafted with Western design principles.",
    longDescription: "Our Western Design Doors collection offers a perfect blend of European elegance and practical functionality. Each door is carefully crafted from premium wood varieties, featuring intricate details that bring sophistication to any home or office. The collection includes classic panel designs, craftsman styles, and modern interpretations of traditional Western door aesthetics.\n\nThese doors are not just entryways; they're statement pieces that enhance the architectural character of your space. Available in various finishes from rich mahogany to light oak, our Western doors can be customized to match your interior design vision.",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000",
      "https://images.unsplash.com/photo-1520003978535-4eaefc18e201?q=80&w=1000",
      "https://images.unsplash.com/photo-1614111345869-991e5dfc1908?q=80&w=1000"
    ]
  },
  "doors-modern": {
    id: "doors-modern",
    title: "Modern Design Doors",
    description: "Contemporary door designs that blend functionality with modern aesthetics.",
    longDescription: "Our Modern Design Doors collection represents the pinnacle of contemporary door craftsmanship. These sleek, minimalist designs prioritize clean lines, innovative materials, and functional beauty. Perfect for modern homes and commercial spaces, these doors make a bold architectural statement while providing exceptional security and sound insulation.\n\nFeaturing flush surfaces, hidden hinges, and creative use of inlays and mixed materials, our modern doors can transform any entrance into a design focal point. Many designs incorporate glass elements, metal accents, or unique grain patterns to create visual interest without sacrificing the clean, uncluttered aesthetic that defines modern design.",
    image: "https://images.unsplash.com/photo-1549183535-44ce8a38ba93?q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1613425853004-eff30e5b9db1?q=80&w=1000",
      "https://images.unsplash.com/photo-1588799352999-3c3453c8e429?q=80&w=1000",
      "https://images.unsplash.com/photo-1506616344826-d81aee67ebfa?q=80&w=1000"
    ]
  },
  "doors-middle-eastern": {
    id: "doors-middle-eastern",
    title: "Middle Eastern Design Doors",
    description: "Ornate wooden doors featuring traditional Middle Eastern patterns and craftsmanship.",
    longDescription: "Our Middle Eastern Design Doors collection celebrates the rich cultural heritage and ornate aesthetic traditions of the region. These doors feature intricate geometric patterns, arabesque designs, and calligraphic elements that have been perfected over centuries of woodworking tradition.\n\nEach door is a masterpiece of craftsmanship, with hand-carved details and inlaid patterns that showcase the skill of our artisans. From grand entrance doors with traditional mashrabiya screens to interior doors with subtle Arabian influences, this collection brings the warmth and hospitality of Middle Eastern design to any space.",
    image: "https://images.unsplash.com/photo-1581788604067-769a11325b0f?q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1586500036706-41963de24d8d?q=80&w=1000",
      "https://images.unsplash.com/photo-1549490349-ea034fc3062b?q=80&w=1000",
      "https://images.unsplash.com/photo-1595797724242-bfea1ef656f9?q=80&w=1000"
    ]
  },
  "kitchen-cabinets": {
    id: "kitchen-cabinets",
    title: "Kitchen Cabinets",
    description: "Custom-designed kitchen storage solutions combining beauty and functionality.",
    longDescription: "Our Kitchen Cabinets collection transforms the heart of your home with storage solutions that are as beautiful as they are functional. Each cabinet is meticulously crafted to maximize space efficiency while elevating the aesthetic appeal of your kitchen.\n\nFrom classic shaker designs to sleek modern styles, our cabinets can be customized with various wood types, finishes, and hardware options. Features like soft-close hinges, pull-out systems, and specialized storage compartments ensure that your kitchen works as wonderfully as it looks. Whether you're planning a complete kitchen renovation or simply updating your cabinetry, our expert craftsmen will create solutions that perfectly fit your space and lifestyle.",
    image: "https://images.unsplash.com/photo-1556910103-8b5c952482a6?q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=1000",
      "https://images.unsplash.com/photo-1631048500395-b6720e256f16?q=80&w=1000",
      "https://images.unsplash.com/photo-1601325561750-58ffd29125db?q=80&w=1000"
    ]
  },
  "dining-tables": {
    id: "dining-tables",
    title: "Dining Tables & Chairs",
    description: "Elegant dining furniture sets that become the centerpiece of your dining area.",
    longDescription: "Our Dining Tables & Chairs collection offers exquisite furniture sets that become the centerpiece of your dining area. From intimate breakfast nooks to grand formal dining rooms, we create tables and chairs that bring people together in style and comfort.\n\nOur dining tables are available in various shapes, sizes, and designs - from rustic farmhouse styles to sleek contemporary pieces. Each table is built using traditional joinery techniques that ensure stability and longevity. Our matching chairs are ergonomically designed for comfort during long dinner conversations, with options ranging from upholstered seats to classic wooden designs. Custom options include extending tables, specialized woods, unique edge profiles, and custom finishes to match your existing decor.",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1615800002234-05c4d488696c?q=80&w=1000",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1000",
      "https://images.unsplash.com/photo-1525104325683-6534dafbeb8d?q=80&w=1000"
    ]
  },
  "wardrobes": {
    id: "wardrobes",
    title: "Wardrobes",
    description: "Custom storage solutions for bedrooms that combine elegance with functionality.",
    longDescription: "Our Wardrobes collection offers elegant and practical storage solutions for your bedroom. From traditional freestanding armoires to contemporary built-in closet systems, our wardrobes are designed to maximize your space while complementing your bedroom's aesthetic.\n\nEach wardrobe is thoughtfully configured with a combination of hanging space, shelving, and drawers to accommodate your specific storage needs. We offer a range of door styles, from hinged to sliding, and can incorporate features like mirror panels, LED lighting, and specialized storage accessories. Built with premium materials and expert craftsmanship, our wardrobes provide a lifetime of organized elegance.",
    image: "https://images.unsplash.com/photo-1595229058266-d427d3bf32e6?q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1595229053618-53b9f326a273?q=80&w=1000",
      "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=1000",
      "https://images.unsplash.com/photo-1616628198434-0e8825da6677?q=80&w=1000"
    ]
  }
};

const DEFAULT_CATEGORY: CategoryData = {
  id: "default",
  title: "Furniture Category",
  description: "Explore our beautiful collection of handcrafted furniture.",
  longDescription: "This category features some of our finest handcrafted furniture pieces. Each item is carefully designed and created by our master craftsmen using traditional techniques and premium materials.",
  image: "https://images.unsplash.com/photo-1618220179428-22790b485390?q=80&w=1000",
  gallery: [
    "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1000",
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000"
  ]
};

const FurnitureCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<CategoryData>(DEFAULT_CATEGORY);

  useEffect(() => {
    if (categoryId && CATEGORIES_DATA[categoryId]) {
      setCategory(CATEGORIES_DATA[categoryId]);
    } else {
      setCategory(DEFAULT_CATEGORY);
    }
  }, [categoryId]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div
          className="h-[50vh] bg-cover bg-center"
          style={{
            backgroundImage: `url('${category.image}')`
          }}
        ></div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container-custom">
            <div className="max-w-2xl">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
                {category.title}
              </h1>
              <p className="text-lg text-white/90">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Description */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle
                title="About This Collection"
                subtitle="Discover the craftsmanship and design that makes this collection special."
              />
              <div className="prose max-w-none">
                {category.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button asChild className="mt-6">
                <Link to="/contact">Request a Custom Quote</Link>
              </Button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {category.gallery.slice(0, 2).map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`${category.title} example ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
              {category.gallery[2] && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={category.gallery[2]}
                    alt={`${category.title} example 3`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="Collection Features"
            subtitle="What makes our products stand out from the rest."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-playfair font-bold text-lg mb-2">Premium Materials</h3>
              <p className="text-sm text-muted-foreground">Only the finest quality woods and materials are used in our manufacturing process.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3 className="font-playfair font-bold text-lg mb-2">Expert Craftsmanship</h3>
              <p className="text-sm text-muted-foreground">Each piece is meticulously crafted by our skilled artisans with years of experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" />
                  <line x1="16" y1="8" x2="2" y2="22" />
                  <line x1="17.5" y1="15" x2="9" y2="15" />
                </svg>
              </div>
              <h3 className="font-playfair font-bold text-lg mb-2">Customization</h3>
              <p className="text-sm text-muted-foreground">Customize dimensions, finishes, and details to perfectly match your space and style.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                  <path d="M16.5 9.4 7.55 4.24" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <circle cx="18.5" cy="15.5" r="2.5" />
                  <path d="M20.27 17.27 22 19" />
                </svg>
              </div>
              <h3 className="font-playfair font-bold text-lg mb-2">Durability</h3>
              <p className="text-sm text-muted-foreground">Built to last for generations with traditional joinery and finishing techniques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            title="Explore More Collections"
            subtitle="Discover other furniture categories that might interest you."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(CATEGORIES_DATA)
              .filter(cat => cat.id !== category.id)
              .slice(0, 3)
              .map(cat => (
                <Link to={`/category/${cat.id}`} key={cat.id} className="group block">
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-playfair font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-wood-dark text-white">
        <div className="container-custom text-center">
          <h2 className="heading-md mb-4">Ready to Start Your Project?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Contact us today to discuss your custom {category.title.toLowerCase()} needs or request a detailed quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" className="bg-white text-wood-dark hover:bg-white/90">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/category">Browse Other Categories</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FurnitureCategoryPage;
