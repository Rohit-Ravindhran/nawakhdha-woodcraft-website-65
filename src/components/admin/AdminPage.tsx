
// We need to improve the AdminPage with storage bucket initialization
// Add the following check at the beginning of the AdminPage component

import { useStorageBuckets } from "@/hooks/useStorageBuckets";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

// Add at the top of the AdminPage component:
const { isInitialized: bucketsInitialized, error: bucketsError, buckets } = useStorageBuckets();

// Then ensure it's passed to the actual page layout
// Add this somewhere before your content rendering:

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

// Then your existing AdminPage content here...
