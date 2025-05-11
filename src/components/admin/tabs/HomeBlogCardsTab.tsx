
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HomeBlogCardData } from "@/hooks/content/types";
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

const homeBlogCardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
  slug: z.string().optional(),
});

type HomeBlogCardFormValues = z.infer<typeof homeBlogCardSchema>;

export default function HomeBlogCardsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBlogCard, setCurrentBlogCard] = useState<HomeBlogCardData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { data: homeBlogs, isLoading } = useQuery({
    queryKey: ['home_blog_cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_blog_cards')
        .select('*')
        .order('id');

      if (error) throw error;
      return data as HomeBlogCardData[];
    },
  });

  const form = useForm<HomeBlogCardFormValues>({
    resolver: zodResolver(homeBlogCardSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      alt_text: "",
      slug: "",
    },
  });

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleEdit = (blogCard: HomeBlogCardData) => {
    setCurrentBlogCard(blogCard);
    form.reset({
      id: blogCard.id,
      title: blogCard.title || "",
      description: blogCard.description || "",
      image_url: blogCard.image_url || "",
      alt_text: blogCard.alt_text || "",
      slug: blogCard.slug || "",
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentBlogCard(null);
    form.reset({
      title: "",
      description: "",
      image_url: "",
      alt_text: "",
      slug: "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: HomeBlogCardFormValues) => {
    try {
      const finalSlug = values.slug?.trim() || slugify(values.title);

      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('home_blog_cards')
          .update({
            title: values.title,
            description: values.description,
            image_url: values.image_url,
            alt_text: values.alt_text,
            slug: finalSlug,
          })
          .eq('id', values.id);

        if (error) throw error;
        toast.success("Blog card updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('home_blog_cards')
          .insert({
            title: values.title,
            description: values.description,
            image_url: values.image_url,
            alt_text: values.alt_text,
            slug: finalSlug,
          });

        if (error) throw error;
        toast.success("Blog card added successfully");
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['home_blog_cards'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving blog card: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const previousData = queryClient.getQueryData<HomeBlogCardData[]>(['home_blog_cards']);
      queryClient.setQueryData(['home_blog_cards'], old => old?.filter(card => card.id !== id));

      try {
        const { error } = await supabase
          .from('home_blog_cards')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast.success("Blog card deleted successfully");
      } catch (error: any) {
        toast.error(`Error deleting blog card: ${error.message}`);
        queryClient.setQueryData(['home_blog_cards'], previousData); // Rollback
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  // Fix the type error by properly typing the data and adding a null check
  const filteredBlogs = homeBlogs ? homeBlogs.filter(blog => 
    blog.title && blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Home Blog Cards</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Input
        placeholder="Search blog cards"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-xs"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBlogs && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div className="w-16 h-16 relative bg-gray-200 rounded overflow-hidden">
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.alt_text || 'Blog image'}
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
                <TableCell>{blog.title || 'N/A'}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">{blog.description || 'N/A'}</div>
                </TableCell>
                <TableCell>{blog.slug || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(blog)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(blog.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No blog cards found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentBlogCard ? "Edit Blog Card" : "Add New Blog Card"}</DialogTitle>
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
                      <Input placeholder="Blog title" {...field} />
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
                      <Textarea placeholder="Blog excerpt or description" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="URL-friendly slug (e.g. my-blog-post)" {...field} />
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
                bucket="home-blog-cards"
                folder="home_blogs"
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
