
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BucketStatusCheckerProps {
  children: React.ReactNode;
}

export default function BucketStatusChecker({ children }: BucketStatusCheckerProps) {
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const [checkingBucket, setCheckingBucket] = useState(true);
  
  const checkBucket = async () => {
    try {
      setCheckingBucket(true);
      console.log('Checking if product-gallery bucket exists...');
      
      // First try to list files (requires less permissions)
      const { data: files, error: listError } = await supabase.storage
        .from('product-gallery')
        .list('', { limit: 1 });
        
      if (!listError) {
        console.log('Successfully listed files in product-gallery bucket');
        setBucketExists(true);
        setCheckingBucket(false);
        return;
      }
      
      console.log('List operation failed, trying getBucket');
      
      // If list fails, try getBucket (requires more permissions)
      const { data, error } = await supabase.storage.getBucket('product-gallery');
      
      if (error) {
        console.error('Error checking product-gallery bucket:', error);
        
        if (error.message.includes('row-level security policy')) {
          console.log('Permission error but bucket might still exist');
          // Try the upload test endpoint if available
          try {
            const testImage = new Blob(['test'], { type: 'text/plain' });
            const testFile = new File([testImage], 'permission-test.txt');
            
            const { data: uploadTest, error: uploadError } = await supabase.storage
              .from('product-gallery')
              .upload(`test-${Date.now()}.txt`, testFile);
              
            if (!uploadError) {
              console.log('Test upload worked, bucket exists');
              // Clean up test file
              await supabase.storage.from('product-gallery').remove([uploadTest.path]);
              setBucketExists(true);
            } else {
              console.log('Test upload failed:', uploadError);
              if (!uploadError.message.includes('not found')) {
                // If error is something other than "not found", bucket might exist
                setBucketExists(true);
              } else {
                setBucketExists(false);
              }
            }
          } catch (err) {
            console.error('Test upload error:', err);
            setBucketExists(false);
          }
        } else if (error.message.includes('Bucket not found')) {
          setBucketExists(false);
        } else {
          // For unknown errors, assume bucket might exist but inaccessible
          setBucketExists(null);
        }
      } else {
        console.log('product-gallery bucket exists:', data);
        setBucketExists(true);
      }
    } catch (err) {
      console.error('Unexpected error checking bucket:', err);
      setBucketExists(false);
    } finally {
      setCheckingBucket(false);
    }
  };

  useEffect(() => {
    checkBucket();
  }, []);
  
  if (checkingBucket) {
    return children;
  }
  
  if (bucketExists === false) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-4">
            <div>
              The "product-gallery" bucket could not be found. Please make sure it exists in your Supabase project and that your account has the necessary permissions.
            </div>
            <div className="text-sm">
              <a 
                href="https://supabase.com/dashboard/project/enqplizqtwvquxliiygz/storage/buckets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                Open Supabase Storage Dashboard to Create/Configure Bucket
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkBucket}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Check Bucket Availability
        </Button>
      </div>
    );
  }
  
  return <>{children}</>;
}
