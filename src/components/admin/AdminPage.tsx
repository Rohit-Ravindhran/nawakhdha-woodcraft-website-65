
import { ReactNode, useEffect } from "react";
import { useStorageBuckets } from "@/hooks/useStorageBuckets";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminPage = ({ children }: { children: ReactNode }) => {
  const { isInitialized, error, buckets, isLoading, refreshBuckets, isRefreshing } = useStorageBuckets();
  
  // Auto-refresh buckets once if initialization is complete but no buckets are found
  useEffect(() => {
    if (isInitialized && buckets.length === 0 && !isRefreshing) {
      console.log("No buckets found after initialization, attempting refresh");
      // Adding a small delay to prevent immediate refresh which could cause a loop
      const timer = setTimeout(() => {
        refreshBuckets();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, buckets.length, refreshBuckets, isRefreshing]);

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
        <AlertDescription className="flex flex-col gap-2">
          <div>Error initializing storage: {error.message}</div>
          <Button 
            onClick={() => refreshBuckets()}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 w-fit"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Retrying...' : 'Retry'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const missingRequiredBuckets = !buckets.includes('product-categories') || 
                                !buckets.includes('product-gallery') || 
                                !buckets.includes('homepage');

  return (
    <>
      {isInitialized && missingRequiredBuckets && (
        <Alert variant="destructive" className="max-w-xl mx-auto mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <div>
              Some required storage buckets are missing. This may affect image uploads.
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => refreshBuckets()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh buckets'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {isInitialized && buckets.length > 0 && !missingRequiredBuckets && (
        <Alert className="max-w-xl mx-auto mb-6 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            All required storage buckets are available
          </AlertDescription>
        </Alert>
      )}
      
      {children}
    </>
  );
};

export default AdminPage;
