
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogBySlug } from "@/hooks/content/useBlogBySlug";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PageSEO from "@/components/seo/PageSEO";
import BreadcrumbNavigation from "@/components/ui/breadcrumb-navigation";
import InternalLinks from "@/components/seo/InternalLinks";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  console.log('BlogPostPage: Rendering with slug:', slug);
  
  const { 
    data: post, 
    isLoading: loading, 
    error 
  } = useBlogBySlug(slug);

  console.log('BlogPostPage: Current state:', {
    slug,
    post: post ? {
      id: post.id,
      title: post.title,
      slug: post.slug,
      hasContent: !!post.body_content || !!post.content,
      hasFeaturedImage: !!post.featured_image_url,
      hasImage: !!post.image_url
    } : null,
    loading,
    error: error?.message
  });

  if (loading) {
    return (
      <>
        <PageSEO
          title={`Loading Blog Post... | Al Nawakhdha Furniture W.L.L`}
          description="Loading blog post from Al Nawakhdha Furniture workshop blog"
          url={`/blog/${slug}`}
          type="article"
        />
        <div className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-border text-center">
              <p>Loading post...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    console.error('BlogPostPage: Error occurred:', error);
    return (
      <>
        <PageSEO
          title="Blog Post Error | Al Nawakhdha Furniture W.L.L"
          description="Error loading blog post"
          url={`/blog/${slug}`}
          noIndex={true}
        />
        <div className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
              <h1 className="heading-md mb-6">Error Loading Blog Post</h1>
              <p className="mb-6">There was an error loading the blog post: {error.message}</p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    console.log('BlogPostPage: No post found for slug:', slug);
    return (
      <>
        <PageSEO
          title="Blog Post Not Found | Al Nawakhdha Furniture W.L.L"
          description="The requested blog post could not be found"
          url={`/blog/${slug}`}
          noIndex={true}
        />
        <div className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
              <h1 className="heading-md mb-6">Blog Post Not Found</h1>
              <p className="mb-6">
                The blog post with slug "{slug}" could not be found. This could mean:
              </p>
              <ul className="list-disc ml-6 mb-6">
                <li>The blog post doesn't exist in the database</li>
                <li>The slug format is incorrect</li>
                <li>The blog post hasn't been published yet</li>
              </ul>
              <p className="mb-6 text-sm text-gray-600">
                Check the browser console for detailed debugging information.
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  console.log('BlogPostPage: Rendering blog post:', post.title);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title }
  ];

  const relatedLinks = [
    {
      title: 'All Blog Posts',
      href: '/blog',
      description: 'Read more insights from our workshop'
    },
    {
      title: 'Our Products',
      href: '/products',
      description: 'Explore our handcrafted furniture collection'
    },
    {
      title: 'Contact Us',
      href: '/contact',
      description: 'Discuss your custom furniture project'
    }
  ];

  const publishedDate = post.date ? new Date(post.date).toISOString() : undefined;

  return (
    <>
      <PageSEO
        title={`${post.title} | Al Nawakhdha Furniture W.L.L`}
        description={post.excerpt || `Read about ${post.title} from Al Nawakhdha Furniture workshop blog`}
        image={post.featured_image_url || post.image_url}
        url={`/blog/${slug}`}
        type="article"
        publishedTime={publishedDate}
        author="Al Nawakhdha Furniture"
        category="Furniture & Woodworking"
      />
      
      <div className="section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl">
          <BreadcrumbNavigation items={breadcrumbItems} className="mb-6" />
          
          <Button variant="outline" asChild className="mb-8">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <article className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            {/* Featured Image */}
            {(post.featured_image_url || post.image_url) && (
              <AspectRatio ratio={16/9}>
                <OptimizedImage 
                  src={post.featured_image_url || post.image_url || "https://placehold.co/800x450"} 
                  alt={post.alt_text || post.title} 
                  imageType="blog"
                  priority={true}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            )}
            
            {/* Blog Content */}
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {post.date ? new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'No date available'}
                </p>
                <h1 className="heading-md">{post.title}</h1>
                {post.excerpt && (
                  <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
                )}
              </div>
              
              <div className="prose max-w-none">
                {post.body_content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.body_content }} />
                ) : post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p className="text-gray-600 italic">
                    No content available for this blog post. Please check the admin panel to add content.
                  </p>
                )}
              </div>
            </div>
          </article>
          
          <InternalLinks 
            title="Related Content" 
            links={relatedLinks}
            variant="grid"
            className="mt-8"
          />
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
