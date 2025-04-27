
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="text-center px-4 py-16">
        <h1 className="text-6xl md:text-8xl font-bold font-playfair text-primary mb-4">404</h1>
        <p className="text-2xl md:text-3xl text-foreground mb-6">Page Not Found</p>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We're sorry, but the page you were looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
