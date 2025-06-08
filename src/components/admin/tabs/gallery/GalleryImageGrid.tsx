
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { useImageLightbox } from "@/hooks/use-image-lightbox";

interface GalleryImage {
  id: string;
  image_url: string | null;
  alt_text: string | null;
  caption: string | null;
  position: number | null;
  product_categories?: {
    category_name: string;
  } | null;
}

interface GalleryImageGridProps {
  images: GalleryImage[] | undefined;
  selectedCategory: string | null;
  onEdit: (image: GalleryImage) => void;
  onDelete: (id: string) => void;
}

export default function GalleryImageGrid({ 
  images, 
  selectedCategory, 
  onEdit, 
  onDelete 
}: GalleryImageGridProps) {
  const { isOpen, currentImage, openLightbox, closeLightbox } = useImageLightbox();

  if (!images || images.length === 0) {
    return (
      <div className="col-span-full py-8 text-center text-gray-500">
        No gallery images found. {selectedCategory ? 'Try selecting a different category or ' : ''}
        Click "Add Single Image" to add one.
      </div>
    );
  }

  // Handle image click to open lightbox
  const handleImageClick = (image: GalleryImage, e: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering edit/delete actions
    e.stopPropagation();
    
    if (image.image_url) {
      openLightbox({
        src: image.image_url,
        alt: image.alt_text || 'Gallery image',
        caption: image.caption || image.alt_text || 'Gallery image',
      });
    }
  };

  return (
    <>
      {images.map((image) => (
        <div key={image.id} className="border rounded-lg overflow-hidden bg-white">
          <div className="aspect-video relative bg-gray-100">
            {image.image_url ? (
              <img 
                src={image.image_url} 
                alt={image.alt_text || 'Gallery image'} 
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={(e) => handleImageClick(image, e)}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
                role="button"
                tabIndex={0}
                aria-label={`View enlarged image: ${image.caption || image.alt_text || 'Gallery image'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleImageClick(image, e);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs">
              Position: {image.position || 0}
            </div>
          </div>
          <div className="p-4">
            <div className="text-sm font-medium">
              {image.product_categories?.category_name || 'Unknown category'}
            </div>
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
              {image.caption || 'No caption'}
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(image)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(image.id)}
                className="flex items-center text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Lightbox */}
      <ImageLightbox
        isOpen={isOpen}
        onClose={closeLightbox}
        src={currentImage?.src || ''}
        alt={currentImage?.alt || ''}
        caption={currentImage?.caption}
      />
    </>
  );
}
