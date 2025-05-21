
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const AdminPageContainer = () => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState("home_services");

  const handleLogout = async () => {
    await signOut();
  };

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

export default AdminPageContainer;
