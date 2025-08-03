
import { useState } from "react";
import { BlogFormValues } from "@/components/admin/schemas/blogSchema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useBlogOperations } from "@/hooks/admin/useBlogOperations";
import BlogTable from "@/components/admin/blog/BlogTable";
import BlogForm from "@/components/admin/blog/BlogForm";

export default function BlogsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogFormValues | null>(null);
  
  const { blogs, isLoading, saveBlog, deleteBlog } = useBlogOperations();
  
  const handleEdit = (blog: BlogFormValues) => {
    setCurrentBlog(blog);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentBlog(null);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (values: BlogFormValues) => {
    await saveBlog(values);
    setIsDialogOpen(false);
  };
  
  const handleCancel = () => {
    setIsDialogOpen(false);
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
      
      <BlogTable 
        blogs={blogs} 
        onEdit={handleEdit} 
        onDelete={deleteBlog} 
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentBlog ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          
          <BlogForm 
            currentBlog={currentBlog}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
