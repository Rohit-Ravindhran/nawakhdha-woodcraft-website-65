
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface InternalLink {
  title: string;
  href: string;
  description?: string;
}

interface InternalLinksProps {
  title?: string;
  links: InternalLink[];
  className?: string;
  variant?: 'grid' | 'list';
}

const InternalLinks: React.FC<InternalLinksProps> = ({ 
  title = "Related Pages", 
  links, 
  className = "",
  variant = 'grid'
}) => {
  if (links.length === 0) return null;
  
  return (
    <section className={`py-8 ${className}`}>
      <h3 className="text-xl font-playfair font-semibold mb-4">{title}</h3>
      
      {variant === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, index) => (
            <Link 
              key={index} 
              to={link.href}
              className="block p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium group-hover:text-primary transition-colors">
                  {link.title}
                </h4>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              {link.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link 
                to={link.href}
                className="inline-flex items-center text-primary hover:underline"
              >
                {link.title}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
              {link.description && (
                <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default InternalLinks;
