
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import GalleryManager from "@/components/admin/GalleryManager";
import SettingsEditor from "@/components/admin/SettingsEditor";
import AdminHeader from "@/components/admin/AdminHeader";
import TabNavigation from "@/components/admin/TabNavigation";
import TabContentWrapper from "@/components/admin/TabContentWrapper";
import HomePageEditor from "@/components/admin/editors/HomePageEditor";
import AllProductsTab from "@/components/admin/tabs/AllProductsTab";
import ProductDetailsTab from "@/components/admin/tabs/ProductDetailsTab";
import AboutPageEditor from "@/components/admin/editors/AboutPageEditor";
import ContactPageEditor from "@/components/admin/editors/ContactPageEditor";
import BlogsTab from "@/components/admin/tabs/BlogsTab";

const AdminPage = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="section-padding bg-secondary/30">
      <div className="container-custom">
        <AdminHeader handleLogout={handleLogout} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabNavigation activeTab={activeTab} />
          
          {/* Home Page Tab */}
          <TabsContent value="home">
            <TabContentWrapper>
              <HomePageEditor page={null} isLoading={false} />
            </TabContentWrapper>
          </TabsContent>
          
          {/* All Products Tab */}
          <TabsContent value="all-products">
            <TabContentWrapper>
              <AllProductsTab />
            </TabContentWrapper>
          </TabsContent>
          
          {/* Product Details Tab */}
          <TabsContent value="product-details">
            <TabContentWrapper>
              <ProductDetailsTab />
            </TabContentWrapper>
          </TabsContent>
          
          {/* About Page Tab */}
          <TabsContent value="about">
            <TabContentWrapper>
              <AboutPageEditor />
            </TabContentWrapper>
          </TabsContent>
          
          {/* Contact Us Tab */}
          <TabsContent value="contact">
            <TabContentWrapper>
              <ContactPageEditor />
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
