
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Trash2 } from "lucide-react";

interface BlogImageUploadFieldProps {
  control: any;
  name: string;
  label: string;
  altTextName?: string;
}

export default function BlogImageUploadField({
  control,
  name,
  label,
  altTextName,
}: BlogImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center gap-4">
            {field.value ? (
              <div className="flex items-center gap-4">
                <img
                  src={field.value}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => field.onChange("")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Label htmlFor={`file-upload-${name}`} className="cursor-pointer">
                  <Button asChild variant="outline">
                    <div>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </div>
                  </Button>
                </Label>
                <Input
                  id={`file-upload-${name}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    try {
                      setUploading(true);
                      if (!e.target.files || e.target.files.length === 0) {
                        throw new Error("Please select an image to upload.");
                      }

                      const file = e.target.files[0];
                      const fileExt = file.name.split(".").pop();
                      const fileName = `${Math.random()}.${fileExt}`;
                      const filePath = `blog/${fileName}`;

                      console.log("Uploading to bucket 'blogs', path:", filePath);

                      const { data, error } = await supabase.storage
                        .from("blogs")
                        .upload(filePath, file);

                      if (error) {
                        console.error("Upload error details:", {
                          message: error.message
                        });
                        throw error;
                      }

                      const { data: { publicUrl } } = supabase.storage
                        .from("blogs")
                        .getPublicUrl(data.path);

                      field.onChange(publicUrl);
                      toast.success("Image uploaded successfully");
                    } catch (error: any) {
                      console.error("Upload failed:", error);
                      toast.error(`Upload failed: ${error.message}`);
                    } finally {
                      setUploading(false);
                    }
                  }}
                  disabled={uploading}
                />
                {uploading && <span className="text-sm">Uploading...</span>}
              </div>
            )}
          </div>
          {altTextName && (
            <FormField
              control={control}
              name={altTextName}
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Image description for accessibility" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
