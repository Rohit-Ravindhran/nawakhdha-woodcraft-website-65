
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CategoryCard = ({
  title,
  image,
  href,
  size = "md",
  className,
}: CategoryCardProps) => {
  const sizeClasses = {
    sm: "h-64",
    md: "h-80",
    lg: "h-96",
  };

  return (
    <Link
      to={href}
      className={cn(
        "group relative block overflow-hidden rounded-lg",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
        <div className="mt-2">
          <span className="inline-flex items-center text-sm text-white border-b border-white/0 transition-all group-hover:border-white/100">
            View Collection
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
