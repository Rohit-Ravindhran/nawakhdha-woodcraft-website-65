
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCategoryData } from '@/hooks/content/types';

interface CategorySelectorProps {
  categories: ProductCategoryData[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export default function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Product Category *</Label>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category to upload images to" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id!}>
              {category.category_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
