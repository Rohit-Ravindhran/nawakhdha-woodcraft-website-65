import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { Edit, Plus, Save, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().optional(),
  body_content: z.string().optional(),
  excerpt: z.string().optional(),
  featured_image_url: z.string().optional(),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

function ImageUploadField({
  control,
  name,
  label,
  altTextName,
}: {
  control: any;
  name: string;
  label: string;
  altTextName?: string;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center gap-4">
            {field.value ? (
              <div className="flex items-center gap-4">
                <img
                  src={field.value}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => field.onChange("")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Label htmlFor={`file-upload-${name}`} className="cursor-pointer">
                  <Button asChild variant="outline">
                    <div>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </div>
                  </Button>
                </Label>
                <Input
                  id={`file-upload-${name}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    try {
                      setUploading(true);
                      if (!e.target.files || e.target.files.length === 0) {
                        throw new Error("Please select an image to upload.");
                      }

                      const file = e.target.files[0];
                      const fileExt = file.name.split(".").pop();
                      const fileName = `${Math.random()}.${fileExt}`;
                      const filePath = `blog/${fileName}`;

                      const { data, error } = await supabase.storage
                        .from("blogs")
                        .upload(filePath, file);

                      if (error) throw error;

                      const { data: { publicUrl } } = supabase.storage
                        .from("blogs")
                        .getPublicUrl(data.path);

                      field.onChange(publicUrl);
                    } catch (error: any) {
                      toast.error(`Upload failed: ${error.message}`);
                    } finally {
                      setUploading(false);
                    }
                  }}
                  disabled={uploading}
                />
                {uploading && <span className="text-sm">Uploading...</span>}
              </div>
            )}
          </div>
          {altTextName && (
            <FormField
              control={control}
              name={altTextName}
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Image description for accessibility" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function BlogsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogFormValues | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      body_content: "",
      excerpt: "",
      featured_image_url: "",
      image_url: "",
      alt_text: "",
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });
  
  const handleEdit = (blog: BlogFormValues) => {
    setCurrentBlog(blog);
    form.reset({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      body_content: blog.body_content,
      excerpt: blog.excerpt,
      featured_image_url: blog.featured_image_url,
      image_url: blog.image_url,
      alt_text: blog.alt_text,
      date: blog.date ? format(new Date(blog.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentBlog(null);
    form.reset({
      title: "",
      slug: "",
      content: "",
      body_content: "",
      excerpt: "",
      featured_image_url: "",
      image_url: "",
      alt_text: "",
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsDialogOpen(true);
  };
  
  const handleGenerateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  };
  
  const onSubmit = async (values: BlogFormValues) => {
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('blogs')
          .update({
            title: values.title,
            slug: values.slug,
            content: values.content,
            body_content: values.body_content,
            excerpt: values.excerpt,
            featured_image_url: values.featured_image_url,
            image_url: values.image_url,
            alt_text: values.alt_text,
            date: values.date,
          })
          .eq('id', values.id);
          
        if (error) throw error;
        toast.success("Blog post updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('blogs')
          .insert({
            title: values.title,
            slug: values.slug,
            content: values.content,
            body_content: values.body_content,
            excerpt: values.excerpt,
            featured_image_url: values.featured_image_url,
            image_url: values.image_url,
            alt_text: values.alt_text,
            date: values.date,
          });
          
        if (error) throw error;
        toast.success("Blog post added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving blog post: ${error.message}`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Blog post deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
      } catch (error: any) {
        toast.error(`Error deleting blog post: ${error.message}`);
      }
    }
  };
  
  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Blog Posts</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New Post
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Featured Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div className="w-16 h-16 relative bg-gray-200 rounded overflow-hidden">
                    {blog.featured_image_url ? (
                      <img 
                        src={blog.featured_image_url} 
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
                <TableCell className="font-medium">{blog.title || 'N/A'}</TableCell>
                <TableCell>{blog.slug || 'N/A'}</TableCell>
                <TableCell>{blog.date ? format(new Date(blog.date), 'MMM d, yyyy') : 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(blog.id)}
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
                No blog posts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentBlog ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Blog post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="blog-post-slug" {...field} />
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
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief summary of the post" 
                            {...field} 
                            rows={3}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <ImageUploadField
                    control={form.control}
                    name="featured_image_url"
                    label="Featured Image"
                    altTextName="alt_text"
                  />
                  
                  <ImageUploadField
                    control={form.control}
                    name="image_url"
                    label="Secondary Image"
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Short)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Short content or introduction" 
                        {...field} 
                        rows={5}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="body_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Content (Full Article)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Full article content" 
                        {...field} 
                        rows={15}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                  Save Blog Post
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
