
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGallery, useAddGalleryImage, useDeleteGalleryImage } from "@/hooks/content";
import { useStorage } from "@/hooks/useStorage";
import ImageUploader from "./ImageUploader";
import { Loader2, X } from "lucide-react";

export default function GalleryManager() {
  const { data: galleryImages, isLoading } = useGallery();
  const addGalleryImage = useAddGalleryImage();
  const deleteGalleryImage = useDeleteGalleryImage();
  const { deleteImage } = useStorage();
  const [caption, setCaption] = useState("");

  const handleImageUploaded = async (url: string) => {
    addGalleryImage.mutate({ 
      image_url: url,
      caption: caption || ""
    });
    setCaption("");
  };

  const handleDeleteImage = async (id: number, url: string) => {
    // Delete from storage
    await deleteImage(url, 'gallery');
    
    // Delete from database
    deleteGalleryImage.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">Gallery Management</h3>
      
      <div className="mb-6 space-y-4">
        <h4 className="text-lg font-medium">Add New Image</h4>
        
        <Input
          placeholder="Image Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mb-3"
        />
        
        <ImageUploader 
          onImageUploaded={handleImageUploaded}
          bucket="gallery"
        />
      </div>
      
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium mb-4">Current Gallery Images</h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages && galleryImages.length > 0 ? (
            galleryImages.map((image) => (
              <div key={image.id} className="border rounded-md p-2 relative group">
                <div className="aspect-square overflow-hidden rounded-md">
                  <img 
                    src={image.image_url} 
                    alt={image.caption} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm mt-1 truncate">{image.caption}</p>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteImage(image.id, image.image_url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No gallery images found. Add some images above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
