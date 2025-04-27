
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProduct, useUpdateProduct } from "@/hooks/useContent";
import { useStorage } from "@/hooks/useStorage";
import ImageUploader from "./ImageUploader";
import { X, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  description: z.string(),
  category_name: z.string(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductEditorProps {
  productId?: number;
  onSave?: () => void;
}

export default function ProductEditor({ productId, onSave }: ProductEditorProps) {
  const { data: product, isLoading } = useProduct(productId);
  const updateProduct = useUpdateProduct();
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string }[]>([]);
  const { deleteImage } = useStorage();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      description: "",
      category_name: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        product_name: product.product_name,
        description: product.description,
        category_name: product.category_name,
      });
      
      setGalleryImages(product.gallery_images || []);
    }
  }, [product, form]);

  const onSubmit = (values: ProductFormValues) => {
    updateProduct.mutate({
      id: productId,
      ...values,
      gallery_images: galleryImages,
    }, {
      onSuccess: () => {
        if (onSave) onSave();
      }
    });
  };

  const handleImageUploaded = (url: string) => {
    setGalleryImages([...galleryImages, { url, caption: "" }]);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updatedImages = [...galleryImages];
    updatedImages[index].caption = caption;
    setGalleryImages(updatedImages);
  };

  const handleRemoveImage = async (index: number) => {
    // Delete from storage
    const image = galleryImages[index];
    await deleteImage(image.url, 'products');
    
    // Remove from state
    const updatedImages = [...galleryImages];
    updatedImages.splice(index, 1);
    setGalleryImages(updatedImages);
  };

  if (isLoading && productId) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">
        {productId ? `Edit ${product?.product_name}` : "Add New Product"}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4 border-t">
            <h4 className="text-lg font-medium mb-3">Gallery Images</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <div className="relative mb-2">
                    <img 
                      src={image.url} 
                      alt={`Product image ${index + 1}`} 
                      className="w-full h-40 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Image caption"
                    value={image.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
            
            <ImageUploader 
              onImageUploaded={handleImageUploaded}
              bucket="products"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={updateProduct.isPending}
            className="mt-4"
          >
            {updateProduct.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
