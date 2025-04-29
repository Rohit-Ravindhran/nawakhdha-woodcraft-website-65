
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-title";
import { BlogCard } from "@/components/ui/blog-card";

interface BlogPost {
  id?: number;
  title: string;
  excerpt?: string;
  image: string;
  image_alt?: string;
  date?: string;
  slug?: string;
  link?: string;
}

interface BlogSectionProps {
  blogData: {
    section_title?: string;
    items?: BlogPost[];
  } | null;
  defaultBlogPosts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ blogData, defaultBlogPosts }) => {
  // Use admin-defined blog posts or default if not available
  const blogPosts = blogData?.items && blogData.items.length > 0
    ? blogData.items.filter(item => item.title && item.image) 
    : defaultBlogPosts;

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <SectionTitle
          title={blogData?.section_title || "From Our Workshop Blog"}
          subtitle="Insights, tips, and updates from our furniture workshop."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogCard
              key={index}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              imageAlt={post.image_alt || `Blog post about ${post.title}`}
              date={post.date || "Recent"}
              href={post.link || `/blog/${post.slug || `post-${index}`}`}
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
  );
};

export default BlogSection;
