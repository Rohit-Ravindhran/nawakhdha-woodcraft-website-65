
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import GalleryManager from "@/components/admin/GalleryManager";
import SettingsEditor from "@/components/admin/SettingsEditor";
import AdminHeader from "@/components/admin/AdminHeader";
import PagesTab from "@/components/admin/tabs/PagesTab";
import ProductsTab from "@/components/admin/tabs/ProductsTab";
import BlogsTab from "@/components/admin/tabs/BlogsTab";

const AdminPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pages");

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="section-padding bg-secondary/30">
      <div className="container-custom">
        <AdminHeader handleLogout={handleLogout} />
        
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
            <PagesTab />
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          
          {/* Blog Tab */}
          <TabsContent value="blog">
            <BlogsTab />
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
