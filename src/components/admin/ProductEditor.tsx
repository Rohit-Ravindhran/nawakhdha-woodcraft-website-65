
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateProduct } from "@/hooks/content";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductData } from "@/hooks/content/types";
import { ProductEditorProps } from "./ProductEditorTypes";
import { productSchema, ProductFormValues } from "./schemas/productSchema";
import ProductGalleryManager from "./ProductGalleryManager";
import ProductFormFields from "./ProductFormFields";
import SeoFields from "@/components/admin/SeoFields";

export default function ProductEditor({ product, onComplete, onSave, isLoading = false }: ProductEditorProps) {
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

    updateProduct.mutate(updatedProduct, {
      onSuccess: () => {
        if (onComplete) onComplete();
        if (onSave) onSave();
      }
    });
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
          {/* Main Product Fields */}
          <ProductFormFields control={form.control} />
          
          {/* Gallery Images Section */}
          <div className="space-y-4">
            <ProductGalleryManager 
              images={galleryImages}
              onChange={setGalleryImages}
              productId={product?.id}
            />
          </div>
          
          {/* SEO Settings Section */}
          <div className="border-t pt-6 mt-6">
            <h4 className="font-medium mb-4">SEO Settings</h4>
            <SeoFields control={form.control} />
          </div>
          
          {/* Submit Button */}
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
