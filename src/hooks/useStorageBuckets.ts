
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStorageBuckets() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [buckets, setBuckets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Memoize the refreshBuckets function to prevent it from changing on every render
  const refreshBuckets = useCallback(async () => {
    // Skip if already refreshing to prevent loops
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Get list of existing buckets
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        // Check if this is a permissions error rather than a "bucket doesn't exist" error
        if (listError.message && listError.message.includes("row-level security policy")) {
          console.log("Permissions error when listing buckets - will try direct access");
          
          // Try to directly check specific required buckets
          const requiredBuckets = ["product-gallery"];
          const detectedBuckets: string[] = [];
          
          // Try to list objects in each bucket to verify existence
          for (const bucketName of requiredBuckets) {
            const { error: directError } = await supabase.storage.from(bucketName).list();
            if (!directError) {
              console.log(`Bucket "${bucketName}" exists and is accessible`);
              detectedBuckets.push(bucketName);
            } else {
              console.log(`Could not access bucket "${bucketName}": ${directError.message}`);
            }
          }
          
          if (detectedBuckets.length > 0) {
            console.log("Detected buckets:", detectedBuckets);
            setBuckets(detectedBuckets);
            setIsInitialized(true);
            return;
          }
        }
        
        console.error("Error listing buckets:", listError);
        setError(listError);
        return;
      }
      
      const existingBucketNames = existingBuckets ? existingBuckets.map(b => b.name) : [];
      console.log("Existing buckets:", existingBucketNames);
      setBuckets(existingBucketNames);
      
      // We'll use the existing buckets instead of trying to create new ones
      setIsInitialized(true);
    } catch (err: any) {
      console.error("Error checking storage buckets:", err);
      setError(err);
      toast.error(`Storage initialization error: ${err.message}`);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [isRefreshing]);
  
  useEffect(() => {
    // Only attempt to initialize buckets if we have an active session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        console.log("Session found, checking buckets");
        refreshBuckets();
      } else {
        console.log("No session found, skipping bucket check");
        // If not logged in, just mark as initialized to avoid errors
        setIsInitialized(true);
        setIsLoading(false);
      }
    });
  }, [refreshBuckets]); // Include refreshBuckets as dependency since it's now memoized

  return { 
    isInitialized, 
    error, 
    buckets, 
    isLoading, 
    refreshBuckets, 
    isRefreshing 
  };
}
