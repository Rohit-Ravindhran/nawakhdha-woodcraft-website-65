
import React from "react";
import { Button } from "@/components/ui/button";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";
import { FormLabel, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { GalleryImage } from "@/components/admin/schemas/productSchema";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useStorage } from "@/hooks/storage";
import { toast } from "sonner";

interface ProductGalleryManagerProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  productId?: number | string;
  required?: boolean;
}

export default function ProductGalleryManager({
  images,
  onChange,
  productId = "new",
  required = true
}: ProductGalleryManagerProps) {
  const { purgeCDNCache } = useStorage();
  
  const handleImageUploaded = (url: string, alt: string, index?: number) => {
    if (!url) return; // Don't add empty URLs
    
    try {
      if (index !== undefined && index >= 0 && index < images.length) {
        // Update existing image
        const updatedImages = [...images];
        
        // If URL changed, purge CDN cache for old URL
        if (updatedImages[index].url !== url && updatedImages[index].url) {
          purgeCDNCache(updatedImages[index].url);
        }
        
        updatedImages[index] = { ...updatedImages[index], url, alt };
        onChange(updatedImages);
      } else {
        // Add new image
        onChange([...images, { url, caption: "", alt }]);
      }
      
      toast.success("Image updated successfully");
    } catch (error: any) {
      console.error("Error handling image update:", error);
      toast.error(error.message || "Failed to update image");
      
      // Check for specific RLS errors
      if (error.message?.includes("new row violates row-level security policy")) {
        toast.error("Permission denied: You don't have access to add images. Please contact an administrator.");
      }
    }
  };

  const handleCaptionChange = (caption: string, index: number) => {
    try {
      const updatedImages = [...images];
      updatedImages[index] = { ...updatedImages[index], caption };
      onChange(updatedImages);
    } catch (error: any) {
      console.error("Error updating caption:", error);
      toast.error("Failed to update image caption");
    }
  };

  const removeImage = (index: number) => {
    try {
      onChange(images.filter((_, i) => i !== index));
      toast.success("Image removed successfully");
    } catch (error: any) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const hasValidImages = images.length > 0 && images.every(img => img.url && img.url.trim() !== '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Gallery Images</h4>
        {required && images.length === 0 && (
          <div className="flex items-center text-amber-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>At least one image is required</span>
          </div>
        )}
      </div>
      
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
          
          {image.url && (
            <div className="aspect-video w-full rounded-md overflow-hidden mb-2">
              <OptimizedImage
                src={image.url}
                alt={image.alt || "Product image"}
                imageType="productDetail"
              />
            </div>
          )}
          
          <EnhancedImageUploader
            onImageUploaded={(url, alt) => handleImageUploaded(url, alt, index)}
            bucket="product-gallery"
            folder={`product-${productId}`}
            initialImageUrl={image.url}
            initialAltText={image.alt}
          />
          
          <FormItem>
            <FormLabel>Caption</FormLabel>
            <FormControl>
              <Input 
                value={image.caption || ""} 
                onChange={(e) => handleCaptionChange(e.target.value, index)} 
                placeholder="Enter a description for this image"
              />
            </FormControl>
          </FormItem>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => handleImageUploaded("", "")}
        className="w-full"
      >
        Add Image
      </Button>
      
      {required && !hasValidImages && (
        <p className="text-sm text-destructive">
          Please add at least one image to the gallery
        </p>
      )}
    </div>
  );
}
