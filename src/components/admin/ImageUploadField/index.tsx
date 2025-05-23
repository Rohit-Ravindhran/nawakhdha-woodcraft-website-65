import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useStorage } from "@/hooks/storage";
import { useBucketCheck } from "./useBucketCheck";
import BucketError from "./BucketError";
import ImagePreview from "./ImagePreview";
import UploadPlaceholder from "./UploadPlaceholder";
import AltTextField from "./AltTextField";

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
  const { checkBucket, bucketError, setBucketError } = useBucketCheck();
  
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
    setBucketError(null);
    try {
      // First check if bucket exists
      const bucketIsReady = await checkBucket(bucket);
      
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
          <BucketError bucketError={bucketError} />
          
          {imageUrl ? (
            <ImagePreview 
              imageUrl={imageUrl} 
              altText={altTextName ? getValues(altTextName) || "Uploaded image" : "Uploaded image"} 
              onRemove={onRemove}
            />
          ) : (
            <UploadPlaceholder 
              uploading={uploading} 
              inputId={`upload-${name}`} 
              onFileChange={onUpload}
            />
          )}
          
          {/* Alt Text Field */}
          {altTextName && <AltTextField name={altTextName} control={control} />}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default ImageUploadField;
