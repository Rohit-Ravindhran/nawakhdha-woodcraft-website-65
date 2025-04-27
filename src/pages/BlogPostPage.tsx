
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: "Top Trends in Wooden Furniture 2025",
    excerpt: "Discover the latest trends in wooden furniture design that are dominating the industry in 2025.",
    content: `
      <h2>The Evolution of Wooden Furniture in 2025</h2>
      <p>As we move further into 2025, wooden furniture continues to evolve with exciting new trends that combine traditional craftsmanship with modern innovations. The appreciation for natural materials has only grown stronger, with consumers increasingly valuing sustainable, long-lasting pieces over disposable furniture.</p>
      
      <h3>1. Biophilic Design Integration</h3>
      <p>Biophilic design—incorporating natural elements into interior spaces—has become a dominant trend. Wooden furniture with organic, flowing shapes that mimic natural forms has gained popularity. These pieces often feature live edges, natural grain patterns, and minimal processing to maintain their connection to nature.</p>
      
      <h3>2. Sustainable Sourcing</h3>
      <p>Sustainability isn't just a buzzword anymore; it's become the standard. Consumers are demanding furniture made from responsibly sourced wood with proper certification. Reclaimed and upcycled wood has moved from niche to mainstream, with premium furniture makers highlighting the history and origin of their materials.</p>
      
      <h3>3. Dark Woods Return</h3>
      <p>After years of light woods dominating the market, we're seeing a significant return to darker woods like walnut, mahogany, and ebonized oak. These richer tones add warmth and sophistication to interiors, especially when paired with light, neutral wall colors.</p>
      
      <h3>4. Multifunctional Pieces</h3>
      <p>As living spaces continue to shrink in urban areas, multifunctional wooden furniture has become essential. Coffee tables that convert to dining tables, storage beds, and expandable consoles are no longer just practical—they're being designed as statement pieces that don't sacrifice aesthetics for functionality.</p>
      
      <h3>5. Artisanal Craftsmanship</h3>
      <p>In reaction to mass production, there's been a renewed appreciation for visibly handcrafted wooden furniture. Details like dovetail joints, hand carving, and traditional joinery techniques are being highlighted rather than hidden, celebrating the skill that goes into creating each piece.</p>
      
      <h2>Conclusion</h2>
      <p>The wooden furniture trends of 2025 reflect a deeper connection to craftsmanship, sustainability, and thoughtful design. At Al Nawakhdha Furniture, we're proud to incorporate these trends while maintaining our dedication to quality and timeless design principles that have guided us since 1975.</p>
    `,
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000",
    date: "April 15, 2025",
    author: "Ahmed Al Hamar",
    slug: "top-trends-wooden-furniture-2025"
  },
  {
    id: 2,
    title: "How to Maintain Custom Wooden Doors",
    excerpt: "Learn the best practices for maintaining your wooden doors to ensure they last for generations.",
    content: `
      <h2>Maintaining the Beauty of Your Wooden Doors</h2>
      <p>Custom wooden doors are not just entryways; they're significant investments in your home's character and security. With proper maintenance, these beautiful wooden features can last for generations while maintaining their aesthetic appeal. Here's our comprehensive guide to caring for your wooden doors.</p>
      
      <h3>Regular Cleaning Routine</h3>
      <p>Dust and dirt can gradually wear down your door's finish and damage the wood underneath. Establish a regular cleaning routine:</p>
      <ul>
        <li>Use a soft, lint-free cloth to remove dust weekly</li>
        <li>For deeper cleaning, use a mild soap solution (1 tablespoon of mild dish soap in 1 gallon of warm water)</li>
        <li>Always wipe in the direction of the wood grain</li>
        <li>Thoroughly dry the door after cleaning to prevent water damage</li>
      </ul>
      
      <h3>Protecting the Finish</h3>
      <p>The finish on your wooden door is its primary defense against moisture, UV damage, and daily wear:</p>
      <ul>
        <li>Apply furniture polish or beeswax every 3-6 months</li>
        <li>Avoid silicone-based products as they can build up and damage the finish over time</li>
        <li>For exterior doors, consider applying a UV-protective clear coat annually</li>
      </ul>
      
      <h3>Addressing Moisture Issues</h3>
      <p>Moisture is wooden doors' greatest enemy, causing warping, swelling, and rotting:</p>
      <ul>
        <li>Check weatherstripping regularly and replace when worn</li>
        <li>For exterior doors, ensure your porch or entryway has adequate coverage from rain</li>
        <li>Maintain consistent indoor humidity levels (ideally 40-50%)</li>
        <li>Address water spots immediately by gently drying and then applying appropriate polish</li>
      </ul>
      
      <h3>Seasonal Maintenance</h3>
      <p>Different seasons bring different challenges for wooden doors:</p>
      <ul>
        <li><strong>Summer:</strong> Protect from direct sunlight and high humidity</li>
        <li><strong>Winter:</strong> Watch for excessive dryness that can cause cracking</li>
        <li><strong>Spring & Fall:</strong> Perfect times for thorough inspection and refinishing if needed</li>
      </ul>
      
      <h3>When to Call Professionals</h3>
      <p>Some maintenance aspects are best left to professionals:</p>
      <ul>
        <li>Complete refinishing of heavily damaged doors</li>
        <li>Structural repairs for warped or sagging doors</li>
        <li>Hardware replacement that requires door modification</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>With regular care and attention, your custom wooden doors will continue to be a beautiful and functional part of your home for decades to come. At Al Nawakhdha Furniture, we're always available to provide advice on maintaining the wooden elements we've crafted for your home.</p>
    `,
    image: "https://images.unsplash.com/photo-1517857399767-a9a54424dace?q=80&w=1000",
    date: "March 28, 2025",
    author: "Khalid Abdullah",
    slug: "maintain-custom-wooden-doors"
  },
  {
    id: 3,
    title: "Choosing the Right Wood for Your Home",
    excerpt: "A comprehensive guide to selecting the perfect wood type for different furniture pieces in your home.",
    content: `
      <h2>The Art of Selecting the Perfect Wood</h2>
      <p>Choosing the right wood for your furniture and home elements is a decision that impacts aesthetics, durability, sustainability, and budget. Different woods offer distinct characteristics that make them suitable for specific applications. This guide will help you navigate these choices with confidence.</p>
      
      <h3>Hardwoods vs. Softwoods</h3>
      <p>Understanding the basic distinction between hardwoods and softwoods is the first step:</p>
      
      <h4>Hardwoods:</h4>
      <ul>
        <li>Generally more dense and durable</li>
        <li>Come from deciduous trees (those that lose their leaves annually)</li>
        <li>Often have more distinctive grain patterns</li>
        <li>Examples: oak, maple, walnut, mahogany, teak</li>
        <li>Best for: furniture that receives heavy use, flooring, structural elements</li>
      </ul>
      
      <h4>Softwoods:</h4>
      <ul>
        <li>Typically less dense and more workable</li>
        <li>Come from coniferous trees (evergreens)</li>
        <li>Often less expensive than hardwoods</li>
        <li>Examples: pine, cedar, fir, spruce</li>
        <li>Best for: decorative elements, shelving, craft projects, less-trafficked areas</li>
      </ul>
      
      <h3>Popular Woods and Their Best Uses</h3>
      
      <h4>Oak</h4>
      <p>Strong, durable, and with distinctive grain patterns, oak is versatile and timeless. Red oak offers warm reddish tones, while white oak features grayish-brown hues.</p>
      <p><strong>Best for:</strong> Dining tables, chairs, cabinets, flooring</p>
      
      <h4>Maple</h4>
      <p>Known for its fine, uniform texture and light color, maple is extremely hard and resistant to wear.</p>
      <p><strong>Best for:</strong> Kitchen tables, butcher blocks, high-traffic furniture</p>
      
      <h4>Walnut</h4>
      <p>With its rich chocolate-brown color and straight grain, walnut offers natural beauty and excellent workability.</p>
      <p><strong>Best for:</strong> Statement furniture pieces, accent tables, luxury cabinetry</p>
      
      <h4>Mahogany</h4>
      <p>Prized for its reddish-brown color that deepens with age, mahogany is stable and resistant to warping.</p>
      <p><strong>Best for:</strong> High-end furniture, decorative doors, ornate carvings</p>
      
      <h4>Teak</h4>
      <p>Naturally water-resistant with high oil content, teak is the premier choice for durability in harsh conditions.</p>
      <p><strong>Best for:</strong> Outdoor furniture, bathroom fixtures, boat building</p>
      
      <h4>Cherry</h4>
      <p>Starting as light pink and aging to a rich reddish-brown, cherry develops character over time.</p>
      <p><strong>Best for:</strong> Fine furniture, cabinets, decorative elements</p>
      
      <h4>Pine</h4>
      <p>Lightweight and inexpensive with a yellow-cream color and notable knots.</p>
      <p><strong>Best for:</strong> Rustic furniture, painted pieces, budget-friendly projects</p>
      
      <h3>Considerations Beyond Wood Type</h3>
      
      <h4>Sustainability</h4>
      <p>Look for FSC certification or reclaimed wood options to ensure environmental responsibility.</p>
      
      <h4>Local Availability</h4>
      <p>Woods native to your region often make more sustainable and cost-effective choices.</p>
      
      <h4>Indoor vs. Outdoor Use</h4>
      <p>For outdoor applications, choose naturally rot-resistant woods like teak, cedar, or treated lumber.</p>
      
      <h4>Grain Pattern and Color</h4>
      <p>Consider how the wood's natural appearance will complement your existing décor and color scheme.</p>
      
      <h2>Conclusion</h2>
      <p>At Al Nawakhdha Furniture, we help clients select the perfect wood for their specific needs, considering both practical requirements and aesthetic preferences. The right wood choice creates furniture that not only looks beautiful today but becomes an heirloom for generations to come.</p>
    `,
    image: "https://images.unsplash.com/photo-1529316738131-4d0e0761a38e?q=80&w=1000",
    date: "March 10, 2025",
    author: "Fatima Al Mansoor",
    slug: "choosing-right-wood-home"
  },
  {
    id: 4,
    title: "Modern vs. Classic Door Designs",
    excerpt: "Compare the characteristics, benefits, and aesthetics of modern and classic door designs to help you choose the perfect style for your home.",
    content: `
      <h2>Choosing Between Modern and Classic Door Designs</h2>
      <p>Doors are more than functional elements—they're architectural statements that set the tone for your entire home. The choice between modern and classic door designs impacts not just aesthetics but also functionality and how your space feels. This guide explores both styles to help you make an informed decision.</p>
      
      <h3>Classic Door Designs: Timeless Elegance</h3>
      
      <h4>Characteristics of Classic Doors</h4>
      <ul>
        <li>Intricate detailing and ornate carvings</li>
        <li>Raised panels with decorative molding</li>
        <li>Traditional symmetrical designs</li>
        <li>Often feature glass inserts with decorative patterns</li>
        <li>Commonly crafted from solid hardwoods like oak, mahogany, or walnut</li>
      </ul>
      
      <h4>Advantages of Classic Doors</h4>
      <ul>
        <li>Timeless appeal that transcends trends</li>
        <li>Add character and historical context to homes</li>
        <li>Often feature superior craftsmanship with hand-carved details</li>
        <li>Typically made from substantial materials that provide excellent sound insulation</li>
        <li>Pair beautifully with traditional architectural styles</li>
      </ul>
      
      <h4>Best Settings for Classic Doors</h4>
      <ul>
        <li>Heritage homes and period properties</li>
        <li>Traditional interiors with formal furniture</li>
        <li>Spaces where you want to create a sense of grandeur</li>
        <li>Settings that benefit from warmth and character</li>
      </ul>
      
      <h3>Modern Door Designs: Contemporary Simplicity</h3>
      
      <h4>Characteristics of Modern Doors</h4>
      <ul>
        <li>Clean lines and minimal ornamentation</li>
        <li>Flat panels with subtle or flush details</li>
        <li>Innovative materials including engineered woods and metal accents</li>
        <li>Larger glass panels, often without mullions</li>
        <li>Asymmetrical designs and creative hardware</li>
      </ul>
      
      <h4>Advantages of Modern Doors</h4>
      <ul>
        <li>Create a sense of spaciousness and light</li>
        <li>Often incorporate technological innovations</li>
        <li>May offer better energy efficiency with newer materials</li>
        <li>Versatile designs that complement contemporary interiors</li>
        <li>Often easier to maintain with simpler surfaces</li>
      </ul>
      
      <h4>Best Settings for Modern Doors</h4>
      <ul>
        <li>Contemporary and newly built homes</li>
        <li>Minimalist and open-plan interiors</li>
        <li>Urban settings and apartments</li>
        <li>Spaces where you want to maximize light flow</li>
      </ul>
      
      <h3>Finding the Middle Ground: Transitional Door Designs</h3>
      <p>For those who appreciate elements of both styles, transitional doors offer a perfect compromise:</p>
      <ul>
        <li>Simplified versions of classic patterns</li>
        <li>Traditional materials with modern finishes</li>
        <li>Updated interpretations of historical designs</li>
        <li>Classic proportions with cleaner lines</li>
      </ul>
      
      <h3>Making Your Decision</h3>
      <p>When choosing between modern and classic door designs, consider:</p>
      <ul>
        <li><strong>Architectural Context:</strong> Your door should complement your home's overall style</li>
        <li><strong>Interior Design Scheme:</strong> Consider how the door will interact with your furniture and décor</li>
        <li><strong>Longevity:</strong> Classic designs tend to age more gracefully through changing trends</li>
        <li><strong>Practical Needs:</strong> Consider light, privacy, and security requirements</li>
        <li><strong>Personal Preference:</strong> Ultimately, choose what brings you joy each time you enter your home</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>At Al Nawakhdha Furniture, we craft both modern and classic doors with equal attention to detail and quality. Whether you prefer the ornate elegance of traditional designs or the sleek simplicity of contemporary styles, our expert artisans can create custom doors that perfectly match your vision and complement your home.</p>
    `,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000",
    date: "February 22, 2025",
    author: "Mohammed Al Khalifa",
    slug: "modern-vs-classic-door-designs"
  },
  {
    id: 5,
    title: "Interior Design Tips for Wooden Furniture",
    excerpt: "Expert advice on how to integrate wooden furniture into your interior design scheme for a cohesive, beautiful living space.",
    content: `
      <h2>Harmonizing Wooden Furniture in Modern Interiors</h2>
      <p>Wooden furniture brings warmth, texture, and a connection to nature into our homes. However, integrating wooden pieces cohesively requires thoughtful consideration of color, proportion, and style. These expert tips will help you create spaces where wooden furniture enhances your overall interior design.</p>
      
      <h3>Finding Balance with Wood Tones</h3>
      
      <h4>Mix Wood Tones Strategically</h4>
      <p>Contrary to popular belief, all wooden pieces in a room don't need to match perfectly. In fact, a thoughtful mix creates more visual interest and depth:</p>
      <ul>
        <li>Choose a dominant wood tone for larger pieces</li>
        <li>Add accent pieces in complementary tones</li>
        <li>Look for common undertones (warm or cool) to create harmony</li>
        <li>Use textiles and accessories to bridge different wood finishes</li>
      </ul>
      
      <h4>Create Contrast Through Finish</h4>
      <p>Even within the same wood species, varying finishes can create beautiful contrast:</p>
      <ul>
        <li>Pair matte and glossy finishes of similar woods</li>
        <li>Contrast rough-hewn surfaces with smooth, polished pieces</li>
        <li>Consider painted wooden elements alongside natural finishes</li>
      </ul>
      
      <h3>Positioning and Proportion</h3>
      
      <h4>Anchor Spaces with Substantial Pieces</h4>
      <p>Large wooden furniture pieces should serve as anchors in your space:</p>
      <ul>
        <li>Position dining tables, beds, or sideboards as focal points</li>
        <li>Allow adequate space around large wooden pieces to highlight their beauty</li>
        <li>Balance heavy wooden pieces with lighter furniture elements</li>
      </ul>
      
      <h4>Layer Different Heights and Depths</h4>
      <p>Create visual rhythm by varying the dimensions of wooden pieces:</p>
      <ul>
        <li>Combine tall bookcases with lower console tables</li>
        <li>Mix deep sofas with slender wooden side tables</li>
        <li>Use wooden accessories at different heights to draw the eye throughout the space</li>
      </ul>
      
      <h3>Complementary Design Elements</h3>
      
      <h4>Soften Wood with Textiles</h4>
      <p>Wooden furniture pairs beautifully with the right textiles:</p>
      <ul>
        <li>Add plush rugs under wooden dining tables and coffee tables</li>
        <li>Incorporate throw pillows and blankets on wooden chairs and benches</li>
        <li>Use upholstered elements alongside wooden frames</li>
        <li>Choose textiles that pick up undertones from your wooden pieces</li>
      </ul>
      
      <h4>Add Metallic Accents</h4>
      <p>Metal and wood create a pleasing contrast:</p>
      <ul>
        <li>Brass or gold accents warm up cooler wood tones</li>
        <li>Chrome and silver complement lighter woods</li>
        <li>Consider furniture that incorporates both wood and metal elements</li>
        <li>Use metal-framed artwork to complement wooden furniture</li>
      </ul>
      
      <h3>Wood in Different Interior Styles</h3>
      
      <h4>Modern Minimalist</h4>
      <p>In minimalist spaces, wooden furniture adds necessary warmth:</p>
      <ul>
        <li>Choose pieces with clean lines and minimal ornamentation</li>
        <li>Opt for lighter woods like maple, ash, or bleached oak</li>
        <li>Let the natural grain pattern serve as a subtle design element</li>
      </ul>
      
      <h4>Traditional</h4>
      <p>In traditional settings, wooden furniture grounds the space:</p>
      <ul>
        <li>Incorporate carved details and classic silhouettes</li>
        <li>Choose rich, darker woods like cherry, mahogany, or walnut</li>
        <li>Pair with classic textiles like velvet, silk, or damask</li>
      </ul>
      
      <h4>Eclectic</h4>
      <p>For eclectic interiors, wooden pieces can bridge diverse styles:</p>
      <ul>
        <li>Mix antique wooden pieces with modern elements</li>
        <li>Incorporate global wooden influences from different cultures</li>
        <li>Use wood as the common thread that ties disparate styles together</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Wooden furniture is one of the most versatile design elements in interior design. At Al Nawakhdha Furniture, we craft pieces that not only stand alone as beautiful objects but also harmonize with your existing décor. With thoughtful selection and placement, wooden furniture can transform your space into a cohesive, inviting environment that reflects your personal style while bringing the timeless beauty of natural materials into your everyday life.</p>
    `,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1000",
    date: "February 5, 2025",
    author: "Sarah Al Zayani",
    slug: "interior-design-tips-wooden-furniture"
  }
];

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(post => post.slug === slug);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
            <h1 className="heading-md mb-6">Blog Post Not Found</h1>
            <p className="mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
            <Button asChild>
              <Link to="/blog">Return to Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary/30">
      <div className="container-custom max-w-4xl">
        <Button variant="outline" asChild className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
        
        <article className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          {/* Featured Image */}
          <div className="aspect-video w-full relative">
            <img 
              src={post.image} 
              alt={post.title} 
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Blog Content */}
          <div className="p-6 md:p-10">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">{post.date} • By {post.author}</p>
              <h1 className="heading-md">{post.title}</h1>
            </div>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
