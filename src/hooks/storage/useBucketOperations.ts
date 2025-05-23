
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BucketCheckResult } from "./types";

/**
 * Hook for bucket-related operations
 */
export function useBucketOperations() {
  const [isChecking, setIsChecking] = useState(false);

  /**
   * Check if a bucket exists and is accessible
   */
  const checkBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      console.log(`Checking if bucket "${bucketName}" exists...`);
      
      // Method 1: Try direct listing first (requires less permissions)
      const { error: listError } = await supabase.storage
        .from(bucketName)
        .list();
        
      if (!listError) {
        console.log(`Successfully listed files in bucket "${bucketName}"`);
        return true;
      }
      
      // Method 2: Try a small file upload test
      try {
        const testFile = new Blob([new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A])], { type: 'image/png' });
        const testPath = `test-${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(testPath, testFile, { upsert: true });
          
        if (!uploadError) {
          console.log(`Successfully uploaded test file to bucket "${bucketName}"`);
          // Clean up the test file
          await supabase.storage.from(bucketName).remove([testPath]);
          return true;
        }
      } catch (e) {
        console.log(`Test upload failed for "${bucketName}"`, e);
      }
      
      // Method 3: Try getBucket as last resort
      const { error: bucketError } = await supabase.storage.getBucket(bucketName);
      
      if (!bucketError) {
        console.log(`Successfully verified bucket "${bucketName}" exists via getBucket`);
        return true;
      }
      
      console.error(`Bucket "${bucketName}" not found or not accessible`);
      return false;
    } catch (err) {
      console.error(`Error checking bucket "${bucketName}":`, err);
      return false;
    }
  };

  /**
   * Check bucket existence with loading state
   */
  const checkBucketWithStatus = async (bucketName: string): Promise<BucketCheckResult> => {
    setIsChecking(true);
    try {
      const exists = await checkBucketExists(bucketName);
      return { exists };
    } catch (error: any) {
      return { 
        exists: false, 
        error 
      };
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkBucketExists,
    checkBucketWithStatus,
    isChecking
  };
}
