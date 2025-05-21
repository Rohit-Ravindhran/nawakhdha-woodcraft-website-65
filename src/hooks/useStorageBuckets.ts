
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStorageBuckets() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [buckets, setBuckets] = useState<string[]>([]);
  
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
        console.error("Error listing buckets:", listError);
        throw listError;
      }
      
      const existingBucketNames = existingBuckets ? existingBuckets.map(b => b.name) : [];
      setBuckets(existingBucketNames);
      
      console.log("Existing buckets:", existingBucketNames);
      
      // Create any missing buckets
      for (const bucket of requiredBuckets) {
        if (!existingBucketNames.includes(bucket.name)) {
          console.log(`Creating missing bucket: ${bucket.name}`);
          
          const { error } = await supabase.storage.createBucket(
            bucket.name, 
            { public: bucket.isPublic }
          );
          
          if (error) {
            console.error(`Error creating bucket ${bucket.name}:`, error);
            toast.error(`Error creating storage bucket: ${error.message}`);
          } else {
            console.log(`Successfully created bucket: ${bucket.name}`);
            setBuckets(prev => [...prev, bucket.name]);
          }
        }
      }
      
      setIsInitialized(true);
    } catch (err: any) {
      console.error("Error initializing storage buckets:", err);
      setError(err);
      toast.error(`Storage initialization error: ${err.message}`);
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
      }
    });
  }, []);

  return { isInitialized, error, buckets };
}
