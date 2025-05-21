
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GalleryImageData, ProductCategoryData } from "@/hooks/content/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Plus, Save, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUploadField from "../ImageUploadField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const galleryImageSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  image_url: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
  alt_text: z.string().optional(),
  position: z.coerce.number().int().optional(),
});

type GalleryImageFormValues = z.infer<typeof galleryImageSchema>;

export default function ProductGalleryTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryImageData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { session } = useAuth();
  
  // Check if the product-gallery bucket exists
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const [checkingBucket, setCheckingBucket] = useState(true);
  
  useEffect(() => {
    const checkBucket = async () => {
      try {
        setCheckingBucket(true);
        const { data, error } = await supabase.storage.getBucket('product-gallery');
        
        if (error) {
          console.error('Error checking product-gallery bucket:', error);
          setBucketExists(false);
        } else {
          console.log('product-gallery bucket exists:', data);
          setBucketExists(true);
        }
      } catch (err) {
        console.error('Unexpected error checking bucket:', err);
        setBucketExists(false);
      } finally {
        setCheckingBucket(false);
      }
    };
    
    checkBucket();
  }, []);
  
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
  
  const { data: galleryImages, isLoading: loadingImages } = useQuery({
    queryKey: ['product_gallery', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('product_gallery')
        .select(`
          *,
          product_categories(id, category_name)
        `)
        .order('position', { ascending: true });
      
      if (selectedCategory && selectedCategory !== 'all-categories') {
        query = query.eq('category_id', selectedCategory);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
  
  const form = useForm<GalleryImageFormValues>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      category_id: "",
      image_url: "",
      caption: "",
      alt_text: "",
      position: 0,
    },
  });
  
  // Reset form when current image changes
  useEffect(() => {
    if (currentImage) {
      form.reset({
        id: currentImage.id,
        category_id: currentImage.category_id || "",
        image_url: currentImage.image_url || "",
        caption: currentImage.caption || "",
        alt_text: currentImage.alt_text || "",
        position: currentImage.position || 0,
      });
    } else {
      form.reset({
        category_id: selectedCategory || "",
        image_url: "",
        caption: "",
        alt_text: "",
        position: galleryImages?.length || 0,
      });
    }
    setErrorMessage(null);
  }, [currentImage, selectedCategory, galleryImages?.length, form]);
  
  const handleEdit = (image: any) => {
    setCurrentImage(image);
    form.reset({
      id: image.id,
      category_id: image.category_id || "",
      image_url: image.image_url || "",
      caption: image.caption || "",
      alt_text: image.alt_text || "",
      position: image.position || 0,
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentImage(null);
    form.reset({
      category_id: selectedCategory !== 'all-categories' ? selectedCategory || "" : "",
      image_url: "",
      caption: "",
      alt_text: "",
      position: galleryImages?.length || 0,
    });
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (values: GalleryImageFormValues) => {
    if (!session) {
      setErrorMessage("You must be logged in to manage gallery images");
      return;
    }
    
    if (bucketExists === false) {
      setErrorMessage("The product-gallery storage bucket is not available. Please contact an administrator.");
      return;
    }
    
    try {
      if (values.id) {
        // Update existing
        const { error } = await supabase
          .from('product_gallery')
          .update({
            category_id: values.category_id,
            image_url: values.image_url,
            caption: values.caption,
            alt_text: values.alt_text,
            position: values.position,
          })
          .eq('id', values.id);
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to update gallery images");
          }
          throw error;
        }
        
        toast.success("Gallery image updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('product_gallery')
          .insert({
            category_id: values.category_id,
            image_url: values.image_url,
            caption: values.caption,
            alt_text: values.alt_text,
            position: values.position,
          });
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to create gallery images");
          }
          throw error;
        }
        
        toast.success("Gallery image added successfully");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['product_gallery', selectedCategory] });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving gallery image:", error);
      setErrorMessage(error.message || "An error occurred saving the gallery image");
      toast.error(`Error saving gallery image: ${error.message}`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!session) {
      toast.error("You must be logged in to delete gallery images");
      return;
    }
    
    if (confirm("Are you sure you want to delete this gallery image?")) {
      try {
        const { error } = await supabase
          .from('product_gallery')
          .delete()
          .eq('id', id);
          
        if (error) {
          if (error.message.includes("row-level security policy")) {
            throw new Error("Permission denied: You may not have the required permissions to delete gallery images");
          }
          throw error;
        }
        
        toast.success("Gallery image deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['product_gallery', selectedCategory] });
      } catch (error: any) {
        console.error("Error deleting gallery image:", error);
        toast.error(`Error deleting gallery image: ${error.message}`);
      }
    }
  };
  
  const isLoading = loadingCategories || loadingImages || checkingBucket;
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }
  
  // Show warning if the required bucket doesn't exist
  if (bucketExists === false) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-4">
          <div>
            The "product-gallery" bucket is missing. This will prevent you from uploading and managing gallery images.
            Please contact your administrator to ensure the storage buckets are properly configured.
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!session) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to manage the product gallery.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Product Gallery</h2>
        <p className="text-gray-500 mt-1">
          Manage gallery images for product categories.
        </p>
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="w-72">
          <Select 
            value={selectedCategory || "all-categories"} 
            onValueChange={(value) => setSelectedCategory(value === "all-categories" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {productCategories?.map(category => (
                <SelectItem key={category.id} value={category.id!}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New Image
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages && galleryImages.length > 0 ? (
          galleryImages.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden bg-white">
              <div className="aspect-video relative bg-gray-100">
                {image.image_url ? (
                  <img 
                    src={image.image_url} 
                    alt={image.alt_text || 'Gallery image'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs">
                  Position: {image.position || 0}
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm font-medium">
                  {image.product_categories?.category_name || 'Unknown category'}
                </div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {image.caption || 'No caption'}
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(image)}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(image.id!)}
                    className="flex items-center text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-500">
            No gallery images found. {selectedCategory ? 'Try selecting a different category or ' : ''}
            Click "Add New Image" to add one.
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentImage ? "Edit Gallery Image" : "Add Gallery Image"}
            </DialogTitle>
          </DialogHeader>
          
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
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
              
              <ImageUploadField
                control={form.control}
                name="image_url"
                label="Gallery Image"
                altTextName="alt_text"
                bucket="product-gallery"
                folder="product_gallery"
              />
              
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input placeholder="Image caption" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Position</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
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
                  Save Image
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
