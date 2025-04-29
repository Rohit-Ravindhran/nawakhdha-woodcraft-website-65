
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateProduct, ProductData } from "@/hooks/content";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";
import { z } from "zod";
import SeoFields from "@/components/admin/SeoFields";

const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category_name: z.string().min(1, "Category is required"),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema> & {
  gallery_images?: { url: string; caption: string; alt?: string }[];
};

interface ProductEditorProps {
  product: ProductData | null;
  isLoading: boolean;
}

export default function ProductEditor({ product, isLoading }: ProductEditorProps) {
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string; alt?: string }[]>([]);
  const updateProduct = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: product?.product_name || "",
      description: product?.description || "",
      category_name: product?.category_name || "",
      seo_title: product?.seo_title || "",
      seo_description: product?.seo_description || "",
      seo_keywords: product?.seo_keywords || "",
    },
  });

  // Initialize gallery images
  useEffect(() => {
    if (product?.gallery_images) {
      // Ensure we're working with an array of objects with the right shape
      const parsedImages = Array.isArray(product.gallery_images) 
        ? product.gallery_images.map(img => {
            // Ensure each item has the required properties
            if (typeof img === 'object' && img !== null && 'url' in img && 'caption' in img) {
              return {
                url: String(img.url),
                caption: String(img.caption),
                alt: 'alt' in img ? String(img.alt) : undefined
              };
            }
            return { url: '', caption: '' }; // Fallback for invalid items
          }).filter(img => img.url !== '') // Filter out invalid items
        : [];
      
      setGalleryImages(parsedImages);
    }
  }, [product]);

  const handleImageUploaded = (url: string, alt: string, index?: number) => {
    if (index !== undefined && index >= 0 && index < galleryImages.length) {
      // Update existing image
      setGalleryImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], url, alt };
        return updated;
      });
    } else {
      // Add new image
      setGalleryImages(prev => [...prev, { url, caption: "", alt }]);
    }
  };

  const handleCaptionChange = (caption: string, index: number) => {
    setGalleryImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], caption };
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (values: ProductFormValues) => {
    const updatedProduct: ProductData = {
      id: product?.id,
      product_name: values.product_name,
      description: values.description,
      category_name: values.category_name,
      seo_title: values.seo_title,
      seo_description: values.seo_description,
      seo_keywords: values.seo_keywords,
      gallery_images: galleryImages,
    };

    updateProduct.mutate(updatedProduct);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{product?.id ? "Edit Product" : "Add New Product"}</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <h4 className="font-medium">Gallery Images</h4>
            
            {galleryImages.map((image, index) => (
              <div key={index} className="flex flex-col gap-2 p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Image {index + 1}</h5>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </Button>
                </div>
                
                <EnhancedImageUploader
                  onImageUploaded={(url, alt) => handleImageUploaded(url, alt, index)}
                  bucket="products"
                  folder={`product-${product?.id || 'new'}`}
                  initialImageUrl={image.url}
                  initialAltText={image.alt}
                />
                
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input 
                      value={image.caption} 
                      onChange={(e) => handleCaptionChange(e.target.value, index)} 
                    />
                  </FormControl>
                </FormItem>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => handleImageUploaded("", "", galleryImages.length)}
            >
              Add Image
            </Button>
          </div>
          
          <div className="border-t pt-6 mt-6">
            <h4 className="font-medium mb-4">SEO Settings</h4>
            <SeoFields control={form.control} />
          </div>
          
          <Button 
            type="submit" 
            disabled={updateProduct.isPending}
            className="mt-6"
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
