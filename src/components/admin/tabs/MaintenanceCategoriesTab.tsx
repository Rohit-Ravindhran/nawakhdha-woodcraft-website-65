
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenanceCategoryData } from "@/hooks/content/maintenance/types";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Plus, Save, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUploadField from "../ImageUploadField";
import SeoFields from "../SeoFields";
import { useAuth } from "@/contexts/AuthContext";

const maintenanceCategorySchema = z.object({
  id: z.string().optional(),
  category_name: z.string().min(1, "Category name is required"),
  category_slug: z.string().optional(),
  service_name: z.string().optional(),
  category_image_url: z.string().optional(),
  alt_text: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type MaintenanceCategoryFormValues = z.infer<typeof maintenanceCategorySchema>;

export default function MaintenanceCategoriesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<MaintenanceCategoryData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { session } = useAuth();
  
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['maintenance_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_categories')
        .select('*')
        .order('category_name');
        
      if (error) throw error;
      return data as MaintenanceCategoryData[];
    },
  });
  
  const form = useForm<MaintenanceCategoryFormValues>({
    resolver: zodResolver(maintenanceCategorySchema),
    defaultValues: {
      category_name: "",
      category_slug: "",
      service_name: "",
      category_image_url: "",
      alt_text: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    },
  });
  
  useEffect(() => {
    if (currentCategory) {
      form.reset({
        id: currentCategory.id,
        category_name: currentCategory.category_name || "",
        category_slug: currentCategory.category_slug || "",
        service_name: currentCategory.service_name || "",
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
        service_name: "",
        category_image_url: "",
        alt_text: "",
        seo_title: "",
        seo_description: "",
        seo_keywords: "",
      });
    }
    setErrorMessage(null);
  }, [currentCategory, form]);
  
  const handleEdit = useCallback((category: MaintenanceCategoryData) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  }, []);
  
  const handleAdd = useCallback(() => {
    setCurrentCategory(null);
    setIsDialogOpen(true);
  }, []);
  
  const handleGenerateSlug = useCallback(() => {
    const categoryName = form.getValues("category_name");
    if (categoryName) {
      const slug = categoryName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("category_slug", slug);
    }
  }, [form]);
  
  const onSubmit = async (values: MaintenanceCategoryFormValues) => {
    if (!session) {
      setErrorMessage("You must be logged in to save maintenance categories");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const submitData = {
        category_name: values.category_name,
        category_slug: values.category_slug,
        service_name: values.service_name,
        category_image_url: values.category_image_url,
        alt_text: values.alt_text,
        seo_title: values.seo_title,
        seo_description: values.seo_description,
        seo_keywords: values.seo_keywords,
      };
      
      if (values.id) {
        const { error } = await supabase
          .from('maintenance_categories')
          .update(submitData)
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Maintenance category updated successfully");
      } else {
        const { error } = await supabase
          .from('maintenance_categories')
          .insert(submitData);
          
        if (error) throw error;
        toast.success("Maintenance category added successfully");
      }
      
      queryClient.invalidateQueries({ queryKey: ['maintenance_categories'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving maintenance category:", error);
      setErrorMessage(error.message || "An error occurred saving the maintenance category");
      toast.error(`Error saving maintenance category: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!session) {
      toast.error("You must be logged in to delete maintenance categories");
      return;
    }
    
    if (confirm("Are you sure you want to delete this maintenance category? This will also delete associated details and gallery images.")) {
      try {
        const { error: detailsError } = await supabase
          .from('maintenance_category_details')
          .delete()
          .eq('category_id', id);
          
        if (detailsError) throw detailsError;
        
        const { error: galleryError } = await supabase
          .from('maintenance_gallery')
          .delete()
          .eq('category_id', id);
          
        if (galleryError) throw galleryError;
        
        const { error } = await supabase
          .from('maintenance_categories')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Maintenance category and related items deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['maintenance_categories'] });
      } catch (error: any) {
        console.error("Error deleting maintenance category:", error);
        toast.error(`Error deleting maintenance category: ${error.message}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading maintenance categories...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to manage maintenance categories.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading maintenance categories: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Maintenance Categories</h2>
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
            <TableHead>Service Name</TableHead>
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
                <TableCell>{category.service_name || 'N/A'}</TableCell>
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
                No maintenance categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "Edit Maintenance Category" : "Add New Maintenance Category"}
            </DialogTitle>
            <DialogDescription>
              {currentCategory ? "Modify the details of this maintenance category." : "Create a new maintenance category with images and SEO settings."}
            </DialogDescription>
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
                    name="service_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Service name" {...field} value={field.value || ''} />
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
                    bucket="maintenance-services"
                    folder="maintenance_categories"
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
