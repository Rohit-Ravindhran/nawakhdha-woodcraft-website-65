
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

export interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  date: string;
  href: string;
}

export function BlogCard({ title, excerpt, image, imageAlt = "", date, href }: BlogCardProps) {
  return (
    <Card className="overflow-hidden">
      <a href={href} className="group">
        <AspectRatio ratio={16 / 9} className="overflow-hidden">
          <OptimizedImage
            src={image || "/placeholder.svg"}
            alt={imageAlt || title}
            imageType="blog"
            className="w-full h-full transition-all group-hover:scale-105"
          />
        </AspectRatio>
      </a>
      <CardHeader className="p-4 pb-2">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
          <a href={href} className="group">
            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3">{excerpt}</p>
      </CardContent>
    </Card>
  );
}
