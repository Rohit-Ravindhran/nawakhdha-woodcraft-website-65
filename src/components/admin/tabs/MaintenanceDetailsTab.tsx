
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenanceCategoryData, MaintenanceCategoryDetailData } from "@/hooks/content/maintenance/types";
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

const maintenanceDetailSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type MaintenanceDetailFormValues = z.infer<typeof maintenanceDetailSchema>;

export default function MaintenanceDetailsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<MaintenanceCategoryDetailData | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: maintenanceCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['maintenance_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_categories')
        .select('id, category_name')
        .order('category_name');
        
      if (error) throw error;
      return data as Pick<MaintenanceCategoryData, 'id' | 'category_name'>[];
    },
  });
  
  const { data: maintenanceDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['maintenance_category_details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_category_details')
        .select(`
          *,
          maintenance_categories(id, category_name)
        `);
        
      if (error) throw error;
      return data;
    },
  });
  
  const form = useForm<MaintenanceDetailFormValues>({
    resolver: zodResolver(maintenanceDetailSchema),
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
  
  const onSubmit = async (values: MaintenanceDetailFormValues) => {
    try {
      if (values.id) {
        const { error } = await supabase
          .from('maintenance_category_details')
          .update({
            category_id: values.category_id,
            description: values.description,
            seo_title: values.seo_title,
            seo_description: values.seo_description,
            seo_keywords: values.seo_keywords,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Maintenance details updated successfully");
      } else {
        const { data: existing } = await supabase
          .from('maintenance_category_details')
          .select('id')
          .eq('category_id', values.category_id)
          .maybeSingle();
        
        if (existing) {
          const { error } = await supabase
            .from('maintenance_category_details')
            .update({
              description: values.description,
              seo_title: values.seo_title,
              seo_description: values.seo_description,
              seo_keywords: values.seo_keywords,
            })
            .eq('id', existing.id);
            
          if (error) throw error;
          toast.success("Maintenance details updated successfully");
        } else {
          const { error } = await supabase
            .from('maintenance_category_details')
            .insert({
              category_id: values.category_id,
              description: values.description,
              seo_title: values.seo_title,
              seo_description: values.seo_description,
              seo_keywords: values.seo_keywords,
            });
            
          if (error) throw error;
          toast.success("Maintenance details added successfully");
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['maintenance_category_details'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving maintenance details: ${error.message}`);
    }
  };
  
  const getCategoriesWithoutDetails = () => {
    if (!maintenanceCategories || !maintenanceDetails) return [];
    
    return maintenanceCategories.filter(category => 
      !maintenanceDetails.some(detail => detail.category_id === category.id)
    );
  };
  
  const isLoading = loadingCategories || loadingDetails;
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Maintenance Service Details</h2>
        <p className="text-gray-500 mt-1">
          Manage detailed descriptions and SEO information for each maintenance service category.
        </p>
      </div>
      
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
          {maintenanceDetails && maintenanceDetails.length > 0 ? (
            maintenanceDetails.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>{detail.maintenance_categories?.category_name || 'Unknown category'}</TableCell>
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
                No maintenance service details found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentDetail ? "Edit Maintenance Service Details" : "Add Maintenance Service Details"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Category</FormLabel>
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
                        {maintenanceCategories?.map(category => (
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
                        placeholder="Detailed service description" 
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
