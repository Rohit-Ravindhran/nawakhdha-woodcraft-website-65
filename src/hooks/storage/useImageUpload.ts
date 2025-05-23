
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SIZE_LIMITS, CACHE_DURATIONS } from "@/utils/imageOptimization";
import { compressImage } from "@/utils/imageCompression";
import { ImageUploadOptions } from "./types";
import { useBucketOperations } from "./useBucketOperations";

/**
 * Hook for image upload operations
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const { checkBucketExists } = useBucketOperations();

  /**
   * Upload an image to a specified Supabase Storage bucket
   */
  const uploadImage = async (
    file: File, 
    bucket: string, 
    folder: string = "",
    options: ImageUploadOptions = {}
  ): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Check if user is authenticated for storage operations
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Authentication required for uploading files");
      }
      
      if (!file) {
        throw new Error("You must select an image to upload.");
      }

      // Verify bucket exists before proceeding
      const bucketExists = await checkBucketExists(bucket);
      if (!bucketExists) {
        throw new Error(`Bucket "${bucket}" does not exist or you don't have permission to access it.`);
      }

      const {
        optimize = true,
        imageType = 'product',
        maxWidth = 1920,
        maxHeight = 1080,
        cacheBusting = true
      } = options;

      // Process the file - compress if optimize is true
      let fileToUpload: File | Blob = file;
      
      if (optimize && file.type.includes('image/')) {
        // Get target size in KB based on image type
        const targetSize = SIZE_LIMITS[imageType as keyof typeof SIZE_LIMITS];
        
        console.log(`Optimizing ${imageType} image to target size: ${targetSize}KB`);
        
        const compressedBlob = await compressImage(
          file,
          Math.min(maxWidth, maxHeight),
          imageType === 'icon' ? 0.9 : 0.8,
          targetSize
        );
        
        if (compressedBlob) {
          const originalSizeKB = Math.round(file.size / 1024);
          const newSizeKB = Math.round(compressedBlob.size / 1024);
          
          console.log(`Compression results - Original: ${originalSizeKB}KB, New: ${newSizeKB}KB, Reduction: ${Math.round((1 - newSizeKB / originalSizeKB) * 100)}%`);
          
          fileToUpload = compressedBlob;
        }
      }

      // Generate a unique filename with random string for cache busting
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      // Use WebP extension for optimized images unless it's PNG with transparency
      const finalExt = optimize && !file.type.includes('png') ? 'webp' : fileExt;
      
      // Create randomized filename
      const randomString = Math.random().toString(36).substring(2, 8);
      const timestamp = Date.now();
      const fileName = cacheBusting 
        ? `${timestamp}-${randomString}.${finalExt}` 
        : `${Date.now()}.${finalExt}`;
      
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Set appropriate cache control based on image type
      const cacheMaxAge = CACHE_DURATIONS[imageType as keyof typeof CACHE_DURATIONS];
      
      console.log(`Uploading to bucket "${bucket}", path: ${filePath}`);
      
      // Upload the file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: `max-age=${cacheMaxAge}, stale-while-revalidate=86400`,
          contentType: optimize ? `image/${finalExt}` : file.type || 'image/jpeg',
          upsert: false // Prevent overwriting existing files with same name
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        if (uploadError.message.includes("row-level security policy")) {
          throw new Error("Permission denied: You don't have access rights to upload to this bucket");
        }
        
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      // Add timestamp parameter for cache busting on client side
      const publicUrl = data.publicUrl;
      return cacheBusting ? `${publicUrl}?t=${timestamp}` : publicUrl;
    } catch (error: any) {
      console.error("Storage upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading
  };
}
