
import React from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlogData } from "@/hooks/content/types";

interface BlogPostContentProps {
  post: BlogData;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
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
  );
};

export default BlogPostContent;
