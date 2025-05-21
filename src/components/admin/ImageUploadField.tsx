
import { useState, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { FormLabel, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  altTextName?: string;
  bucket: string;
  folder: string;
}

export default function ImageUploadField({
  control,
  name,
  label = "Image",
  altTextName = "alt_text",
  bucket,
  folder,
}: ImageUploadFieldProps) {
  const { field: imageField } = useController({ control, name });
  const { field: altTextField } = useController({ 
    control, 
    name: altTextName,
    defaultValue: ""
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState<string>("");
  const { uploadImage, uploading } = useStorage();
  const { session } = useAuth();

  // Initialize alt text state from form value
  useEffect(() => {
    setAltText(altTextField.value || "");
  }, [altTextField.value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(e.target.value);
    altTextField.onChange(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (!session) {
      toast.error("You must be logged in to upload images");
      return;
    }
    
    try {
      const url = await uploadImage(file, bucket, folder);
      if (url) {
        imageField.onChange(url);
        setFile(null);
        toast.success("Image uploaded successfully");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(`Upload failed: ${error.message || "Unknown error"}`);
      
      // Provide specific instructions for RLS errors
      if (error.message?.includes("row-level security policy")) {
        toast.error("Permission denied. You may not have access to upload images.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          {imageField.value ? (
            <div className="space-y-2">
              <div className="aspect-video relative bg-slate-200 rounded-md overflow-hidden">
                <img 
                  src={imageField.value} 
                  alt={altText || "Uploaded image"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => imageField.onChange("")}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>

      {file && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground truncate">
            Selected: {file.name}
          </p>
          <Button 
            type="button" 
            onClick={handleUpload} 
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
      )}

      <FormItem>
        <FormLabel>Alt Text</FormLabel>
        <FormControl>
          <Input
            value={altText}
            onChange={handleAltTextChange}
            placeholder="Describe the image for accessibility"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
