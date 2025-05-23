
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBucketCheck = () => {
  const [bucketError, setBucketError] = useState<string | null>(null);
  
  const checkBucket = useCallback(async (bucket: string): Promise<boolean> => {
    try {
      console.log(`Checking bucket "${bucket}" availability...`);
      
      // First try to directly list files as this requires less permissions
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list();
      
      if (!listError) {
        console.log(`Successfully listed files in bucket "${bucket}"`);
        return true;
      }
      
      console.log(`List operation failed for "${bucket}", trying direct file upload test`);
      
      // If listing fails, try a direct file upload test with a tiny file
      // Create a small 1x1 transparent pixel as test file
      const testFile = new Blob([new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A])], { type: 'image/png' });
      const testFilePath = `test-${Date.now()}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(testFilePath, testFile, { upsert: true });
        
      if (!uploadError) {
        console.log(`Successfully uploaded test file to bucket "${bucket}"`);
        // Clean up the test file
        await supabase.storage.from(bucket).remove([testFilePath]);
        return true;
      }
      
      // If both list and upload fail, try getBucket as last resort
      console.log(`Upload test failed, trying getBucket for "${bucket}"`);
      const { data, error } = await supabase.storage.getBucket(bucket);
      
      if (error) {
        console.error(`Error checking bucket "${bucket}":`, error);
        
        if (error.message.includes("Bucket not found")) {
          setBucketError(`Storage bucket "${bucket}" is not available. Please check that it exists in your Supabase project.`);
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
  }, []);

  return { checkBucket, bucketError, setBucketError };
};
