
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
      
      // Get list of existing buckets
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        throw listError;
      }
      
      const existingBucketNames = existingBuckets ? existingBuckets.map(b => b.name) : [];
      setBuckets(existingBucketNames);
      
      console.log("Existing buckets:", existingBucketNames);
      
      // We'll check which buckets are missing
      const missingBuckets = requiredBuckets.filter(
        bucket => !existingBucketNames.includes(bucket.name)
      );
      
      if (missingBuckets.length > 0) {
        console.warn(`Missing storage buckets: ${missingBuckets.map(b => b.name).join(', ')}`);
        
        // Don't attempt to create buckets if we don't have permission
        // Just inform the user that they're missing
        toast.warning(`Some required storage buckets are missing. Please contact an administrator to create them: ${missingBuckets.map(b => b.name).join(', ')}`);
      }
      
      // Even if buckets are missing, we mark as initialized so the UI can handle the situation
      setIsInitialized(true);
    } catch (err: any) {
      console.error("Error initializing storage buckets:", err);
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
        console.log("Session found, initializing buckets");
        initializeBuckets();
      } else {
        console.log("No session found, skipping bucket initialization");
        // If not logged in, just mark as initialized to avoid errors
        setIsInitialized(true);
        setIsLoading(false);
      }
    });
  }, []);

  return { isInitialized, error, buckets, isLoading };
}
