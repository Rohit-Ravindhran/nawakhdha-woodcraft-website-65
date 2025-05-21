
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStorage } from "@/hooks/useStorage";
import { Loader2, AlertCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnhancedImageUploaderProps {
  onImageUploaded: (url: string, alt: string) => void;
  bucket: string;
  folder?: string;
  initialImageUrl?: string;
  initialAltText?: string;
  imagePreviewHeight?: string;
}

export default function EnhancedImageUploader({
  onImageUploaded,
  bucket,
  folder = "",
  initialImageUrl = "",
  initialAltText = "",
  imagePreviewHeight = "40",
}: EnhancedImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState<string>(initialAltText || "");
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "");
  const [error, setError] = useState<string | null>(null);
  const { uploadImage, uploading } = useStorage();
  const { session } = useAuth();

  useEffect(() => {
    setImageUrl(initialImageUrl || "");
    setAltText(initialAltText || "");
  }, [initialImageUrl, initialAltText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (!session) {
      setError("You must be logged in to upload images");
      return;
    }
    
    try {
      setError(null);
      console.log(`Attempting to upload to bucket: ${bucket}, folder: ${folder}`);
      const url = await uploadImage(file, bucket, folder);
      
      if (url) {
        setImageUrl(url);
        onImageUploaded(url, altText);
        setFile(null);
      }
    } catch (error: any) {
      console.error("Error in EnhancedImageUploader:", error);
      
      let errorMessage = error.message || "Upload failed";
      
      // Handle specific bucket not found error
      if (errorMessage.includes("Bucket not found")) {
        errorMessage = `Bucket "${bucket}" not found. Please ensure it exists and you have proper permissions.`;
      }
      // Handle RLS policy errors
      else if (errorMessage.includes("row-level security policy")) {
        errorMessage = "Permission denied: You don't have access rights to upload to this bucket. Please contact an administrator.";
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    
      {imageUrl ? (
        <div className="space-y-2">
          <div className={`relative bg-gray-100 rounded-md overflow-hidden h-${imagePreviewHeight}`}>
            <img 
              src={imageUrl} 
              alt={altText || "Uploaded image"} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setImageUrl("");
                onImageUploaded("", altText);
              }}
            >
              Change Image
            </Button>
          </div>
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
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
              disabled={!session}
            />
            {!session && (
              <p className="text-xs text-amber-600 mt-1">
                You must be logged in to upload images
              </p>
            )}
          </div>

          {file && (
            <div className="mt-2 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground truncate">
                Selected: {file.name}
              </p>
              
              <div>
                <Label htmlFor="alt-text" className="block text-sm font-medium mb-1">
                  Alt Text
                </Label>
                <Input
                  id="alt-text"
                  type="text"
                  value={altText}
                  onChange={handleAltTextChange}
                  placeholder="Describe the image for accessibility"
                  className="mb-2"
                />
              </div>
              
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
      
      {imageUrl && (
        <div>
          <Label htmlFor="alt-text-existing" className="block text-sm font-medium mb-1">
            Alt Text
          </Label>
          <Input
            id="alt-text-existing"
            type="text"
            value={altText}
            onChange={(e) => {
              setAltText(e.target.value);
              onImageUploaded(imageUrl, e.target.value);
            }}
            placeholder="Describe the image for accessibility"
          />
        </div>
      )}
    </div>
  );
}
