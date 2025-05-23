
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBucketOperations } from "./useBucketOperations";

/**
 * Hook for image deletion operations
 */
export function useImageDelete() {
  const [deleting, setDeleting] = useState(false);
  const { checkBucketExists } = useBucketOperations();
  
  /**
   * Delete an image from a specified Supabase Storage bucket
   */
  const deleteImage = async (url: string, bucket: string): Promise<boolean> => {
    try {
      setDeleting(true);
      
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
      const bucketExists = await checkBucketExists(bucket);
      if (!bucketExists) {
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
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteImage,
    deleting
  };
}
