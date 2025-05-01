import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HomeServiceData } from "@/hooks/content/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "../ImageUploadField";

const homeServiceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
});

type HomeServiceFormValues = z.infer<typeof homeServiceSchema>;

export default function HomeServicesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHomeService, setCurrentHomeService] = useState<HomeServiceData | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: homeServices, isLoading } = useQuery({
    queryKey: ['home_services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_services')
        .select('*')
        .order('id');
        
      if (error) throw error;
      return data as HomeServiceData[];
    },
  });
  
  const form = useForm<HomeServiceFormValues>({
    resolver: zodResolver(homeServiceSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      alt_text: "",
    },
  });
  
  const handleEdit = (homeService: HomeServiceData) => {
    setCurrentHomeService(homeService);
    form.reset({
      id: homeService.id,
      title: homeService.title || "",
      description: homeService.description || "",
      image_url: homeService.image_url || "",
      alt_text: homeService.alt_text || "",
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentHomeService(null);
    form.reset({
      title: "",
      description: "",
      image_url: "",
      alt_text: "",
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (values: HomeServiceFormValues) => {
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('home_services')
          .update({
            title: values.title,
            description: values.description,
            image_url: values.image_url,
            alt_text: values.alt_text,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Home service updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('home_services')
          .insert({
            title: values.title,
            description: values.description,
            image_url: values.image_url,
            alt_text: values.alt_text,
          });
          
        if (error) throw error;
        toast.success("Home service added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['home_services'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving home service: ${error.message}`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const { error } = await supabase
          .from('home_services')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Home service deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['home_services'] });
      } catch (error: any) {
        toast.error(`Error deleting home service: ${error.message}`);
      }
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Home Services</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {homeServices && homeServices.length > 0 ? (
            homeServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="w-16 h-16 relative bg-gray-200 rounded overflow-hidden">
                    {service.image_url ? (
                      <img 
                        src={service.image_url} 
                        alt={service.alt_text || 'Service image'} 
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
                <TableCell>{service.title || 'N/A'}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {service.description || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(service.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No home services found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentHomeService ? "Edit Home Service" : "Add New Home Service"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Service title" {...field} />
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
                      <Textarea placeholder="Service description" {...field} rows={5} />
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
                bucket="home-services"
                folder="home_services"
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
