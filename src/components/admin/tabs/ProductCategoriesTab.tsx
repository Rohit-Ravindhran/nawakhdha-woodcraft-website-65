import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCategoryData } from "@/hooks/content/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Plus, Save, Trash2, Loader2, AlertCircle, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUploadField from "../ImageUploadField";
import SeoFields from "../SeoFields";
import { useAuth } from "@/contexts/AuthContext";
import { useStorageBuckets } from "@/hooks/useStorageBuckets";

const productCategorySchema = z.object({
  id: z.string().optional(),
  category_name: z.string().min(1, "Category name is required"),
  category_slug: z.string().optional(),
  product_name: z.string().optional(),
  category_image_url: z.string().optional(),
  alt_text: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type ProductCategoryFormValues = z.infer<typeof productCategorySchema>;

export default function ProductCategoriesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ProductCategoryData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { buckets, isInitialized: bucketsInitialized } = useStorageBuckets();
  
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['product_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('category_name');
        
      if (error) throw error;
      return data as ProductCategoryData[];
    },
  });
  
  const form = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      category_name: "",
      category_slug: "",
      product_name: "",
      category_image_url: "",
      alt_text: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    },
  });
  
  // Reset form when current category changes
  useEffect(() => {
    if (currentCategory) {
      form.reset({
        id: currentCategory.id,
        category_name: currentCategory.category_name || "",
        category_slug: currentCategory.category_slug || "",
        product_name: currentCategory.product_name || "",
        category_image_url: currentCategory.category_image_url || "",
        alt_text: currentCategory.alt_text || "",
        seo_title: currentCategory.seo_title || "",
        seo_description: currentCategory.seo_description || "",
        seo_keywords: currentCategory.seo_keywords || "",
      });
    } else {
      form.reset({
        category_name: "",
        category_slug: "",
        product_name: "",
        category_image_url: "",
        alt_text: "",
        seo_title: "",
        seo_description: "",
        seo_keywords: "",
      });
    }
    setErrorMessage(null);
  }, [currentCategory, form]);
  
  const handleEdit = (category: ProductCategoryData) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentCategory(null);
    setIsDialogOpen(true);
  };
  
  // Auto-generate slug from category name
  const handleGenerateSlug = () => {
    const categoryName = form.getValues("category_name");
    if (categoryName) {
      const slug = categoryName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("category_slug", slug);
    }
  };
  
  const onSubmit = async (values: ProductCategoryFormValues) => {
    if (!session) {
      setErrorMessage("You must be logged in to save product categories");
      return;
    }
    
    // Check if the required buckets are available
    if (!bucketsInitialized || (bucketsInitialized && !buckets.includes('product-categories'))) {
      setErrorMessage("Storage buckets are not properly initialized. Please contact an administrator.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const submitData = {
        category_name: values.category_name,
        category_slug: values.category_slug,
        product_name: values.product_name,
        category_image_url: values.category_image_url,
        alt_text: values.alt_text,
        seo_title: values.seo_title,
        seo_description: values.seo_description,
        seo_keywords: values.seo_keywords,
      };
      
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('product_categories')
          .update(submitData)
          .eq('id', values.id);
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to update product categories");
          }
          throw error;
        }
        
        toast.success("Product category updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('product_categories')
          .insert(submitData);
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to create product categories");
          }
          throw error;
        }
        
        toast.success("Product category added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['product_categories'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving product category:", error);
      setErrorMessage(error.message || "An error occurred saving the product category");
      toast.error(`Error saving product category: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!session) {
      toast.error("You must be logged in to delete product categories");
      return;
    }
    
    if (confirm("Are you sure you want to delete this product category? This will also delete associated details and gallery images.")) {
      try {
        // Delete associated product details first
        const { error: detailsError } = await supabase
          .from('product_category_details')
          .delete()
          .eq('category_id', id);
          
        if (detailsError) {
          if (detailsError.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to delete product details");
          }
          throw detailsError;
        }
        
        // Delete associated gallery images
        const { error: galleryError } = await supabase
          .from('product_gallery')
          .delete()
          .eq('category_id', id);
          
        if (galleryError) {
          if (galleryError.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to delete gallery images");
          }
          throw galleryError;
        }
        
        // Delete the category itself
        const { error } = await supabase
          .from('product_categories')
          .delete()
          .eq('id', id);
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to delete product categories");
          }
          throw error;
        }
        
        toast.success("Product category and related items deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['product_categories'] });
      } catch (error: any) {
        console.error("Error deleting product category:", error);
        toast.error(`Error deleting product category: ${error.message}`);
      }
    }
  };
  
  if (!bucketsInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Checking storage buckets...</p>
        </div>
      </div>
    );
  }
  
  // Show warning if the required bucket doesn't exist
  if (bucketsInitialized && !buckets.includes('product-categories')) {
    return (
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          The "product-categories" bucket is still being initialized. Please refresh the page in a few moments.
          If the issue persists, please contact your administrator to ensure the bucket is properly created.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!session) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to manage product categories.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading product categories: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Product Categories</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>
      
      {buckets.length > 0 && (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Available storage buckets: {buckets.join(", ")}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative bg-gray-200 rounded overflow-hidden">
                      {category.category_image_url ? (
                        <img 
                          src={category.category_image_url} 
                          alt={category.alt_text || 'Category image'} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No img
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{category.category_name || 'N/A'}</TableCell>
                  <TableCell>{category.category_slug || 'N/A'}</TableCell>
                  <TableCell>{category.product_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(category.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No product categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "Edit Product Category" : "Add New Product Category"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name="category_slug"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Category Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="category-slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGenerateSlug}
                      className="mb-[2px]"
                    >
                      Generate
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="product_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <ImageUploadField
                    control={form.control}
                    name="category_image_url"
                    label="Category Image"
                    altTextName="alt_text"
                    bucket="product-categories"
                    folder="product_categories"
                  />
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <SeoFields control={form.control} />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Category
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
