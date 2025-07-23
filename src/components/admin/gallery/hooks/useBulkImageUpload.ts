
import { useState, useRef, useEffect } from 'react';
import { useStorage } from '@/hooks/storage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ProductCategoryData } from '@/hooks/content/types';

export interface ImageUploadItem {
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

export function useBulkImageUpload(categories: ProductCategoryData[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [imageItems, setImageItems] = useState<ImageUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [nextPosition, setNextPosition] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useStorage();
  const queryClient = useQueryClient();

  // Fetch the next available position when category changes
  useEffect(() => {
    const fetchNextPosition = async () => {
      if (!selectedCategory) {
        setNextPosition(1); // Start from position 1, not 0
        return;
      }

      try {
        const { data, error } = await supabase
          .from('product_gallery')
          .select('position')
          .eq('category_id', selectedCategory)
          .order('position', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching positions:', error);
          setNextPosition(1); // Start from position 1, not 0
          return;
        }

        const lastPosition = data && data.length > 0 ? data[0].position : 0;
        // Always start from position 1 or higher to avoid overriding cover images
        setNextPosition(Math.max(1, (lastPosition || 0) + 1));
      } catch (error) {
        console.error('Error fetching positions:', error);
        setNextPosition(1); // Start from position 1, not 0
      }
    };

    fetchNextPosition();
  }, [selectedCategory]);

  // Update positions of existing items when nextPosition changes
  useEffect(() => {
    setImageItems(prev => 
      prev.map((item, index) => ({
        ...item,
        position: nextPosition + index
      }))
    );
  }, [nextPosition]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: ImageUploadItem[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      altText: '',
      caption: '',
      position: nextPosition + imageItems.length + index,
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
      // Reorder positions starting from nextPosition
      return filtered.map((item, index) => ({ 
        ...item, 
        position: nextPosition + index 
      }));
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
      
      // Update nextPosition for future uploads
      setNextPosition(prev => prev + successCount);
    }
    
    if (errorCount > 0) {
      toast.error(`${errorCount} image${errorCount !== 1 ? 's' : ''} failed to upload`);
    }

    // Clear successful uploads from the list
    setImageItems(prev => prev.filter(item => !item.uploaded));
  };

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.category_name;

  return {
    selectedCategory,
    setSelectedCategory,
    selectedCategoryName,
    imageItems,
    setImageItems,
    isUploading,
    uploadProgress,
    fileInputRef,
    handleFileSelect,
    updateImageItem,
    removeImageItem,
    uploadAllImages,
  };
}
