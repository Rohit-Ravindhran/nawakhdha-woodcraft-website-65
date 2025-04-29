
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
  title: string;
  image: string;
  imageAlt?: string; // Added imageAlt prop
  href: string;
  className?: string;
  children?: React.ReactNode;
}

export function CategoryCard({
  title,
  image,
  imageAlt = "",  // Default to empty string
  href,
  className,
  children,
  ...props
}: CategoryCardProps) {
  return (
    <Card className={cn("overflow-hidden rounded-xl", className)} {...props}>
      <a href={href} className="group">
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={image || "/placeholder.svg"}
              alt={imageAlt || title} // Use imageAlt if provided, otherwise fallback to title
              className="object-cover w-full h-full transition-all group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 w-full p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>
      </a>
      {children && <CardContent className="p-4">{children}</CardContent>}
    </Card>
  );
}
