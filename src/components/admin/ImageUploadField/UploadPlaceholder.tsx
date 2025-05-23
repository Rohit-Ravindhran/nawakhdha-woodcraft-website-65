
import { Loader2, ImagePlus } from "lucide-react";

interface UploadPlaceholderProps {
  uploading: boolean;
  inputId: string;
  onFileChange: (file: File) => void;
}

const UploadPlaceholder = ({ uploading, inputId, onFileChange }: UploadPlaceholderProps) => {
  return (
    <label
      htmlFor={inputId}
      className="relative cursor-pointer flex items-center justify-center rounded-md border border-dashed p-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    >
      {uploading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <div className="flex flex-col items-center space-y-1">
          <ImagePlus className="h-8 w-8" />
          <p className="text-sm">Click to upload</p>
        </div>
      )}
      <input
        type="file"
        id={inputId}
        className="absolute opacity-0 w-0 h-0"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileChange(file);
          }
        }}
        disabled={uploading}
      />
    </label>
  );
};

export default UploadPlaceholder;
