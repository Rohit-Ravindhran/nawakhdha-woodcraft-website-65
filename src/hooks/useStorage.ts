
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useStorage() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, bucket: string, folder: string = ""): Promise<string | null> => {
    try {
      setUploading(true);
      
      if (!file) {
        throw new Error("You must select an image to upload.");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

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

  return {
    uploadImage,
    deleteImage,
    uploading
  };
}
