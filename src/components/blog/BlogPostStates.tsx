
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageSEO from "@/components/seo/PageSEO";

interface BlogPostLoadingProps {
  slug?: string;
}

export const BlogPostLoading: React.FC<BlogPostLoadingProps> = ({ slug }) => (
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

interface BlogPostErrorProps {
  slug?: string;
  errorMessage: string;
}

export const BlogPostError: React.FC<BlogPostErrorProps> = ({ slug, errorMessage }) => (
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
          <p className="mb-6">There was an error loading the blog post: {errorMessage}</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  </>
);

interface BlogPostNotFoundProps {
  slug?: string;
}

export const BlogPostNotFound: React.FC<BlogPostNotFoundProps> = ({ slug }) => (
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
