
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
        <span className="absolute bottom-0 left-0 w-16 h-1 bg-primary mt-2"></span>
      </h2>
      {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
