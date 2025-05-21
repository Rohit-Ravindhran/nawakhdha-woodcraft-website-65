
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStorageBuckets() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Ensure all required buckets exist
  const initializeBuckets = async () => {
    const requiredBuckets = [
      { name: "product-categories", isPublic: true },
      { name: "product-gallery", isPublic: true },
      { name: "homepage", isPublic: true }
    ];
    
    try {
      // Get list of existing buckets
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        throw listError;
      }
      
      const existingBucketNames = existingBuckets ? existingBuckets.map(b => b.name) : [];
      
      // Create any missing buckets
      for (const bucket of requiredBuckets) {
        if (!existingBucketNames.includes(bucket.name)) {
          console.log(`Creating missing bucket: ${bucket.name}`);
          
          const { error } = await supabase.storage.createBucket(
            bucket.name, 
            { public: bucket.isPublic }
          );
          
          if (error) {
            // Just log, don't throw, so we try creating all buckets
            console.error(`Error creating bucket ${bucket.name}:`, error);
          }
        }
      }
      
      setIsInitialized(true);
    } catch (err: any) {
      console.error("Error initializing storage buckets:", err);
      setError(err);
    }
  };
  
  useEffect(() => {
    // Only attempt to initialize buckets if we have an active session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        initializeBuckets();
      } else {
        // If not logged in, just mark as initialized to avoid errors
        setIsInitialized(true);
      }
    });
  }, []);

  return { isInitialized, error };
}
