import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SIZE_LIMITS } from "@/utils/imageOptimization";

// Function to compress an image (using canvas)
const compressImage = async (
  file: File, 
  maxWidthOrHeight: number = 1920,
  quality: number = 0.8,
  targetSize?: number
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    // Create file reader to read the file as data URL
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      // Create an image element
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Get original dimensions
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions to maintain aspect ratio
        if (width > height && width > maxWidthOrHeight) {
          height = Math.floor(height * (maxWidthOrHeight / width));
          width = maxWidthOrHeight;
        } else if (height > maxWidthOrHeight) {
          width = Math.floor(width * (maxWidthOrHeight / height));
          height = maxWidthOrHeight;
        }
        
        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determine optimal output format
        let outputFormat = 'image/webp';
        let outputQuality = quality;
        
        // Use JPEG for photos and PNG for graphics with transparency
        if (file.type === 'image/png' && hasTransparency(ctx, width, height)) {
          outputFormat = 'image/png';
        } else if (!navigator.userAgent.includes('Safari') || navigator.userAgent.includes('Chrome')) {
          // Use AVIF for browsers that support it (not Safari)
          outputFormat = 'image/avif';
          outputQuality = quality - 0.05; // AVIF can achieve same quality at lower settings
        }

        // For WebP, try to compress further if we have a target size
        if (targetSize && outputFormat === 'image/webp') {
          // Start with the provided quality and adjust if needed
          let currentQuality = outputQuality;
          let attempts = 0;
          const maxAttempts = 3;
          
          const tryCompress = (q: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(null);
                  return;
                }
                
                // If the blob size is still too large and we haven't reached max attempts,
                // try again with lower quality
                if (blob.size > targetSize * 1024 && attempts < maxAttempts) {
                  attempts++;
                  currentQuality = Math.max(0.6, currentQuality - 0.1); // Don't go below 0.6
                  tryCompress(currentQuality);
                } else {
                  resolve(blob);
                }
              },
              outputFormat,
              q
            );
          };
          
          // Start compression attempts
          tryCompress(currentQuality);
        } else {
          // Standard compression
          canvas.toBlob(
            (blob) => resolve(blob),
            outputFormat,
            outputQuality
          );
        }
      };
    };
  });
};

// Helper to detect transparency in an image
function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const imageData = ctx.getImageData(0, 0, width, height).data;
  for (let i = 3; i < imageData.length; i += 4) {
    if (imageData[i] < 255) {
      return true;
    }
  }
  return false;
}

export function useStorage() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (
    file: File, 
    bucket: string, 
    folder: string = "",
    options: {
      optimize?: boolean;
      imageType?: keyof typeof SIZE_LIMITS;
      maxWidth?: number;
      maxHeight?: number;
    } = {}
  ): Promise<string | null> => {
    try {
      setUploading(true);
      
      if (!file) {
        throw new Error("You must select an image to upload.");
      }

      const {
        optimize = true,
        imageType = 'product',
        maxWidth = 1920,
        maxHeight = 1080
      } = options;

      // Process the file - compress if optimize is true
      let fileToUpload: File | Blob = file;
      
      if (optimize && file.type.includes('image/')) {
        // Get target size in KB based on image type
        const targetSize = SIZE_LIMITS[imageType];
        
        console.log(`Optimizing ${imageType} image to target size: ${targetSize}KB`);
        
        const compressedBlob = await compressImage(
          file,
          Math.min(maxWidth, maxHeight),
          imageType === 'icon' ? 0.9 : 0.8,
          targetSize
        );
        
        if (compressedBlob) {
          const originalSizeKB = Math.round(file.size / 1024);
          const newSizeKB = Math.round(compressedBlob.size / 1024);
          
          console.log(`Compression results - Original: ${originalSizeKB}KB, New: ${newSizeKB}KB, Reduction: ${Math.round((1 - newSizeKB / originalSizeKB) * 100)}%`);
          
          fileToUpload = compressedBlob;
        }
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      // Use WebP extension for optimized images unless it's PNG with transparency
      const finalExt = optimize && !file.type.includes('png') ? 'webp' : fileExt;
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${finalExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Convert bucket name from underscore to hyphen format
      const formattedBucket = bucket;

      const { error: uploadError } = await supabase.storage
        .from(formattedBucket)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          contentType: optimize ? `image/${finalExt}` : file.type || 'image/jpeg'
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(formattedBucket)
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string, bucket: string): Promise<boolean> => {
    try {
      // Convert bucket name from underscore to hyphen format
      const formattedBucket = bucket;
      
      // Extract the file path from the URL
      const urlParts = url.split(`${formattedBucket}/`);
      if (urlParts.length < 2) {
        throw new Error("Invalid file URL");
      }
      
      const filePath = urlParts[1];
      
      const { error } = await supabase.storage
        .from(formattedBucket)
        .remove([filePath]);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      toast.error(`Error deleting image: ${error.message}`);
      return false;
    }
  };

  const getImageMetadata = async (url: string, bucket: string): Promise<any | null> => {
    try {
      // Convert bucket name from underscore to hyphen format
      const formattedBucket = bucket;
      
      // Extract the file path from the URL
      const urlParts = url.split(`${formattedBucket}/`);
      if (urlParts.length < 2) {
        throw new Error("Invalid file URL");
      }
      
      const filePath = urlParts[1];
      
      // Updated to use list instead of getMetadata which doesn't exist in the API
      const { data, error } = await supabase.storage
        .from(formattedBucket)
        .list(filePath.substring(0, filePath.lastIndexOf('/')), {
          limit: 1,
          offset: 0,
          search: filePath.substring(filePath.lastIndexOf('/') + 1)
        });
        
      if (error) {
        throw error;
      }
      
      return data?.[0] || null;
    } catch (error: any) {
      console.error(`Error getting image metadata: ${error.message}`);
      return null;
    }
  };

  // Add cache purging for image URLs
  const purgeCDNCache = async (url: string): Promise<boolean> => {
    try {
      // This is a placeholder for actual CDN cache purging implementation
      // In a real implementation, this would call your CDN's API
      
      console.log(`Purging CDN cache for: ${url}`);
      
      // For now, just log the purge request
      return true;
    } catch (error: any) {
      console.error('Error purging CDN cache:', error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    getImageMetadata,
    purgeCDNCache,
    uploading
  };
}
