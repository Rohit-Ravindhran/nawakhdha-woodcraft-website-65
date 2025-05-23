
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import SeoFields from "@/components/admin/SeoFields";
import ProductGalleryManager from "@/components/admin/ProductGalleryManager";
import { GalleryImage } from "@/components/admin/schemas/productSchema";

// Define image interface to align with ProductGalleryManager
interface Image {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

// Define the form schema for category editing
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema> & {
  gallery_images?: Image[];
};

interface CategoryEditorProps {
  categoryName?: string;
  onSave?: () => void;
}

export default function CategoryEditor({ categoryName, onSave }: CategoryEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: categoryName || "",
      description: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      gallery_images: [],
    },
  });

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add gallery images to the values
      const categoryData = {
        ...values,
        gallery_images: galleryImages,
      };
      
      // Here you would use a hook like useUpdateCategory (which you'd need to create)
      console.log("Category data to submit:", categoryData);
      
      toast.success(`Category ${categoryName ? "updated" : "created"} successfully`);
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Kitchen Cabinets" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe this category of products..." 
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Category Images</h3>
          <ProductGalleryManager
            images={galleryImages}
            onChange={setGalleryImages}
            bucket="categories"
            folder={categoryName ? `category-${categoryName}` : "new-category"}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">SEO Settings</h3>
          <SeoFields control={form.control} />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            categoryName ? "Update Category" : "Create Category"
          )}
        </Button>
      </form>
    </Form>
  );
}
