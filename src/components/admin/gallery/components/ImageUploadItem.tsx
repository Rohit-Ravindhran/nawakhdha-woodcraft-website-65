
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { ImageUploadItem as ImageItem } from '../hooks/useBulkImageUpload';

interface ImageUploadItemProps {
  item: ImageItem;
  onUpdate: (id: string, updates: Partial<ImageItem>) => void;
  onRemove: (id: string) => void;
}

export default function ImageUploadItem({ item, onUpdate, onRemove }: ImageUploadItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Image Preview */}
        <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
          <img
            src={item.preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          
          {/* Status Overlay */}
          <div className="absolute top-2 right-2">
            {item.uploading && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </div>
            )}
            {item.uploaded && (
              <div className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Uploaded
              </div>
            )}
            {item.error && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Error
              </div>
            )}
          </div>

          {/* Remove Button */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 left-2 h-6 w-6"
            onClick={() => onRemove(item.id)}
            disabled={item.uploading}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* File Info */}
        <div className="text-xs text-gray-500 truncate">
          {item.file.name} ({Math.round(item.file.size / 1024)}KB)
        </div>

        {/* Metadata Fields */}
        <div className="space-y-2">
          <div>
            <Label htmlFor={`alt-${item.id}`} className="text-xs">
              Alt Text
            </Label>
            <Input
              id={`alt-${item.id}`}
              value={item.altText}
              onChange={(e) => onUpdate(item.id, { altText: e.target.value })}
              placeholder="Image description for SEO"
              className="text-sm"
              disabled={item.uploading || item.uploaded}
            />
          </div>

          <div>
            <Label htmlFor={`caption-${item.id}`} className="text-xs">
              Caption
            </Label>
            <Textarea
              id={`caption-${item.id}`}
              value={item.caption}
              onChange={(e) => onUpdate(item.id, { caption: e.target.value })}
              placeholder="Image caption"
              className="text-sm"
              rows={2}
              disabled={item.uploading || item.uploaded}
            />
          </div>

          <div>
            <Label htmlFor={`position-${item.id}`} className="text-xs">
              Display Position
            </Label>
            <Input
              id={`position-${item.id}`}
              type="number"
              min="0"
              value={item.position}
              onChange={(e) => onUpdate(item.id, { position: parseInt(e.target.value) || 0 })}
              className="text-sm"
              disabled={item.uploading || item.uploaded}
            />
          </div>
        </div>

        {/* Error Display */}
        {item.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {item.error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
