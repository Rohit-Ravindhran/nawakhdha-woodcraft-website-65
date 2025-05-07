
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateProduct } from "@/hooks/content";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { ProductCategoryData, ProductData } from "@/hooks/content/types";
import { ProductEditorProps } from "./ProductEditorTypes";
import { productSchema, ProductFormValues } from "./schemas/productSchema";
import ProductGalleryManager from "./ProductGalleryManager";
import ProductFormFields from "./ProductFormFields";
import SeoFields from "@/components/admin/SeoFields";
import { toast } from "sonner";

export default function ProductEditor({ product, onComplete, onSave, isLoading = false }: ProductEditorProps) {
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string; alt?: string }[]>([]);
  const updateProduct = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: product?.product_name || "",
      category_name: product?.category_name || "",
      category_slug: product?.category_slug || "",
      description: product?.description || "",
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
            if (typeof img === 'object' && img !== null && 'url' in img) {
              return {
                url: String(img.url),
                caption: 'caption' in img ? String(img.caption) : '',
                alt: 'alt' in img ? String(img.alt) : undefined
              };
            }
            return { url: '', caption: '' }; // Fallback for invalid items
          }).filter(img => img.url !== '') // Filter out invalid items
        : [];
      
      setGalleryImages(parsedImages);
    }
  }, [product]);

  const validateGalleryImages = () => {
    // Check if there are any gallery images
    if (galleryImages.length === 0) {
      toast.error("Please upload at least one product image");
      return false;
    }
    
    // Check if all gallery images have valid URLs
    const invalidImages = galleryImages.filter(img => !img.url || img.url.trim() === '');
    if (invalidImages.length > 0) {
      toast.error("All product images must have valid URLs");
      return false;
    }
    
    return true;
  };

  const onSubmit = (values: ProductFormValues) => {
    // Validate gallery images before submission
    if (!validateGalleryImages()) {
      return;
    }
    
    // Process SEO keywords: convert comma-separated string to array
    const seoKeywords = values.seo_keywords ? 
      values.seo_keywords.split(',').map(keyword => keyword.trim()).filter(Boolean) : 
      [];

    // Auto-generate SEO fields if empty
    const seoTitle = values.seo_title || values.product_name;
    const seoDescription = values.seo_description || values.description.substring(0, 160);

    const updatedProduct: ProductData = {
      id: product?.id,
      product_name: values.product_name,
      description: values.description,
      category_name: values.category_name,
      category_slug: values.category_slug,
      seo_title: seoTitle,
      seo_description: seoDescription,
      seo_keywords: seoKeywords.join(','), // Store as comma-separated string for consistency
      gallery_images: galleryImages.filter(img => img.url && img.url.trim() !== ''), // Filter out any empty URLs
    };

    updateProduct.mutate(updatedProduct, {
      onSuccess: () => {
        if (onComplete) onComplete();
        if (onSave) onSave();
      },
      onError: (error) => {
        // Display detailed error message
        toast.error(`Failed to save product: ${error.message}`);
        console.error("Product update error:", error);
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
            {galleryImages.length === 0 && (
              <p className="text-sm text-amber-500">Please add at least one product image</p>
            )}
          </div>
          
          {/* SEO Settings Section */}
          <div className="border-t pt-6 mt-6">
            <h4 className="font-medium mb-4">SEO Settings</h4>
            <SeoFields control={form.control} />
            <p className="text-xs text-muted-foreground mt-2">
              For keywords, use comma-separated values (e.g., "kitchen, cabinet, modern")
            </p>
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
