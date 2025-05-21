
import { ReactNode } from "react";
import { useStorageBuckets } from "@/hooks/useStorageBuckets";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, CheckCircle } from "lucide-react";

const AdminPage = ({ children }: { children: ReactNode }) => {
  const { isInitialized, error, buckets, isLoading } = useStorageBuckets();

  // Show loading state while initializing buckets
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Checking storage buckets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error initializing storage: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {isInitialized && buckets.length > 0 && (
        <Alert className="max-w-xl mx-auto mb-6 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Storage buckets initialized successfully: {buckets.join(', ')}
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
};

export default AdminPage;
