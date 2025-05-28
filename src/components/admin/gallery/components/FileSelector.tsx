
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface FileSelectorProps {
  selectedCategory: string;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileSelector({ 
  selectedCategory, 
  isUploading, 
  fileInputRef, 
  onFileSelect 
}: FileSelectorProps) {
  if (!selectedCategory) return null;

  return (
    <div className="space-y-2">
      <Label>Select Images</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Select Multiple Images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
