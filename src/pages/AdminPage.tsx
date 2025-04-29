
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import GalleryManager from "@/components/admin/GalleryManager";
import SettingsEditor from "@/components/admin/SettingsEditor";
import AdminHeader from "@/components/admin/AdminHeader";
import PagesTab from "@/components/admin/tabs/PagesTab";
import ProductsTab from "@/components/admin/tabs/ProductsTab";
import BlogsTab from "@/components/admin/tabs/BlogsTab";
import TabNavigation from "@/components/admin/TabNavigation";
import TabContentWrapper from "@/components/admin/TabContentWrapper";

const AdminPage = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("pages");

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="section-padding bg-secondary/30">
      <div className="container-custom">
        <AdminHeader handleLogout={handleLogout} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabNavigation activeTab={activeTab} />
          
          {/* Main Pages Tab */}
          <TabsContent value="pages">
            <TabContentWrapper>
              <PagesTab />
            </TabContentWrapper>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <TabContentWrapper>
              <ProductsTab />
            </TabContentWrapper>
          </TabsContent>
          
          {/* Blog Tab */}
          <TabsContent value="blog">
            <TabContentWrapper>
              <BlogsTab />
            </TabContentWrapper>
          </TabsContent>
          
          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <TabContentWrapper>
              <GalleryManager />
            </TabContentWrapper>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <TabContentWrapper>
              <SettingsEditor />
            </TabContentWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
