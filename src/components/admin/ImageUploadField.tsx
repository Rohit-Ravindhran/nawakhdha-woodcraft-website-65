
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ImagePlus, X, ExternalLink } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  altTextName?: string;
  bucket: string;
  folder: string;
  required?: boolean;
  control: any; // react-hook-form control
}

const ImageUploadField = ({
  name,
  label,
  altTextName,
  bucket,
  folder,
  required = false,
  control,
}: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const { getValues, setValue } = useFormContext();
  const { uploadImage, deleteImage } = useStorage();
  const imageUrl = getValues(name);
  
  const onRemove = async () => {
    if (!imageUrl) return;
    
    if (confirm("Are you sure you want to remove this image?")) {
      try {
        await deleteImage(imageUrl, bucket);
        setValue(name, "");
        if (altTextName) {
          setValue(altTextName, "");
        }
        toast.success("Image removed successfully");
      } catch (error: any) {
        console.error("Error removing image:", error);
        toast.error(error.message || "Failed to remove image");
      }
    }
  };
  
  const checkBucket = async (): Promise<boolean> => {
    try {
      // Check if bucket exists
      const { data, error } = await supabase.storage.getBucket(bucket);
      
      if (error) {
        console.error(`Error checking bucket "${bucket}":`, error);
        
        if (error.message.includes("Bucket not found")) {
          setBucketError(`Could not find storage bucket "${bucket}". Please make sure it exists in your Supabase project.`);
          return false;
        }
        
        setBucketError(`Error checking bucket "${bucket}": ${error.message}`);
        return false;
      }
      
      return true;
    } catch (err: any) {
      console.error(`Error in bucket check for "${bucket}":`, err);
      setBucketError(`Error checking bucket: ${err.message}`);
      return false;
    }
  };
  
  const onUpload = async (file: File) => {
    setUploading(true);
    setBucketError(null);
    try {
      // First check if bucket exists
      const bucketIsReady = await checkBucket();
      
      if (!bucketIsReady) {
        throw new Error(`Storage bucket "${bucket}" is not available. Please check your Supabase settings.`);
      }
      
      console.log(`Uploading to bucket "${bucket}", folder: ${folder}`);
      
      const uploadedUrl = await uploadImage(
        file,
        bucket,
        folder
      );
      
      if (uploadedUrl) {
        setValue(name, uploadedUrl, { shouldValidate: true });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      
      if (error.message && error.message.includes("row-level security policy")) {
        toast.error("Permission denied: You may not have the required permissions to upload to this bucket.");
        setBucketError("This appears to be a permissions issue. Your account doesn't have permissions to upload to this bucket.");
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <FormItem>
      <FormLabel>{label}{required && <span className="text-destructive"> *</span>}</FormLabel>
      <FormControl>
        <div className="flex flex-col space-y-2">
          {bucketError && (
            <div className="text-sm text-destructive p-2 border border-destructive/20 rounded-md bg-destructive/10">
              <p className="mb-2">{bucketError}</p>
              <a
                href="https://supabase.com/dashboard/project/enqplizqtwvquxliiygz/storage/buckets"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center text-xs"
              >
                Go to Supabase Storage Dashboard
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
          
          {imageUrl ? (
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
              <OptimizedImage
                src={imageUrl}
                alt={altTextName ? getValues(altTextName) || "Uploaded image" : "Uploaded image"}
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
          ) : (
            <label
              htmlFor={`upload-${name}`}
              className="relative cursor-pointer flex items-center justify-center rounded-md border border-dashed p-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="flex flex-col items-center space-y-1">
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm">Click to upload</p>
                </div>
              )}
              <input
                type="file"
                id={`upload-${name}`}
                className="absolute opacity-0 w-0 h-0"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUpload(file);
                  }
                }}
                disabled={uploading}
              />
            </label>
          )}
          
          {/* Alt Text Field */}
          {altTextName && (
            <FormItem>
              <FormLabel>Alt Text</FormLabel>
              <FormControl>
                <Controller
                  name={altTextName}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input placeholder="Image description for SEO" {...field} />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default ImageUploadField;
