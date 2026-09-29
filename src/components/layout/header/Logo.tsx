
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Al Nawakhdha Furnitures W.L.L — Home">
      <span className="text-xl font-bold text-primary font-playfair leading-none">
        Al Nawakhdha Furnitures W.L.L
      </span>
    </Link>
  );
};

export default Logo;
