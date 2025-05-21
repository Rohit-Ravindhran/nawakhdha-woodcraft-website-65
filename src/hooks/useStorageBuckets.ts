
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStorageBuckets() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [buckets, setBuckets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure all required buckets exist
  const initializeBuckets = async () => {
    const requiredBuckets = [
      { name: "product-categories", isPublic: true },
      { name: "product-gallery", isPublic: true },
      { name: "homepage", isPublic: true }
    ];
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get list of existing buckets
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        throw listError;
      }
      
      const existingBucketNames = existingBuckets ? existingBuckets.map(b => b.name) : [];
      console.log("Existing buckets:", existingBucketNames);
      setBuckets(existingBucketNames);
      
      // Check if all required buckets exist
      const missingBuckets = requiredBuckets.filter(
        bucket => !existingBucketNames.includes(bucket.name)
      );
      
      if (missingBuckets.length > 0) {
        console.log("Missing buckets detected:", missingBuckets.map(b => b.name));
        
        for (const bucket of missingBuckets) {
          try {
            console.log(`Creating bucket: ${bucket.name}`);
            const { error: createError } = await supabase.storage
              .createBucket(bucket.name, { public: bucket.isPublic });
            
            if (createError) {
              console.warn(`Could not create ${bucket.name} bucket:`, createError.message);
            } else {
              console.log(`Successfully created ${bucket.name} bucket`);
            }
          } catch (err) {
            console.error(`Error creating bucket ${bucket.name}:`, err);
          }
        }
        
        // Refresh bucket list after creation
        const { data: refreshedBuckets } = await supabase.storage.listBuckets();
        if (refreshedBuckets) {
          const refreshedNames = refreshedBuckets.map(b => b.name);
          setBuckets(refreshedNames);
          console.log("Updated bucket list:", refreshedNames);
          
          // Check if all required buckets now exist
          const stillMissing = requiredBuckets.filter(
            bucket => !refreshedNames.includes(bucket.name)
          );
          
          if (stillMissing.length === 0) {
            toast.success("All required storage buckets are now available");
          }
        }
      }
      
      setIsInitialized(true);
    } catch (err: any) {
      console.error("Error checking storage buckets:", err);
      setError(err);
      toast.error(`Storage initialization error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Only attempt to initialize buckets if we have an active session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        console.log("Session found, checking buckets");
        initializeBuckets();
      } else {
        console.log("No session found, skipping bucket check");
        // If not logged in, just mark as initialized to avoid errors
        setIsInitialized(true);
        setIsLoading(false);
      }
    });
  }, []);

  return { isInitialized, error, buckets, isLoading, refreshBuckets: initializeBuckets };
}
