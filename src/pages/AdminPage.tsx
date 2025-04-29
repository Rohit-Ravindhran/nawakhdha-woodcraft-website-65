
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, useDeleteProduct } from "@/hooks/content";
import { useBlogs, useDeleteBlog } from "@/hooks/content";
import PageEditor from "@/components/admin/PageEditor";
import ProductEditor from "@/components/admin/ProductEditor";
import BlogEditor from "@/components/admin/BlogEditor";
import GalleryManager from "@/components/admin/GalleryManager";
import SettingsEditor from "@/components/admin/SettingsEditor";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Loader2, PlusCircle, InfoIcon } from "lucide-react";

const AdminPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pages");
  
  // For product management
  const { data: products, isLoading: loadingProducts } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  // For blog management
  const { data: blogs, isLoading: loadingBlogs } = useBlogs();
  const deleteBlog = useDeleteBlog();
  const [selectedBlogId, setSelectedBlogId] = useState<number | undefined>();
  const [isAddingBlog, setIsAddingBlog] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  const handleDeleteBlog = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteBlog.mutate(id);
    }
  };

  return (
    <div className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-md">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Enhanced Content Management</AlertTitle>
          <AlertDescription>
            You can now easily edit all content and images across your website, with built-in SEO optimization tools. 
            Images are automatically compressed for better performance.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="pages">Main Pages</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Main Pages Tab */}
          <TabsContent value="pages">
            <div className="space-y-8">
              <PageEditor pageName="home" />
              <PageEditor pageName="about" />
              <PageEditor pageName="contact" />
            </div>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-white p-6 rounded-lg border border-border mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Products</h2>
                <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <ProductEditor 
                      onSave={() => setIsAddingProduct(false)} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-4 border rounded-md">
                        <span>{product.product_name}</span>
                        <div className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedProductId(product.id)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                              </DialogHeader>
                              <ProductEditor productId={product.id} />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No products found. Add your first product!
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedProductId && (
              <ProductEditor productId={selectedProductId} />
            )}
          </TabsContent>
          
          {/* Blog Tab */}
          <TabsContent value="blog">
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
                      <div key={blog.id} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <h3 className="font-medium">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground">{blog.date}</p>
                        </div>
                        <div className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedBlogId(blog.id)}
                              >
                                Edit
                              </Button>
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
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No blog posts found. Add your first blog post!
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedBlogId && (
              <BlogEditor blogId={selectedBlogId} />
            )}
          </TabsContent>
          
          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
