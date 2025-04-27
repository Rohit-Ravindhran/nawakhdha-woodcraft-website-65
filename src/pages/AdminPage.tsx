
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

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
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // In a real implementation, this would connect to an actual backend
  // This is just a placeholder to demonstrate the UI
  
  if (!isLoggedIn) {
    return (
      <div className="section-padding">
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
    <div className="section-padding">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-md">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Manage Products</h2>
              <p className="text-muted-foreground mb-6">
                This is a demonstration of the admin interface. In a complete implementation, 
                this would allow you to add, edit, and remove product pages.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Western Doors", "Modern Doors", "Kitchen Cabinets", "Bedroom Furniture"].map((product) => (
                  <div key={product} className="flex justify-between items-center p-4 border rounded-md">
                    <span>{product}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Images</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-6">Add New Product</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Manage Gallery</h2>
              <p className="text-muted-foreground">
                Here you would be able to manage images across the site. You would be able to upload,
                edit captions, and organize images by products or collections.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="blog">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Manage Blog Posts</h2>
              <p className="text-muted-foreground">
                This section would allow you to create, edit, and publish blog posts with rich text
                editing, image uploads, and scheduling capabilities.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Site Settings</h2>
              <p className="text-muted-foreground">
                Control general website settings, contact information, and other global configuration
                options.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-800">
            <strong>Note:</strong> This is a demonstration interface. In a full implementation, this admin panel 
            would connect to a backend service like Supabase to handle content management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
