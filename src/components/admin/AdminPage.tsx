
import { useState } from "react";
import { useStorageBuckets } from "@/hooks/useStorageBuckets";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  const { isInitialized: bucketsInitialized, error: bucketsError, buckets } = useStorageBuckets();

  // Check if buckets are initialized before rendering content
  if (!bucketsInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Initializing storage...</p>
        </div>
      </div>
    );
  }

  if (bucketsError) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error initializing storage: {bucketsError.message}
        </AlertDescription>
      </Alert>
    );
  }

  console.log("Available buckets:", buckets);
  
  return <>{children}</>;
};

export default AdminPage;
