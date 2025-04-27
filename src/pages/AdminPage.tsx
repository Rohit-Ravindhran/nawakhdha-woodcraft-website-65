
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is a simple demonstration - in a real app, use proper authentication
    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true);
      setError("");
      toast.success("Successfully logged in");
    } else {
      setError("Invalid username or password");
      toast.error("Login failed");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    toast.info("Logged out successfully");
  };

  // In a real implementation, this would connect to an actual backend
  // This is just a placeholder to demonstrate the UI
  
  if (!isLoggedIn) {
    return (
      <div className="section-padding bg-secondary/30">
        <div className="container-custom max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md border border-border">
            <h1 className="heading-md mb-6 text-center">Admin Login</h1>
            {error && <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="username">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-md">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="pages">
          <TabsList className="mb-8">
            <TabsTrigger value="pages">Main Pages</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Main Pages</h2>
              <p className="text-muted-foreground mb-6">
                Manage your main website pages. Edit content, update images, and modify SEO settings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Home", "About", "Services", "Contact Us"].map((page) => (
                  <div key={page} className="flex justify-between items-center p-4 border rounded-md">
                    <span>{page}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit Content</Button>
                      <Button variant="outline" size="sm">SEO Settings</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Manage Products</h2>
              <p className="text-muted-foreground mb-6">
                Add, edit or remove product pages. Manage product galleries and update descriptions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {[
                  "Western Doors", 
                  "Modern Doors", 
                  "Middle Eastern Doors",
                  "TV Cabinets", 
                  "Kitchen Cabinets", 
                  "Teapoy",
                  "Wardrobes", 
                  "Dining Tables",
                  "Wall Partitions",
                  "Study Tables",
                  "Wall Cladding",
                  "Reception Furniture",
                  "Bedroom Furniture",
                  "Dressing Tables",
                  "Outdoor Swings",
                  "Patio Furniture",
                  "Walk-in Closets",
                  "Parquet Flooring",
                  "Book Shelves",
                  "Showcases"
                ].map((product) => (
                  <div key={product} className="flex justify-between items-center p-4 border rounded-md">
                    <span>{product}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Gallery</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-6">Add New Product</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="blog">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Manage Blog Posts</h2>
              <p className="text-muted-foreground mb-6">
                Create new blog posts, edit existing content, update featured images, and manage comments.
              </p>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {[
                  "Top Trends in Wooden Furniture 2025", 
                  "How to Maintain Custom Wooden Doors", 
                  "Choosing the Right Wood for Your Home",
                  "Modern vs. Classic Door Designs",
                  "Interior Design Tips for Wooden Furniture"
                ].map((post) => (
                  <div key={post} className="flex justify-between items-center p-4 border rounded-md">
                    <span>{post}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Featured Image</Button>
                      <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button>Add New Blog Post</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Manage Gallery</h2>
              <p className="text-muted-foreground mb-6">
                Upload and organize images for your site gallery. Add captions and alt text for SEO.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4, 5, 6, 8].map((index) => (
                  <div key={index} className="border rounded-md p-2 relative group">
                    <div className="aspect-square bg-muted rounded-md"></div>
                    <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity rounded-md">
                      <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/20">Edit</Button>
                      <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/20">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button>Upload New Images</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Site Settings</h2>
              <p className="text-muted-foreground mb-6">
                Manage website global settings, contact information, social media links, and analytics integration.
              </p>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">Phone Number</label>
                      <Input defaultValue="+973 1777 7777" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">Email Address</label>
                      <Input defaultValue="nawakhdha2058@gmail.com" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">Address</label>
                      <Input defaultValue="Building 1234, Road 5678, Block 123, Manama, Bahrain" />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3">Social Media</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">Facebook URL</label>
                      <Input defaultValue="https://facebook.com" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">Instagram URL</label>
                      <Input defaultValue="https://instagram.com" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">LinkedIn URL</label>
                      <Input defaultValue="https://linkedin.com" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-800">
            <strong>Note:</strong> This is a demonstration interface. In a full implementation, this admin panel 
            would connect to a backend service to handle content management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
