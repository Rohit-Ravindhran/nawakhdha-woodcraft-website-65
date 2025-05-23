
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  altText: string;
  onRemove: () => void;
}

const ImagePreview = ({ imageUrl, altText, onRemove }: ImagePreviewProps) => {
  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden">
      <OptimizedImage
        src={imageUrl}
        alt={altText || "Uploaded image"}
        imageType="productDetail"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/80"
        onClick={onRemove}
        type="button"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImagePreview;
