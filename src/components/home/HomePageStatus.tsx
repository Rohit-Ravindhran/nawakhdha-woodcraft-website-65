
import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomePageStatusProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  pageExists?: boolean;
  children: React.ReactNode; // Make children required
}

/**
 * Component for displaying loading/error states or children content
 */
const HomePageStatus: React.FC<HomePageStatusProps> = ({ 
  isLoading, 
  error, 
  onRetry, 
  pageExists, 
  children 
}) => {
  // If no loading or error, render children
  if (!isLoading && !error) {
    return <>{children}</>;
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="loading-overlay">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p className="text-center font-medium">Loading content...</p>
            <p className="text-center text-muted-foreground text-sm mt-2">
              Fetching the latest data from our servers
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="error-overlay">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-center text-red-600 mb-4" data-testid="error-message">{String(error)}</p>
              <Button 
                onClick={onRetry}
                className="w-full flex items-center justify-center"
                variant="default"
                data-testid="retry-button"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* When loading/error, render a hidden version of children to maintain DOM structure */}
      {(isLoading || error) && <div className="hidden">{children}</div>}
    </>
  );
};

export default HomePageStatus;
