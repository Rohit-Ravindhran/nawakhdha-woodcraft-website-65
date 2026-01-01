
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProductCategoriesTab from "./tabs/ProductCategoriesTab";
import HomeProductsTab from "./tabs/HomeProductsTab";
import HomeServicesTab from "./tabs/HomeServicesTab";
import BlogsTab from "./tabs/BlogsTab";
import PagesTab from "./tabs/PagesTab";
import SettingsTab from "./tabs/SettingsTab";

const AdminPage = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await signOut();
      navigate("/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      setLogoutError(error.message || "Logout failed. Please try again.");
    }
  };

  const tabs = [
    { 
      id: "home-services", 
      label: "Home Services", 
      component: HomeServicesTab,
      description: "Manage services section on the homepage"
    },
    { 
      id: "home-products", 
      label: "Home Products", 
      component: HomeProductsTab,
      description: "Manage featured products on the homepage"
    },
    { 
      id: "product-categories", 
      label: "Product Categories", 
      component: ProductCategoriesTab,
      description: "Manage product categories and details"
    },
    { 
      id: "blogs", 
      label: "Blogs", 
      component: BlogsTab,
      description: "Manage blog posts"
    },
    { 
      id: "pages", 
      label: "Pages", 
      component: PagesTab,
      description: "Manage static pages content"
    },
    { 
      id: "settings", 
      label: "Settings", 
      component: SettingsTab,
      description: "Sitemap generation and system settings"
    },
  ];

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to view this page. <a href="/login" className="underline">Login</a>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <Button variant="destructive" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {logoutError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{logoutError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={tabs[0].id} className="w-full space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="capitalize">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <div className="rounded-md border p-4">
              <h2 className="text-xl font-semibold mb-2">{tab.label}</h2>
              <p className="text-sm text-muted-foreground">{tab.description}</p>
            </div>
            {<tab.component />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminPage;
