
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useProductCategory, useUpdateProductCategory, useDeleteProductCategory } from "@/hooks/content";
import { ProductData } from "@/hooks/content/types";
import { productSchema, ProductFormValues } from "./schemas/productSchema";
import ProductFormFields from "./ProductFormFields";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProductEditorProps {
  productId?: string;
  onProductUpdated?: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ productId, onProductUpdated }) => {
  const { data: product, isLoading } = useProductCategory(productId);
  const updateProduct = useUpdateProductCategory();
  const deleteProduct = useDeleteProductCategory();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_name: "",
      category_slug: "",
      category_image_url: "",
      alt_text: "",
      product_name: "",
      description: "",
      gallery_images: [],
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [product, form]);

  const onSubmit = (values: ProductFormValues) => {
    const productData: ProductData = {
      ...values,
      id: product?.id,
      gallery_images: values.gallery_images?.map(img => ({
        url: img.url || '',
        caption: img.caption || '',
        alt: img.alt || ''
      }))
    };

    updateProduct.mutate(productData, {
      onSuccess: () => {
        form.reset(productData);
        toast.success(`Product "${values.category_name}" updated successfully`);
        onProductUpdated?.();
      },
      onError: (error: Error) => {
        toast.error(`Error updating product: ${error.message}`);
      },
    });
  };

  const handleDelete = () => {
    if (product?.id) {
      deleteProduct.mutate(product.id, {
        onSuccess: () => {
          toast.success(`Product "${product.category_name}" deleted successfully`);
          onProductUpdated?.();
        },
        onError: (error: Error) => {
          toast.error(`Error deleting product: ${error.message}`);
        },
        onSettled: () => setDeleteOpen(false),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProductFormFields form={form} />

          <div className="flex justify-between items-center">
            <Button
              type="submit"
              disabled={updateProduct.isPending}
            >
              {updateProduct.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Product
                </>
              )}
            </Button>

            {productId && (
              <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the product from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleteProduct.isPending}>
                      {deleteProduct.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductEditor;
