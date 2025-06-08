
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BreadcrumbNavigation from "@/components/ui/breadcrumb-navigation";

interface BlogPostHeaderProps {
  postTitle: string;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ postTitle }) => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: postTitle }
  ];

  return (
    <>
      <BreadcrumbNavigation items={breadcrumbItems} className="mb-6" />
      
      <Button variant="outline" asChild className="mb-8">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </>
  );
};

export default BlogPostHeader;
