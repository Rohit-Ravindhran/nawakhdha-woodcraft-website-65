import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStorage } from "@/hooks/storage";
import { Loader2, GripVertical, Trash, Plus } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { useImageLightbox } from "@/hooks/use-image-lightbox";

interface Image {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  position?: number;
}

interface ProductGalleryManagerProps {
  images: Image[];
  onChange: (images: Image[]) => void;
  bucket: string;
  folder?: string;
}

export default function ProductGalleryManager({
  images,
  onChange,
  bucket,
  folder = "",
}: ProductGalleryManagerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage } = useStorage();
  const { isOpen, currentImage, openLightbox, closeLightbox } = useImageLightbox();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, bucket, folder);
      if (url) {
        const newImage: Image = {
          id: `img_${Date.now()}`,
          url,
          alt: "",
          caption: "",
          position: images.length,
        };
        onChange([...images, newImage]);
        setFile(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    onChange(updatedItems);
  };

  const handleRemove = (id: string) => {
    const updatedImages = images
      .filter((img) => img.id !== id)
      .map((img, index) => ({ ...img, position: index }));
    onChange(updatedImages);
  };

  const handleImageUpdate = (id: string, field: "alt" | "caption", value: string) => {
    onChange(
      images.map((img) =>
        img.id === id ? { ...img, [field]: value } : img
      )
    );
  };

  // Handle image click to open lightbox
  const handleImageClick = (image: Image) => {
    openLightbox({
      src: image.url,
      alt: image.alt || 'Gallery image',
      caption: image.caption || image.alt || 'Gallery image',
    });
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {images
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border rounded-md p-4 bg-white flex"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center mr-4 text-gray-400"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>

                        <div className="h-24 w-24 relative bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={image.url}
                            alt={image.alt || "Gallery image"}
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(image);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`View enlarged image: ${image.caption || image.alt || 'Gallery image'}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleImageClick(image);
                              }
                            }}
                          />
                        </div>

                        <div className="ml-4 flex-grow space-y-2">
                          <div>
                            <Label
                              htmlFor={`alt-${image.id}`}
                              className="text-xs"
                            >
                              Alt Text
                            </Label>
                            <Input
                              id={`alt-${image.id}`}
                              value={image.alt || ""}
                              onChange={(e) =>
                                handleImageUpdate(
                                  image.id,
                                  "alt",
                                  e.target.value
                                )
                              }
                              placeholder="Image description"
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor={`caption-${image.id}`}
                              className="text-xs"
                            >
                              Caption
                            </Label>
                            <Textarea
                              id={`caption-${image.id}`}
                              value={image.caption || ""}
                              onChange={(e) =>
                                handleImageUpdate(
                                  image.id,
                                  "caption",
                                  e.target.value
                                )
                              }
                              placeholder="Image caption"
                              className="text-sm"
                              rows={1}
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 self-start ml-2"
                          onClick={() => handleRemove(image.id)}
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center space-y-2 min-h-[100px]">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="product-gallery-upload"
        />
        <Label
          htmlFor="product-gallery-upload"
          className="cursor-pointer flex items-center justify-center w-full"
        >
          <Plus className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Add Image</span>
        </Label>

        {file && (
          <div className="w-full max-w-xs">
            <p className="text-sm text-gray-600 mb-2 truncate">{file.name}</p>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
              size="sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={isOpen}
        onClose={closeLightbox}
        src={currentImage?.src || ''}
        alt={currentImage?.alt || ''}
        caption={currentImage?.caption}
      />
    </div>
  );
}
