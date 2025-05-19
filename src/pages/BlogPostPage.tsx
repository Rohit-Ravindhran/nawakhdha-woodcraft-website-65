
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Helmet } from "react-helmet-async";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  body_content: string;
  image_url: string;
  featured_image_url: string;
  alt_text: string;
  date: string;
  excerpt: string;
  author?: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (!data) {
          setError('Post not found');
          return;
        }

        setPost(data);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border text-center">
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
            <h1 className="heading-md mb-6">Blog Post Not Found</h1>
            <p className="mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Al Nawakhdha Furniture W.L.L</title>
        <meta name="description" content={post.excerpt || `Read about ${post.title}`} />
        <link rel="icon" href="/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png" type="image/png" />
        <link rel="apple-touch-icon" href="/lovable-uploads/505c241d-6d09-45d9-9f4b-57fda7a48447.png" />
      </Helmet>
      
      <div className="section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl">
          <Button variant="outline" asChild className="mb-8">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <article className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            {/* Featured Image */}
            <AspectRatio ratio={16/9}>
              <OptimizedImage 
                src={post.featured_image_url || post.image_url || "https://placehold.co/800x450"} 
                alt={post.alt_text || post.title} 
                imageType="blog"
                priority={true}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            
            {/* Blog Content */}
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {post.author && ` • By ${post.author}`}
                </p>
                <h1 className="heading-md">{post.title}</h1>
                {post.excerpt && (
                  <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
                )}
              </div>
              
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ 
                  __html: post.body_content || post.content || '' 
                }} 
              />
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
