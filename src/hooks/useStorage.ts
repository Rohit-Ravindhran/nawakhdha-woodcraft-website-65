
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SIZE_LIMITS, CACHE_DURATIONS } from "@/utils/imageOptimization";
import { compressImage } from "@/utils/imageCompression";

export function useStorage() {
  const [uploading, setUploading] = useState(false);

  /**
   * Upload an image to a specified Supabase Storage bucket
   */
  const uploadImage = async (
    file: File, 
    bucket: string, 
    folder: string = "",
    options: {
      optimize?: boolean;
      imageType?: keyof typeof SIZE_LIMITS;
      maxWidth?: number;
      maxHeight?: number;
      cacheBusting?: boolean;
    } = {}
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
        const targetSize = SIZE_LIMITS[imageType];
        
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
      const cacheMaxAge = CACHE_DURATIONS[imageType];
      
      // Verify bucket exists before upload
      console.log(`Checking if bucket "${bucket}" exists before uploading...`);
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket(bucket);
        
      if (bucketError) {
        console.error(`Error checking bucket "${bucket}":`, bucketError);
        throw new Error(`Bucket "${bucket}" does not exist or you don't have access to it.`);
      }
      
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

  /**
   * Delete an image from a specified Supabase Storage bucket
   */
  const deleteImage = async (url: string, bucket: string): Promise<boolean> => {
    try {
      if (!url) {
        throw new Error("No image URL provided");
      }
      
      // Check if user is authenticated for storage operations
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Authentication required for deleting files");
      }
      
      // Extract the file path from the URL
      const urlParts = url.split(`${bucket}/`);
      if (urlParts.length < 2) {
        throw new Error(`Invalid file URL format. Cannot extract path from ${url}`);
      }
      
      // Remove any query parameters
      const filePath = urlParts[1].split('?')[0];
      
      console.log(`Deleting from bucket "${bucket}", path: ${filePath}`);
      
      // Verify bucket exists
      const { error: bucketError } = await supabase.storage
        .getBucket(bucket);
        
      if (bucketError) {
        console.error(`Error checking bucket "${bucket}":`, bucketError);
        throw new Error(`Bucket "${bucket}" does not exist or you don't have access to it.`);
      }
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
        
      if (error) {
        console.error(`Error deleting from bucket "${bucket}", path: ${filePath}:`, error);
        if (error.message.includes("row-level security policy")) {
          throw new Error("Permission denied: You don't have access rights to delete from this bucket");
        }
        throw error;
      }
      
      console.log(`Successfully deleted from bucket "${bucket}", path: ${filePath}`);
      return true;
    } catch (error: any) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };

  /**
   * Add a cache busting parameter to an existing URL
   */
  const addCacheBusting = (url: string): string => {
    if (!url || url.includes('/placeholder.svg') || url.endsWith('.svg')) {
      return url;
    }
    
    // Remove any existing query parameters
    const baseUrl = url.split('?')[0];
    
    // Add timestamp as query parameter
    return `${baseUrl}?v=${Date.now()}`;
  };

  /**
   * Purge CDN cache for an image URL
   */
  const purgeCDNCache = async (url: string): Promise<boolean> => {
    if (!url) return false;
    
    try {
      // Remove existing cache busting parameters
      const cleanUrl = url.split('?')[0];
      
      // Add new cache busting parameter
      const newUrl = `${cleanUrl}?v=${Date.now()}`;
      
      console.log(`Purging CDN cache for: ${url}`);
      console.log(`New cache-busted URL: ${newUrl}`);
      
      return true;
    } catch (error: any) {
      console.error('Error purging CDN cache:', error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    addCacheBusting,
    purgeCDNCache,
    uploading
  };
}
