
import { ExternalLink } from "lucide-react";

interface BucketErrorProps {
  bucketError: string | null;
}

const BucketError = ({ bucketError }: BucketErrorProps) => {
  if (!bucketError) return null;
  
  return (
    <div className="text-sm text-destructive p-2 border border-destructive/20 rounded-md bg-destructive/10">
      <p className="mb-2">{bucketError}</p>
      <a
        href="https://supabase.com/dashboard/project/enqplizqtwvquxliiygz/storage/buckets"
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center text-xs"
      >
        Go to Supabase Storage Dashboard
        <ExternalLink className="h-3 w-3 ml-1" />
      </a>
    </div>
  );
};

export default BucketError;
