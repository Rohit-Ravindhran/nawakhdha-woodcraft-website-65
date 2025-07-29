
import React from 'react';
import { cn } from "@/lib/utils";

interface ProductHeaderProps {
  categoryName: string;
  productName: string;
}

export function ProductHeader({ categoryName, productName }: ProductHeaderProps) {
  // Use H1 for SEO optimization on product pages
  const displayTitle = productName || categoryName;
  const displaySubtitle = productName !== categoryName ? categoryName : "";

  return (
    <div className="mb-10 text-center">
      <h1 className="heading-md mb-3 relative">
        {displayTitle}
        <span className="absolute bottom-0 h-1 bg-primary mt-2 left-1/2 transform -translate-x-1/2 w-16"></span>
      </h1>
      {displaySubtitle && (
        <p className="text-muted-foreground mx-auto max-w-2xl">
          {displaySubtitle}
        </p>
      )}
    </div>
  );
}
