
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ImageUploadField from "../../ImageUploadField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GalleryImageFormValues } from "./useProductGallery";
import { UseFormReturn } from "react-hook-form";
import { ProductCategoryData, GalleryImageData } from "@/hooks/content/types";

interface GalleryImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage: GalleryImageData | null;
  errorMessage: string | null;
  form: UseFormReturn<GalleryImageFormValues>;
  onSubmit: (values: GalleryImageFormValues) => void;
  productCategories: Pick<ProductCategoryData, 'id' | 'category_name'>[] | undefined;
}

export default function GalleryImageDialog({
  isOpen,
  onOpenChange,
  currentImage,
  errorMessage,
  form,
  onSubmit,
  productCategories,
}: GalleryImageDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {currentImage ? "Edit Gallery Image" : "Add Gallery Image"}
          </DialogTitle>
        </DialogHeader>
        
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productCategories?.map(category => (
                        <SelectItem key={category.id} value={category.id!}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <ImageUploadField
              control={form.control}
              name="image_url"
              label="Gallery Image"
              altTextName="alt_text"
              bucket="product-gallery"
              folder="product_gallery"
            />
            
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input placeholder="Image caption" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Position</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Image
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
