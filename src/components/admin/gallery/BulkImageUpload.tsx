
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Upload, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useStorage } from '@/hooks/storage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ProductCategoryData } from '@/hooks/content/types';

interface ImageUploadItem {
  id: string;
  file: File;
  preview: string;
  altText: string;
  caption: string;
  position: number;
  uploading: boolean;
  uploaded: boolean;
  error: string | null;
  uploadedUrl?: string;
}

interface BulkImageUploadProps {
  categories: ProductCategoryData[];
}

export default function BulkImageUpload({ categories }: BulkImageUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [imageItems, setImageItems] = useState<ImageUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useStorage();
  const queryClient = useQueryClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: ImageUploadItem[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      altText: '',
      caption: '',
      position: imageItems.length + index,
      uploading: false,
      uploaded: false,
      error: null
    }));

    setImageItems(prev => [...prev, ...newItems]);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateImageItem = (id: string, updates: Partial<ImageUploadItem>) => {
    setImageItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeImageItem = (id: string) => {
    setImageItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      // Reorder positions
      return filtered.map((item, index) => ({ ...item, position: index }));
    });
  };

  const uploadAllImages = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }

    if (imageItems.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: imageItems.length });

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < imageItems.length; i++) {
      const item = imageItems[i];
      
      try {
        // Update UI to show uploading
        updateImageItem(item.id, { uploading: true, error: null });
        setUploadProgress({ current: i + 1, total: imageItems.length });

        // Upload image to storage
        const uploadedUrl = await uploadImage(
          item.file,
          'product-gallery',
          'product_gallery',
          {
            optimize: true,
            imageType: 'productDetail',
            maxWidth: 1920,
            maxHeight: 1080,
            cacheBusting: true
          }
        );

        if (!uploadedUrl) {
          throw new Error('Failed to upload image to storage');
        }

        // Save to database
        const { error: dbError } = await supabase
          .from('product_gallery')
          .insert({
            category_id: selectedCategory,
            image_url: uploadedUrl,
            alt_text: item.altText || `Gallery image ${item.position + 1}`,
            caption: item.caption,
            position: item.position
          });

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }

        // Update UI to show success
        updateImageItem(item.id, {
          uploading: false,
          uploaded: true,
          uploadedUrl,
          error: null
        });

        successCount++;

      } catch (error: any) {
        console.error(`Error uploading image ${item.file.name}:`, error);
        
        updateImageItem(item.id, {
          uploading: false,
          uploaded: false,
          error: error.message || 'Upload failed'
        });

        errorCount++;
      }
    }

    setIsUploading(false);
    
    // Show summary toast
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image${successCount !== 1 ? 's' : ''}`);
      
      // Refresh gallery data
      queryClient.invalidateQueries({ queryKey: ['product_gallery'] });
    }
    
    if (errorCount > 0) {
      toast.error(`${errorCount} image${errorCount !== 1 ? 's' : ''} failed to upload`);
    }

    // Clear successful uploads from the list
    setImageItems(prev => prev.filter(item => !item.uploaded));
  };

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.category_name;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Bulk Image Upload</h3>
        
        {/* Category Selection */}
        <div className="space-y-2">
          <Label>Product Category *</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category to upload images to" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id!}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Selection */}
        {selectedCategory && (
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
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading images...</span>
              <span>{uploadProgress.current}/{uploadProgress.total}</span>
            </div>
            <Progress 
              value={(uploadProgress.current / uploadProgress.total) * 100} 
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Image Grid */}
      {imageItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              Images to upload ({imageItems.length}) - Category: {selectedCategoryName}
            </h4>
            <Button
              onClick={uploadAllImages}
              disabled={isUploading || !selectedCategory}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload All Images
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
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
                      onClick={() => removeImageItem(item.id)}
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
                        onChange={(e) => updateImageItem(item.id, { altText: e.target.value })}
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
                        onChange={(e) => updateImageItem(item.id, { caption: e.target.value })}
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
                        onChange={(e) => updateImageItem(item.id, { position: parseInt(e.target.value) || 0 })}
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
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      {selectedCategory && imageItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Click "Select Multiple Images" to start bulk uploading</p>
          <p className="text-sm mt-1">You can select multiple images at once and set their metadata before uploading</p>
        </div>
      )}
    </div>
  );
}
