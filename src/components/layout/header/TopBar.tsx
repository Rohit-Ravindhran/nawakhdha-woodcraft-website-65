
import { Phone } from "lucide-react";

const TopBar = () => {
  return (
    <div className="hidden md:flex items-center justify-between py-2 border-b border-border/50">
      <div className="text-sm text-muted-foreground">
        Since 1975 | Bahrain's Premier Furniture Workshop
      </div>
      <div className="flex items-center gap-4">
        <a
          href="tel:+97337777777"
          className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
        >
          <Phone className="h-3 w-3" />
          <span>+973 1777 7777</span>
        </a>
      </div>
    </div>
  );
};

export default TopBar;
