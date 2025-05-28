
import { Upload } from 'lucide-react';

interface EmptyStateProps {
  selectedCategory: boolean;
}

export default function EmptyState({ selectedCategory }: EmptyStateProps) {
  if (!selectedCategory) return null;

  return (
    <div className="text-center py-8 text-gray-500">
      <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Click "Select Multiple Images" to start bulk uploading</p>
      <p className="text-sm mt-1">You can select multiple images at once and set their metadata before uploading</p>
    </div>
  );
}
