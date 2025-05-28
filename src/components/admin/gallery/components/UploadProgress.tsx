
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  isUploading: boolean;
  current: number;
  total: number;
}

export default function UploadProgress({ isUploading, current, total }: UploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Uploading images...</span>
        <span>{current}/{total}</span>
      </div>
      <Progress 
        value={(current / total) * 100} 
        className="w-full"
      />
    </div>
  );
}
