
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ImagePlus, X } from "lucide-react";
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
  
  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      // Check if bucket exists first
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket);
      
      if (bucketError) {
        console.error(`Error checking bucket "${bucket}":`, bucketError);
        throw new Error(`The storage bucket "${bucket}" does not exist or you don't have access to it.`);
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
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <FormItem>
      <FormLabel>{label}{required && <span className="text-destructive"> *</span>}</FormLabel>
      <FormControl>
        <div className="flex flex-col space-y-2">
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
