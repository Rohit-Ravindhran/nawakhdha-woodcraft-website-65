
import { useParams } from "react-router-dom";
import { useBlogBySlug } from "@/hooks/content/useBlogBySlug";
import PageSEO from "@/components/seo/PageSEO";
import InternalLinks from "@/components/seo/InternalLinks";
import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { BlogPostLoading, BlogPostError, BlogPostNotFound } from "@/components/blog/BlogPostStates";

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
    return <BlogPostLoading slug={slug} />;
  }

  if (error) {
    console.error('BlogPostPage: Error occurred:', error);
    return <BlogPostError slug={slug} errorMessage={error.message} />;
  }

  if (!post) {
    console.log('BlogPostPage: No post found for slug:', slug);
    return <BlogPostNotFound slug={slug} />;
  }

  console.log('BlogPostPage: Rendering blog post:', post.title);

  const relatedLinks = [
    {
      title: 'Home',
      href: '/',
      description: 'Return to our main page'
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
          <BlogPostHeader postTitle={post.title} />
          <BlogPostContent post={post} />
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
