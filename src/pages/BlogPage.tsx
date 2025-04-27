
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import BlogCard from "@/components/ui/blog-card";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top Trends in Wooden Furniture 2025",
      excerpt: "Discover the latest trends in wooden furniture design that are dominating the industry in 2025, from sustainable materials to innovative techniques.",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000",
      date: "April 15, 2025",
      slug: "top-trends-wooden-furniture-2025"
    },
    {
      id: 2,
      title: "How to Maintain Custom Wooden Doors",
      excerpt: "Learn the best practices for maintaining your wooden doors to ensure they last for generations, including cleaning, polishing, and repair techniques.",
      image: "https://images.unsplash.com/photo-1517857399767-a9a54424dace?q=80&w=1000",
      date: "March 28, 2025",
      slug: "maintain-custom-wooden-doors"
    },
    {
      id: 3,
      title: "Choosing the Right Wood for Your Home",
      excerpt: "A comprehensive guide to selecting the perfect wood type for different furniture pieces in your home, considering durability, aesthetics, and sustainability.",
      image: "https://images.unsplash.com/photo-1529316738131-4d0e0761a38e?q=80&w=1000",
      date: "March 10, 2025",
      slug: "choosing-right-wood-home"
    },
    {
      id: 4,
      title: "Modern vs. Classic Door Designs",
      excerpt: "Compare the characteristics, benefits, and aesthetics of modern and classic door designs to help you choose the perfect style for your home.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000",
      date: "February 22, 2025",
      slug: "modern-vs-classic-door-designs"
    },
    {
      id: 5,
      title: "Interior Design Tips for Wooden Furniture",
      excerpt: "Expert advice on how to integrate wooden furniture into your interior design scheme for a cohesive, beautiful living space.",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1000",
      date: "February 5, 2025",
      slug: "interior-design-tips-wooden-furniture"
    }
  ];

  return (
    <div className="section-padding bg-secondary/30">
      <div className="container-custom">
        <SectionTitle
          title="Our Blog"
          subtitle="Insights, tips, and updates from our furniture workshop."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </div>
  );
};

export default BlogPage;
