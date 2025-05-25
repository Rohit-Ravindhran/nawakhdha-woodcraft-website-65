
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
  imageAlt?: string;
  className?: string;
  imageComponent?: React.ReactNode;
  priority?: boolean; // Add priority prop for above-the-fold images
}

export function CategoryCard({ 
  title, 
  image, 
  href, 
  imageAlt, 
  className, 
  imageComponent, 
  priority = false 
}: CategoryCardProps) {
  return (
    <Card className={cn("overflow-hidden group hover:shadow-lg transition-all duration-300", className)}>
      <Link to={href} className="block">
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            {imageComponent || (
              <OptimizedImage
                src={image || "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000"}
                alt={imageAlt || title}
                imageType="product"
                className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                priority={priority}
                width={400}
                height={300}
                loading={priority ? 'eager' : 'lazy'}
              />
            )}
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          <div className="absolute inset-0 flex items-end p-4">
            <h3 className="font-playfair text-lg font-semibold text-white drop-shadow-lg">{title}</h3>
          </div>
        </div>
      </Link>
    </Card>
  );
}
