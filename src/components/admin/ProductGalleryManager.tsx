
import React from "react";
import { Button } from "@/components/ui/button";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";
import { FormLabel, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface GalleryImage {
  url: string;
  caption: string;
  alt?: string;
}

interface ProductGalleryManagerProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  productId?: number | string;
}

export default function ProductGalleryManager({
  images,
  onChange,
  productId = "new"
}: ProductGalleryManagerProps) {
  const handleImageUploaded = (url: string, alt: string, index?: number) => {
    if (index !== undefined && index >= 0 && index < images.length) {
      // Update existing image
      const updatedImages = [...images];
      updatedImages[index] = { ...updatedImages[index], url, alt };
      onChange(updatedImages);
    } else {
      // Add new image
      onChange([...images, { url, caption: "", alt }]);
    }
  };

  const handleCaptionChange = (caption: string, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], caption };
    onChange(updatedImages);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Gallery Images</h4>
      
      {images.map((image, index) => (
        <div key={index} className="flex flex-col gap-2 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <h5 className="font-medium">Image {index + 1}</h5>
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              onClick={() => removeImage(index)}
            >
              Remove
            </Button>
          </div>
          
          <EnhancedImageUploader
            onImageUploaded={(url, alt) => handleImageUploaded(url, alt, index)}
            bucket="products"
            folder={`product-${productId}`}
            initialImageUrl={image.url}
            initialAltText={image.alt}
          />
          
          <FormItem>
            <FormLabel>Caption</FormLabel>
            <FormControl>
              <Input 
                value={image.caption} 
                onChange={(e) => handleCaptionChange(e.target.value, index)} 
              />
            </FormControl>
          </FormItem>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => handleImageUploaded("", "", images.length)}
      >
        Add Image
      </Button>
    </div>
  );
}
