
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ProductCategoryData } from '@/hooks/content/types';
import { useBulkImageUpload } from './hooks/useBulkImageUpload';
import CategorySelector from './components/CategorySelector';
import FileSelector from './components/FileSelector';
import UploadProgress from './components/UploadProgress';
import ImageUploadItem from './components/ImageUploadItem';
import EmptyState from './components/EmptyState';

interface BulkImageUploadProps {
  categories: ProductCategoryData[];
}

export default function BulkImageUpload({ categories }: BulkImageUploadProps) {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedCategoryName,
    imageItems,
    isUploading,
    uploadProgress,
    fileInputRef,
    handleFileSelect,
    updateImageItem,
    removeImageItem,
    uploadAllImages,
  } = useBulkImageUpload(categories);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Bulk Image Upload</h3>
        
        {/* Category Selection */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* File Selection */}
        <FileSelector
          selectedCategory={selectedCategory}
          isUploading={isUploading}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
        />

        {/* Upload Progress */}
        <UploadProgress
          isUploading={isUploading}
          current={uploadProgress.current}
          total={uploadProgress.total}
        />
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
              <ImageUploadItem
                key={item.id}
                item={item}
                onUpdate={updateImageItem}
                onRemove={removeImageItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <EmptyState selectedCategory={!!selectedCategory && imageItems.length === 0} />
    </div>
  );
}
