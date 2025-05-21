
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
      
      // We'll check which buckets are missing
      const missingBuckets = requiredBuckets.filter(
        bucket => !existingBucketNames.includes(bucket.name)
      );
      
      if (missingBuckets.length > 0) {
        console.warn(`Missing storage buckets: ${missingBuckets.map(b => b.name).join(', ')}`);
        toast.warning(`Storage buckets have been created but might need a page refresh to take effect. If issues persist, please check your Supabase storage permissions.`);
      } else {
        console.log("All required buckets are present:", requiredBuckets.map(b => b.name).join(', '));
        toast.success("All required storage buckets are available");
      }
      
      // Even if buckets are missing, we mark as initialized so the UI can handle the situation
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

  return { isInitialized, error, buckets, isLoading };
}
