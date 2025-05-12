
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-title";
import { BlogCard } from "@/components/ui/blog-card";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id?: string;
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
  defaultBlogPosts?: BlogPost[];
  isLoading?: boolean;
  error?: unknown;
}

const BlogSection: React.FC<BlogSectionProps> = ({ 
  blogData, 
  defaultBlogPosts = [],
  isLoading = false,
  error = null
}) => {
  // Use blog posts from props, ensuring we have valid data
  const blogPosts = React.useMemo(() => {
    if (blogData?.items && blogData.items.length > 0) {
      return blogData.items.filter(item => item.title && item.image);
    }
    return defaultBlogPosts;
  }, [blogData, defaultBlogPosts]);

  // Debug information
  React.useEffect(() => {
    console.log('BlogSection - Data loaded:', {
      fromPropsCount: blogData?.items?.length || 0,
      fromDefaultCount: defaultBlogPosts.length,
      displayingCount: blogPosts.length,
      error: error ? String(error) : null
    });
  }, [blogData, defaultBlogPosts, blogPosts, error]);

  // Handle loading state with skeleton UI
  if (isLoading) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="From Our Workshop Blog"
            subtitle="Loading our latest blog posts..."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={`skeleton-${index}`} className="flex flex-col space-y-2">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error && blogPosts.length === 0) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="From Our Workshop Blog"
            subtitle="We're having trouble loading our blog posts. Please check back soon."
            centered
          />
          <div className="flex flex-col justify-center items-center py-10 text-red-500">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p className="text-center">Unable to load blog data</p>
            {process.env.NODE_ENV !== 'production' && (
              <p className="text-sm text-muted-foreground mt-2">{String(error)}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // If we have no blog posts to show
  if (blogPosts.length === 0) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title={blogData?.section_title || "From Our Workshop Blog"}
            subtitle="Our blog posts will be available soon."
            centered
          />
          <div className="flex justify-center items-center py-10">
            <p className="text-muted-foreground">No blog posts available at the moment</p>
          </div>
        </div>
      </section>
    );
  }

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
              key={post.id || index}
              title={post.title}
              excerpt={post.excerpt || ""}
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
