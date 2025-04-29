
import { ProductData } from "@/hooks/content/types";

export interface ProductEditorProps {
  product?: ProductData & { id?: number };
  onComplete?: () => void;
  onSave?: () => void;
  isLoading?: boolean; // Making isLoading optional
}
