
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStorage } from "@/hooks/useStorage";
import { Loader2, Upload, TrashIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface EnhancedImageUploaderProps {
  onImageUploaded: (url: string, alt: string) => void;
  bucket: string;
  folder?: string;
  accept?: string;
  initialImageUrl?: string;
  initialAltText?: string;
  imagePreviewHeight?: string;
}

export default function EnhancedImageUploader({
  onImageUploaded,
  bucket,
  folder = "",
  accept = "image/*",
  initialImageUrl = "",
  initialAltText = "",
  imagePreviewHeight = "40"
}: EnhancedImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [altText, setAltText] = useState<string>(initialAltText);
  const [uploadError, setUploadError] = useState<string>("");
  const { uploadImage, deleteImage, uploading } = useStorage();

  // Convert bucket name from underscore to hyphen format
  const formattedBucket = bucket.replace(/_/g, '-');

  useEffect(() => {
    setImageUrl(initialImageUrl);
    setAltText(initialAltText);
  }, [initialImageUrl, initialAltText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    
    if (e.target.files && e.target.files.length > 0) {
      // Validate file type
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      
      if (!validTypes.includes(file.type)) {
        setUploadError("Invalid file type. Please select a JPEG, PNG, WebP, or GIF image");
        return;
      }
      
      // Check file size - 5MB max
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File is too large. Please select an image smaller than 5MB");
        return;
      }
      
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file first");
      return;
    }
    
    try {
      setUploadError("");
      const url = await uploadImage(file, formattedBucket, folder);
      if (url) {
        setImageUrl(url);
        onImageUploaded(url, altText);
        setFile(null);
        toast.success("Image uploaded successfully");
      } else {
        setUploadError("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
      toast.error("Image upload failed");
    }
  };

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(e.target.value);
    if (imageUrl) {
      onImageUploaded(imageUrl, e.target.value);
    }
  };

  const handleDeleteImage = async () => {
    if (imageUrl && window.confirm("Are you sure you want to delete this image?")) {
      try {
        if (await deleteImage(imageUrl, formattedBucket)) {
          setImageUrl("");
          onImageUploaded("", "");
          toast.success("Image deleted successfully");
        } else {
          toast.error("Failed to delete image");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete image");
      }
    }
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative bg-slate-100 p-2 rounded-md">
          <img 
            src={imageUrl} 
            alt={altText} 
            className={`max-h-${imagePreviewHeight} object-cover rounded-md`}
          />
          <div className="text-xs text-muted-foreground mt-1 break-all">
            {imageUrl}
          </div>
          
          <div className="mt-2">
            <Label htmlFor="altText" className="block text-sm font-medium mb-1">
              Alt Text (for SEO and accessibility)
            </Label>
            <Input
              id="altText"
              value={altText}
              onChange={handleAltTextChange}
              placeholder="Describe the image for screen readers and SEO"
              className="mb-2"
            />
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteImage} 
              className="mt-1"
              type="button"
            >
              <TrashIcon className="mr-1 h-4 w-4" /> Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="image" className="block text-sm font-medium mb-1">
            Upload Image
          </Label>
          <Input
            id="image"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          
          {uploadError && (
            <div className="flex items-center text-destructive text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{uploadError}</span>
            </div>
          )}
          
          {file && (
            <div className="mt-2 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground truncate">
                Selected: {file.name}
              </p>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="uploadAltText" className="text-sm font-medium">
                  Alt Text (for SEO and accessibility)
                </Label>
                <Input
                  id="uploadAltText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image for screen readers and SEO"
                />
                
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  type="button"
                  className="mt-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>• Recommended image formats: WebP, JPEG, PNG</p>
            <p>• Maximum file size: 5MB</p>
            <p>• Images will be optimized automatically</p>
          </div>
        </div>
      )}
    </div>
  );
}
