
import { ProductData } from "@/hooks/content/types";
import { GalleryImage } from "@/components/admin/schemas/productSchema";

export interface ProductEditorProps {
  product?: ProductData & { id?: number; gallery_images?: GalleryImage[] };
  onComplete?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}
