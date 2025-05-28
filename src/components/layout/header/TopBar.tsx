
import { Phone } from "lucide-react";

const TopBar = () => {
  return (
    <div className="hidden md:flex items-center justify-between py-2 border-b border-border/50">
      <div className="text-sm text-muted-foreground">
        Since 1975 | Bahrain's Premier Furniture Workshop
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3 w-3" />
          <a
            href="tel:+97365008793"
            className="hover:text-primary transition-colors"
          >
            +973 65008793
          </a>
          <span className="mx-2">|</span>
          <a
            href="tel:+97333133750"
            className="hover:text-primary transition-colors"
          >
            +973 33133750
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
