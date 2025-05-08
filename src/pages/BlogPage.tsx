import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { BlogCard } from "@/components/ui/blog-card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  body_content: string;
  excerpt: string;
  featured_image_url: string;
  image_url: string;
  date: string;
  alt_text: string;
}

const BlogPage = () => {
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="flex justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !blogPosts) {
    return (
      <div className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="Our Blog"
            subtitle="Insights, tips, and updates from our furniture workshop."
            centered
          />
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            Error loading blog posts. Please try again later.
          </div>
        </div>
      </div>
    );
  }

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
              excerpt={post.excerpt || 
                (post.body_content ? post.body_content.substring(0, 150) + '...' : 
                (post.content ? post.content.substring(0, 150) + '...' : ''))}
              image={post.featured_image_url || post.image_url || "https://placehold.co/600x400"}
              date={new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              href={`/blog/${post.slug}`}
              imageAlt={post.alt_text || post.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;