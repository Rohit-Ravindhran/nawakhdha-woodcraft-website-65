import { useState } from "react";
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
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import SeoFields from "../SeoFields";

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
  
  const queryClient = useQueryClient();
  
  const { data: categories, isLoading } = useQuery({
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
  
  const handleEdit = (category: ProductCategoryData) => {
    setCurrentCategory(category);
    form.reset({
      id: category.id,
      category_name: category.category_name || "",
      category_slug: category.category_slug || "",
      product_name: category.product_name || "",
      category_image_url: category.category_image_url || "",
      alt_text: category.alt_text || "",
      seo_title: category.seo_title || "",
      seo_description: category.seo_description || "",
      seo_keywords: category.seo_keywords || "",
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentCategory(null);
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
          
        if (error) throw error;
        toast.success("Product category updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('product_categories')
          .insert(submitData);
          
        if (error) throw error;
        toast.success("Product category added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['product_categories'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving product category: ${error.message}`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product category? This will also delete associated details and gallery images.")) {
      try {
        // Delete associated product details first
        const { error: detailsError } = await supabase
          .from('product_category_details')
          .delete()
          .eq('category_id', id);
          
        if (detailsError) throw detailsError;
        
        // Delete associated gallery images
        const { error: galleryError } = await supabase
          .from('product_gallery')
          .delete()
          .eq('category_id', id);
          
        if (galleryError) throw galleryError;
        
        // Delete the category itself
        const { error } = await supabase
          .from('product_categories')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Product category and related items deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['product_categories'] });
      } catch (error: any) {
        toast.error(`Error deleting product category: ${error.message}`);
      }
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Product Categories</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>
      
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "Edit Product Category" : "Add New Product Category"}
            </DialogTitle>
          </DialogHeader>
          
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
                <Button type="submit" className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Category
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
