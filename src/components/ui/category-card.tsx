
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
  imageAlt?: string;
  className?: string;
}

export function CategoryCard({ title, image, href, imageAlt, className }: CategoryCardProps) {
  return (
    <Card className={cn("overflow-hidden group", className)}>
      <Link to={href}>
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <img
              src={image || "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000"}
              alt={imageAlt || title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-0 flex items-end p-4">
            <h3 className="font-playfair text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>
      </Link>
    </Card>
  );
}
