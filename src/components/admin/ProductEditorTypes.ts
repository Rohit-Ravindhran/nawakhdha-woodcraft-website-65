
import { ProductCategoryData } from "@/hooks/content/types";
import { GalleryImage } from "@/components/admin/schemas/productSchema";

export interface ProductEditorProps {
  product?: ProductCategoryData & { id?: string; gallery_images?: GalleryImage[] };
  onComplete?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}
