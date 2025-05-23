
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStorage } from "@/hooks/storage";
import { Loader2, Plus, Trash } from "lucide-react";

interface Image {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface GalleryManagerProps {
  images: Image[];
  onChange: (images: Image[]) => void;
  bucket: string;
  folder?: string;
}

export default function GalleryManager({
  images,
  onChange,
  bucket,
  folder = "",
}: GalleryManagerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage } = useStorage();

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
        };
        onChange([...images, newImage]);
        setFile(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const handleImageUpdate = (id: string, field: "alt" | "caption", value: string) => {
    onChange(
      images.map((img) =>
        img.id === id ? { ...img, [field]: value } : img
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border rounded-md p-4 space-y-3">
            <div className="aspect-square relative bg-gray-200 rounded-md overflow-hidden">
              <img
                src={image.url}
                alt={image.alt || "Gallery image"}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <div>
                <Label htmlFor={`alt-${image.id}`} className="text-xs">
                  Alt Text
                </Label>
                <Input
                  id={`alt-${image.id}`}
                  value={image.alt || ""}
                  onChange={(e) => handleImageUpdate(image.id, "alt", e.target.value)}
                  placeholder="Image description"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor={`caption-${image.id}`} className="text-xs">
                  Caption
                </Label>
                <Textarea
                  id={`caption-${image.id}`}
                  value={image.caption || ""}
                  onChange={(e) => handleImageUpdate(image.id, "caption", e.target.value)}
                  placeholder="Image caption"
                  className="text-sm"
                  rows={2}
                />
              </div>
              
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-full mt-2"
                onClick={() => handleRemove(image.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ))}
        
        <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center space-y-2 min-h-[200px]">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="gallery-image-upload"
          />
          <Label
            htmlFor="gallery-image-upload"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
          >
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Add Image</span>
          </Label>
          
          {file && (
            <div className="w-full mt-2">
              <p className="text-sm text-gray-600 mb-2 truncate">
                {file.name}
              </p>
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
      </div>
    </div>
  );
}
