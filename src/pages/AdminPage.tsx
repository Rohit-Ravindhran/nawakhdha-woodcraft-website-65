
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import HomeServicesTab from "@/components/admin/tabs/HomeServicesTab";
import HomeProductsTab from "@/components/admin/tabs/HomeProductsTab";
import HomeBlogCardsTab from "@/components/admin/tabs/HomeBlogCardsTab";
import AboutTeamTab from "@/components/admin/tabs/AboutTeamTab";
import ContactInfoTab from "@/components/admin/tabs/ContactInfoTab";
import ProductCategoriesTab from "@/components/admin/tabs/ProductCategoriesTab";
import ProductDetailsTab from "@/components/admin/tabs/ProductDetailsTab";
import ProductGalleryTab from "@/components/admin/tabs/ProductGalleryTab";
import BlogsTab from "@/components/admin/tabs/BlogsTab";
import PagesTab from "@/components/admin/tabs/PagesTab";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useStorageBuckets } from "@/hooks/useStorageBuckets";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

const AdminPage = () => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState("home_services");
  const { isInitialized: bucketsInitialized, error: bucketsError, buckets } = useStorageBuckets();

  const handleLogout = async () => {
    await signOut();
  };

  // Check if buckets are initialized before rendering content
  if (!bucketsInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Initializing storage...</p>
        </div>
      </div>
    );
  }

  if (bucketsError) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error initializing storage: {bucketsError.message}
        </AlertDescription>
      </Alert>
    );
  }

  console.log("Available buckets:", buckets);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Content Management</h1>
              <div className="flex items-center gap-3">
                {user && (
                  <span className="text-sm text-gray-600">
                    Logged in as: {user.email}
                  </span>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-8 overflow-x-auto flex border-b border-gray-200 pb-1">
              <TabsTrigger value="home_services" className="px-4 py-2 mx-1">Home Services</TabsTrigger>
              <TabsTrigger value="home_products" className="px-4 py-2 mx-1">Home Products</TabsTrigger>
              <TabsTrigger value="home_blog_cards" className="px-4 py-2 mx-1">Home Blog Cards</TabsTrigger>
              <TabsTrigger value="about_team" className="px-4 py-2 mx-1">About Team</TabsTrigger>
              <TabsTrigger value="contact_info" className="px-4 py-2 mx-1">Contact Info</TabsTrigger>
              <TabsTrigger value="product_categories" className="px-4 py-2 mx-1">Product Categories</TabsTrigger>
              <TabsTrigger value="product_details" className="px-4 py-2 mx-1">Product Details</TabsTrigger>
              <TabsTrigger value="product_gallery" className="px-4 py-2 mx-1">Product Gallery</TabsTrigger>
              <TabsTrigger value="blogs" className="px-4 py-2 mx-1">Blogs</TabsTrigger>
              <TabsTrigger value="pages" className="px-4 py-2 mx-1">Pages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="home_services">
              <HomeServicesTab />
            </TabsContent>
            
            <TabsContent value="home_products">
              <HomeProductsTab />
            </TabsContent>
            
            <TabsContent value="home_blog_cards">
              <HomeBlogCardsTab />
            </TabsContent>
            
            <TabsContent value="about_team">
              <AboutTeamTab />
            </TabsContent>
            
            <TabsContent value="contact_info">
              <ContactInfoTab />
            </TabsContent>
            
            <TabsContent value="product_categories">
              <ProductCategoriesTab />
            </TabsContent>
            
            <TabsContent value="product_details">
              <ProductDetailsTab />
            </TabsContent>
            
            <TabsContent value="product_gallery">
              <ProductGalleryTab />
            </TabsContent>
            
            <TabsContent value="blogs">
              <BlogsTab />
            </TabsContent>
            
            <TabsContent value="pages">
              <PagesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
