
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageData } from "@/hooks/content/types";
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
import { Edit, Save, Plus } from "lucide-react";
import SeoFields from "../SeoFields";

const pageSchema = z.object({
  id: z.string().optional(),
  page_name: z.string().min(1, "Page name is required"),
  hero: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

export default function PagesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('page_name');
        
      if (error) throw error;
      return data as PageData[];
    },
  });
  
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      page_name: "",
      hero: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    },
  });

  const ensureBuildingMaintenanceServicesPage = async () => {
    try {
      // Check if the page already exists
      const { data: existingPage } = await supabase
        .from('pages')
        .select('*')
        .eq('page_name', 'building-maintenance-services')
        .maybeSingle();

      if (!existingPage) {
        // Create the building maintenance services page
        const { error } = await supabase
          .from('pages')
          .insert({
            page_name: 'building-maintenance-services',
            hero: JSON.stringify({
              title: 'Professional Building Maintenance Services',
              subtitle: 'Comprehensive maintenance solutions for your building needs',
              description: 'Our expert team provides reliable and efficient maintenance services to keep your building in optimal condition.'
            }),
            seo_title: 'Building Maintenance Services - Professional Solutions',
            seo_description: 'Expert building maintenance services including repairs, upkeep, and facility management. Professional solutions for all your building maintenance needs.',
            seo_keywords: 'building maintenance, facility management, building repairs, maintenance services, professional maintenance'
          });

        if (error) throw error;
        
        // Refresh the pages data
        queryClient.invalidateQueries({ queryKey: ['pages'] });
        toast.success("Building Maintenance Services page created successfully");
      }
    } catch (error: any) {
      toast.error(`Error creating page: ${error.message}`);
    }
  };

  // Ensure Wooden Pallets page exists
  const ensureWoodenPalletsPage = async () => {
    try {
      const { data: existingPage } = await supabase
        .from('pages')
        .select('*')
        .eq('page_name', 'wooden-pallets-bahrain-saudi-arabia')
        .maybeSingle();

      if (!existingPage) {
        const { error } = await supabase
          .from('pages')
          .insert({
            page_name: 'wooden-pallets-bahrain-saudi-arabia',
            hero: JSON.stringify({
              title: 'Wooden Pallets in Bahrain & Saudi Arabia',
              subtitle: 'Softwood and hardwood pallets, Euro pallets, ISPM 15 export-ready, and custom sizes',
              description: 'Manufactured in Bahrain, serving Bahrain and Saudi Arabia with fast delivery and custom-built solutions.'
            }),
            seo_title: 'Wooden Pallets in Bahrain & Saudi Arabia',
            seo_description: 'Softwood and hardwood wooden pallets, Euro and ISPM 15 export pallets, custom sizes—manufactured in Bahrain, serving Bahrain and Saudi Arabia.',
            seo_keywords: 'wooden pallets Bahrain, wooden pallets Saudi Arabia, softwood pallets, hardwood pallets, Euro pallets, ISPM 15 pallets, custom pallets'
          });

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['pages'] });
        toast.success('Wooden Pallets page created successfully');
      }
    } catch (error: any) {
      toast.error(`Error creating page: ${error.message}`);
    }
  };

  // Ensure Custom Wooden Packaging page exists
  const ensureCustomWoodenPackagingPage = async () => {
    try {
      const { data: existingPage } = await supabase
        .from('pages')
        .select('*')
        .eq('page_name', 'custom-wooden-packaging-bahrain-saudi-arabia')
        .maybeSingle();

      if (!existingPage) {
        const { error } = await supabase
          .from('pages')
          .insert({
            page_name: 'custom-wooden-packaging-bahrain-saudi-arabia',
            hero: JSON.stringify({
              title: 'Custom Wooden Packaging in Bahrain & Saudi Arabia',
              subtitle: 'Crates, boxes, dunnage, pallet collars — ISPM 15 heat-treated and export-compliant',
              description: 'Bespoke wooden packaging engineered for protection and logistics efficiency across Bahrain and Saudi Arabia.'
            }),
            seo_title: 'Custom Wooden Packaging in Bahrain & Saudi Arabia',
            seo_description: 'Custom wooden crates, boxes, dunnage, pallet collars. ISPM 15 heat-treated. Serving Bahrain and Saudi Arabia.',
            seo_keywords: 'custom wooden packaging Bahrain, wooden crates Bahrain, wooden boxes Bahrain, ISPM 15 packaging Saudi Arabia, dunnage Bahrain, pallet collars Bahrain, industrial packaging, fragile goods packaging'
          });

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['pages'] });
        toast.success('Wooden Packaging page created successfully');
      }
    } catch (error: any) {
      toast.error(`Error creating page: ${error.message}`);
    }
  };

  // Ensure the required pages exist when component mounts
  useState(() => {
    ensureBuildingMaintenanceServicesPage();
    ensureWoodenPalletsPage();
    ensureCustomWoodenPackagingPage();
  });
  
  const handleEdit = (page: PageData) => {
    setCurrentPage(page);
    form.reset({
      id: page.id,
      page_name: page.page_name || "",
      hero: page.hero || "",
      seo_title: page.seo_title || "",
      seo_description: page.seo_description || "",
      seo_keywords: page.seo_keywords || "",
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentPage(null);
    form.reset({
      page_name: "",
      hero: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (values: PageFormValues) => {
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('pages')
          .update({
            page_name: values.page_name,
            hero: values.hero,
            seo_title: values.seo_title,
            seo_description: values.seo_description,
            seo_keywords: values.seo_keywords,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Page updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('pages')
          .insert({
            page_name: values.page_name,
            hero: values.hero,
            seo_title: values.seo_title,
            seo_description: values.seo_description,
            seo_keywords: values.seo_keywords,
          });
          
        if (error) throw error;
        toast.success("Page added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving page: ${error.message}`);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Pages</h2>
          <p className="text-gray-500 mt-1">
            Edit page content and SEO settings.
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-1" /> Add New Page
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page Name</TableHead>
            <TableHead>Hero Content</TableHead>
            <TableHead>SEO Content</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages && pages.length > 0 ? (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.page_name || 'N/A'}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {page.hero ? (
                      <span className="text-gray-500">
                        {typeof page.hero === 'string' && page.hero.length > 50 ? 
                          `${page.hero.substring(0, 50)}...` : page.hero}
                      </span>
                    ) : (
                      <span className="text-gray-400">No hero content</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {page.seo_title || page.seo_description || page.seo_keywords ? 
                    'SEO data present' : 'No SEO data'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(page)}
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
                No pages found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentPage ? `Edit ${currentPage.page_name}` : "Add New Page"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="page_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Page name (e.g. home, about, contact)" 
                        {...field} 
                        readOnly={!!currentPage} // Only allow editing for new pages
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="JSON content for the hero section" 
                        {...field} 
                        rows={8}
                        className="font-mono text-sm"
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Content should be in valid JSON format.
                    </p>
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
                  Save Page
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
