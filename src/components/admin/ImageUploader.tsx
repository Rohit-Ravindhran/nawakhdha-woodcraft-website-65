
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStorage } from "@/hooks/storage";
import { Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  bucket: string;
  folder?: string;
  accept?: string;
  className?: string;
}

export default function ImageUploader({
  onImageUploaded,
  bucket,
  folder = "",
  accept = "image/*",
  className = "",
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const { uploadImage, uploading } = useStorage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const url = await uploadImage(file, bucket, folder);
    if (url) {
      onImageUploaded(url);
      setFile(null);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="image" className="block text-sm font-medium mb-1">
          Select Image
        </Label>
        <Input
          id="image"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      {file && (
        <div className="mt-2 flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground truncate">
            Selected: {file.name}
          </p>
          <Button onClick={handleUpload} disabled={uploading} type="button">
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
    </div>
  );
}
