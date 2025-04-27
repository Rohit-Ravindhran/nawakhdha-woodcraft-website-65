
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  href: string;
}

const BlogCard = ({ title, excerpt, image, date, href }: BlogCardProps) => {
  return (
    <Link to={href} className="block group">
      <div className="overflow-hidden rounded-lg mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Calendar className="h-4 w-4 mr-1" />
        <span>{date}</span>
      </div>
      <h3 className="text-xl font-bold font-playfair mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
    </Link>
  );
};

export default BlogCard;
