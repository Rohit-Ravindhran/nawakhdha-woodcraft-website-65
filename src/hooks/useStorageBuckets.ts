
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
        console.error("Error listing buckets:", listError);
        setError(listError);
        return;
      }
      
      const existingBucketNames = existingBuckets ? existingBuckets.map(b => b.name) : [];
      console.log("Existing buckets:", existingBucketNames);
      setBuckets(existingBucketNames);
      
      // Only attempt bucket creation if we found no buckets and we have an authenticated session
      if (existingBucketNames.length === 0) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("No buckets found. Attempting to initialize required buckets...");
          
          // Define required buckets
          const requiredBuckets = [
            { name: "product-categories", isPublic: true },
            { name: "product-gallery", isPublic: true },
            { name: "homepage", isPublic: true }
          ];
          
          // Attempt to create any missing buckets
          for (const bucket of requiredBuckets) {
            if (!existingBucketNames.includes(bucket.name)) {
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
          }
          
          // Refresh bucket list after attempt
          const { data: refreshedBuckets } = await supabase.storage.listBuckets();
          if (refreshedBuckets) {
            const refreshedNames = refreshedBuckets.map(b => b.name);
            setBuckets(refreshedNames);
            console.log("Updated bucket list:", refreshedNames);
            
            if (refreshedNames.length > 0) {
              toast.success("Storage buckets initialized successfully");
            }
          }
        } else {
          console.log("No session found. Skipping bucket creation attempt.");
        }
      }
      
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
