
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <h1 className="text-xl font-bold text-primary font-playfair leading-none">
        Al Nawakhdha Furnitures W.L.L
      </h1>
    </Link>
  );
};

export default Logo;
