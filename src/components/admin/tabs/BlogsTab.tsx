
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import BlogEditor from "@/components/admin/BlogEditor";
import { useBlogs, useDeleteBlog } from "@/hooks/content";
import { BlogData } from "@/hooks/content/types";

export interface Blog extends BlogData {
  id: number;
}

const BlogsTab = () => {
  const { data: blogs, isLoading: loadingBlogs } = useBlogs();
  const deleteBlog = useDeleteBlog();
  const [isAddingBlog, setIsAddingBlog] = useState(false);

  const handleDeleteBlog = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteBlog.mutate(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-border mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Blog Posts</h2>
        <Dialog open={isAddingBlog} onOpenChange={setIsAddingBlog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogEditor 
              onSave={() => setIsAddingBlog(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {loadingBlogs ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogListItem 
                key={blog.id}
                blog={blog}
                onDelete={handleDeleteBlog}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No blog posts found. Add your first blog post!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface BlogListItemProps {
  blog: Blog;
  onDelete: (id: number) => void;
}

const BlogListItem = ({ blog, onDelete }: BlogListItemProps) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md">
      <div>
        <h3 className="font-medium">{blog.title}</h3>
        <p className="text-sm text-muted-foreground">{blog.date}</p>
      </div>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Edit</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
            </DialogHeader>
            <BlogEditor blogId={blog.id} />
          </DialogContent>
        </Dialog>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(blog.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BlogsTab;
