
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionTitle = ({
  title,
  subtitle,
  centered = false,
  className,
}: SectionTitleProps) => {
  return (
    <div
      className={cn(
        "mb-10",
        centered && "text-center",
        className
      )}
    >
      <h2 className="heading-md mb-3 relative">
        {title}
        <span className={cn(
          "absolute bottom-0 h-1 bg-primary mt-2",
          centered ? "left-1/2 transform -translate-x-1/2 w-16" : "left-0 w-16"
        )}></span>
      </h2>
      {subtitle && <p className={cn(
        "text-muted-foreground",
        centered ? "mx-auto max-w-2xl" : "max-w-2xl"
      )}>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
