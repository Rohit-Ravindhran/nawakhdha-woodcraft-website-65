
import { Plus, Edit, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BulkImageUpload from "../gallery/BulkImageUpload";
import { 
  BucketStatusChecker, 
  GalleryImageGrid, 
  GalleryImageDialog, 
  useProductGallery 
} from "./gallery";

export default function ProductGalleryTab() {
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedCategory,
    setSelectedCategory,
    errorMessage,
    productCategories,
    galleryImages,
    loadingCategories,
    loadingImages,
    session,
    form,
    handleEdit,
    handleAdd,
    onSubmit,
    handleDelete,
  } = useProductGallery();
  
  const isLoading = loadingCategories || loadingImages;
  
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
    <BucketStatusChecker>
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Product Gallery</h2>
          <p className="text-gray-500 mt-1">
            Manage gallery images for product categories.
          </p>
        </div>
        
        <Tabs defaultValue="bulk-upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bulk-upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </TabsTrigger>
            <TabsTrigger value="manage-existing" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Manage Existing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-upload" className="space-y-6">
            <BulkImageUpload categories={productCategories || []} />
          </TabsContent>

          <TabsContent value="manage-existing" className="space-y-6">
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
                Add Single Image
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <GalleryImageGrid
                images={galleryImages}
                selectedCategory={selectedCategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <GalleryImageDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          currentImage={null}
          errorMessage={errorMessage}
          form={form}
          onSubmit={onSubmit}
          productCategories={productCategories}
        />
      </div>
    </BucketStatusChecker>
  );
}
