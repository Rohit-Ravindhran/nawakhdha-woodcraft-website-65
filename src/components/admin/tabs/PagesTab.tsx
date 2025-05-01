
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
import { Edit, Save } from "lucide-react";
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Pages</h2>
        <p className="text-gray-500 mt-1">
          Edit page content and SEO settings.
        </p>
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
              Edit {currentPage?.page_name || "Page"}
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
