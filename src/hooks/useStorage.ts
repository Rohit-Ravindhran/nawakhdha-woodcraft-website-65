
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to compress an image (using canvas)
const compressImage = async (
  file: File, 
  maxWidthOrHeight: number = 1920,
  quality: number = 0.8
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
        
        // Get the output format, prefer WebP if available
        let outputFormat = 'image/jpeg';
        if (file.type === 'image/png') {
          outputFormat = 'image/png';
        } else if (file.type === 'image/webp' || !file.type.includes('image/')) {
          outputFormat = 'image/webp';
        }
        
        // Convert to blob
        canvas.toBlob(
          (blob) => resolve(blob),
          outputFormat,
          quality
        );
      };
    };
  });
};

export function useStorage() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (
    file: File, 
    bucket: string, 
    folder: string = "",
    optimize: boolean = true
  ): Promise<string | null> => {
    try {
      setUploading(true);
      
      if (!file) {
        throw new Error("You must select an image to upload.");
      }

      // Process the file - compress if optimize is true
      let fileToUpload: File | Blob = file;
      
      if (optimize && file.type.includes('image/')) {
        const compressedBlob = await compressImage(file);
        if (compressedBlob) {
          fileToUpload = compressedBlob;
        }
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          contentType: file.type || 'image/jpeg'
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
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
      // Extract the file path from the URL
      const urlParts = url.split(`${bucket}/`);
      if (urlParts.length < 2) {
        throw new Error("Invalid file URL");
      }
      
      const filePath = urlParts[1];
      
      const { error } = await supabase.storage
        .from(bucket)
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
      // Extract the file path from the URL
      const urlParts = url.split(`${bucket}/`);
      if (urlParts.length < 2) {
        throw new Error("Invalid file URL");
      }
      
      const filePath = urlParts[1];
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .getMetadata(filePath);
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error(`Error getting image metadata: ${error.message}`);
      return null;
    }
  };

  return {
    uploadImage,
    deleteImage,
    getImageMetadata,
    uploading
  };
}
