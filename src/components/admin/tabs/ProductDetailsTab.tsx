
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCategoryData, ProductDetailData } from "@/hooks/content/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Save } from "lucide-react";
import SeoFields from "../SeoFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productDetailSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type ProductDetailFormValues = z.infer<typeof productDetailSchema>;

export default function ProductDetailsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<ProductDetailData | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: productCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['product_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, category_name')
        .order('category_name');
        
      if (error) throw error;
      return data as Pick<ProductCategoryData, 'id' | 'category_name'>[];
    },
  });
  
  const { data: productDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['product_category_details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_category_details')
        .select(`
          *,
          product_categories(id, category_name)
        `);
        
      if (error) throw error;
      return data;
    },
  });
  
  const form = useForm<ProductDetailFormValues>({
    resolver: zodResolver(productDetailSchema),
    defaultValues: {
      category_id: "",
      description: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    },
  });
  
  const handleEdit = (detail: any) => {
    setCurrentDetail(detail);
    form.reset({
      id: detail.id,
      category_id: detail.category_id || "",
      description: detail.description || "",
      seo_title: detail.seo_title || "",
      seo_description: detail.seo_description || "",
      seo_keywords: detail.seo_keywords || "",
    });
    setIsDialogOpen(true);
  };
  
  const handleAddForCategory = (categoryId: string) => {
    setCurrentDetail(null);
    form.reset({
      category_id: categoryId,
      description: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (values: ProductDetailFormValues) => {
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('product_category_details')
          .update({
            category_id: values.category_id,
            description: values.description,
            seo_title: values.seo_title,
            seo_description: values.seo_description,
            seo_keywords: values.seo_keywords,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Product details updated successfully");
      } else {
        // Check if a detail record already exists for this category
        const { data: existing } = await supabase
          .from('product_category_details')
          .select('id')
          .eq('category_id', values.category_id)
          .maybeSingle();
        
        if (existing) {
          // Update existing record
          const { error } = await supabase
            .from('product_category_details')
            .update({
              description: values.description,
              seo_title: values.seo_title,
              seo_description: values.seo_description,
              seo_keywords: values.seo_keywords,
            })
            .eq('id', existing.id);
            
          if (error) throw error;
          toast.success("Product details updated successfully");
        } else {
          // Create new
          const { error } = await supabase
            .from('product_category_details')
            .insert({
              category_id: values.category_id,
              description: values.description,
              seo_title: values.seo_title,
              seo_description: values.seo_description,
              seo_keywords: values.seo_keywords,
            });
            
          if (error) throw error;
          toast.success("Product details added successfully");
        }
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['product_category_details'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving product details: ${error.message}`);
    }
  };
  
  // Function to find category name for a given category ID
  const getCategoryName = (categoryId: string) => {
    if (!productCategories) return 'Unknown';
    const category = productCategories.find(cat => cat.id === categoryId);
    return category?.category_name || 'Unknown';
  };
  
  // Generate a list of categories that don't have details yet
  const getCategoriesWithoutDetails = () => {
    if (!productCategories || !productDetails) return [];
    
    return productCategories.filter(category => 
      !productDetails.some(detail => detail.category_id === category.id)
    );
  };
  
  const isLoading = loadingCategories || loadingDetails;
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Product Details</h2>
        <p className="text-gray-500 mt-1">
          Manage detailed descriptions and SEO information for each product category.
        </p>
      </div>
      
      {/* Categories needing details */}
      {getCategoriesWithoutDetails().length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Categories Needing Details</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {getCategoriesWithoutDetails().map(category => (
              <Button 
                key={category.id} 
                variant="outline" 
                onClick={() => handleAddForCategory(category.id!)}
              >
                Add details for {category.category_name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>SEO Info</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productDetails && productDetails.length > 0 ? (
            productDetails.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>{detail.product_categories?.category_name || 'Unknown category'}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {detail.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  {detail.seo_title || detail.seo_description || detail.seo_keywords ? 
                    'SEO data present' : 'No SEO data'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(detail)}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No product details found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentDetail ? "Edit Product Details" : "Add Product Details"}
            </DialogTitle>
          </DialogHeader>
          
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
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed product description" 
                        {...field} 
                        rows={10}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                  Save Details
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
