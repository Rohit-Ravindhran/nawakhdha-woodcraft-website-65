
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HomeProductData } from "@/hooks/content/types";
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

const homeProductSchema = z.object({
  id: z.string().optional(),
  category_name: z.string().min(1, "Category name is required"),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
});

type HomeProductFormValues = z.infer<typeof homeProductSchema>;

export default function HomeProductsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHomeProduct, setCurrentHomeProduct] = useState<HomeProductData | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: homeProducts, isLoading } = useQuery({
    queryKey: ['home_products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_products')
        .select('*')
        .order('id');
        
      if (error) throw error;
      return data as HomeProductData[];
    },
  });
  
  const form = useForm<HomeProductFormValues>({
    resolver: zodResolver(homeProductSchema),
    defaultValues: {
      category_name: "",
      image_url: "",
      alt_text: "",
    },
  });
  
  const handleEdit = (homeProduct: HomeProductData) => {
    setCurrentHomeProduct(homeProduct);
    form.reset({
      id: homeProduct.id,
      category_name: homeProduct.category_name || "",
      image_url: homeProduct.image_url || "",
      alt_text: homeProduct.alt_text || "",
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentHomeProduct(null);
    form.reset({
      category_name: "",
      image_url: "",
      alt_text: "",
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (values: HomeProductFormValues) => {
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('home_products')
          .update({
            category_name: values.category_name,
            image_url: values.image_url,
            alt_text: values.alt_text,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Home product updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('home_products')
          .insert({
            category_name: values.category_name,
            image_url: values.image_url,
            alt_text: values.alt_text,
          });
          
        if (error) throw error;
        toast.success("Home product added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['home_products'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving home product: ${error.message}`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const { error } = await supabase
          .from('home_products')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Home product deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['home_products'] });
      } catch (error: any) {
        toast.error(`Error deleting home product: ${error.message}`);
      }
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Home Products</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {homeProducts && homeProducts.length > 0 ? (
            homeProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-16 h-16 relative bg-gray-200 rounded overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.alt_text || 'Product image'} 
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
                <TableCell>{product.category_name || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(product.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No home products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentHomeProduct ? "Edit Home Product" : "Add New Home Product"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              
              <ImageUploadField
                control={form.control}
                name="image_url"
                label="Image"
                altTextName="alt_text"
                bucket="content"
                folder="home_products"
              />
              
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
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
