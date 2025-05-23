
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStorage } from "@/hooks/storage";
import { Loader2, X } from "lucide-react";

interface EnhancedImageUploaderProps {
  onImageUploaded: (url: string) => void;
  bucket: string;
  folder?: string;
  accept?: string;
  className?: string;
  existingUrl?: string;
  onRemove?: () => void;
}

export default function EnhancedImageUploader({
  onImageUploaded,
  bucket,
  folder = "",
  accept = "image/*",
  className = "",
  existingUrl,
  onRemove,
}: EnhancedImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const { uploadImage, uploading, deleteImage, deleting } = useStorage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const url = await uploadImage(file, bucket, folder);
    if (url) {
      onImageUploaded(url);
      setFile(null);
    }
  };

  const handleRemove = async () => {
    if (existingUrl && onRemove) {
      // Extract the path from the URL if it's a storage URL
      const urlObj = new URL(existingUrl);
      const pathParts = urlObj.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      if (bucket && fileName) {
        try {
          // Try to delete the file from storage
          await deleteImage(bucket, `${folder ? `${folder}/` : ''}${fileName}`);
        } catch (error) {
          console.error("Error deleting image:", error);
          // Continue even if delete fails, as the user may want to remove the reference
        }
      }
      
      onRemove();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {existingUrl ? (
        <div className="relative">
          <img 
            src={existingUrl} 
            alt="Uploaded image" 
            className="max-w-full h-auto rounded-md border" 
          />
          {onRemove && (
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              className="mt-2 flex items-center" 
              onClick={handleRemove}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Remove Image
                </>
              )}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div>
            <Label htmlFor="image" className="block text-sm font-medium mb-1">
              Select Image
            </Label>
            <Input
              id="image"
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          {file && (
            <div className="mt-2 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground truncate">
                Selected: {file.name}
              </p>
              <Button onClick={handleUpload} disabled={uploading} type="button">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
