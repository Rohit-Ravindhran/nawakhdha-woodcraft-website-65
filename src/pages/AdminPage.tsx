
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProductCategoriesTab from "@/components/admin/tabs/ProductCategoriesTab";
import ProductDetailsTab from "@/components/admin/tabs/ProductDetailsTab";
import HomeProductsTab from "@/components/admin/tabs/HomeProductsTab";
import HomeServicesTab from "@/components/admin/tabs/HomeServicesTab";
import BlogsTab from "@/components/admin/tabs/BlogsTab";
import PagesTab from "@/components/admin/tabs/PagesTab";
import SettingsTab from "@/components/admin/tabs/SettingsTab";
import MaintenanceCategoriesTab from "@/components/admin/tabs/MaintenanceCategoriesTab";
import MaintenanceDetailsTab from "@/components/admin/tabs/MaintenanceDetailsTab";
import HomeBlogCardsTab from "@/components/admin/tabs/HomeBlogCardsTab";
import AboutTeamTab from "@/components/admin/tabs/AboutTeamTab";
import ContactInfoTab from "@/components/admin/tabs/ContactInfoTab";
import ProductGalleryTab from "@/components/admin/tabs/ProductGalleryTab";
import MyProjectsTab from "@/components/admin/tabs/MyProjectsTab";
import AluminiumMediaTab from "@/components/admin/tabs/AluminiumMediaTab";
import ContentReviewManager from "@/components/admin/ContentReviewManager";

const AdminPage = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);


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
      id: "content-review", 
      label: "Content Review", 
      component: ContentReviewManager,
      description: "Review and approve AI-generated content updates"
    },
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
      id: "home-blog-cards", 
      label: "Home Blog Cards", 
      component: HomeBlogCardsTab,
      description: "Manage blog cards displayed on the homepage"
    },
    { 
      id: "product-categories", 
      label: "Product Categories", 
      component: ProductCategoriesTab,
      description: "Manage product categories and details"
    },
    { 
      id: "product-details", 
      label: "Product Details", 
      component: ProductDetailsTab,
      description: "Manage detailed descriptions and SEO for product categories"
    },
    { 
      id: "product-gallery", 
      label: "Product Gallery", 
      component: ProductGalleryTab,
      description: "Manage product gallery images"
    },
    { 
      id: "maintenance-categories", 
      label: "Maintenance Categories", 
      component: MaintenanceCategoriesTab,
      description: "Manage building maintenance service categories"
    },
    { 
      id: "maintenance-details", 
      label: "Maintenance Details", 
      component: MaintenanceDetailsTab,
      description: "Manage building maintenance service details"
    },
    { 
      id: "about-team", 
      label: "About Team", 
      component: AboutTeamTab,
      description: "Manage team members for the about page"
    },
    { 
      id: "contact-info", 
      label: "Contact Info", 
      component: ContactInfoTab,
      description: "Manage contact information and business hours"
    },
    { 
      id: "blogs", 
      label: "Blogs", 
      component: BlogsTab,
      description: "Manage blog posts"
    },
    { 
      id: "my-projects", 
      label: "My Projects", 
      component: MyProjectsTab,
      description: "Manage videos and images for My Projects page"
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
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="capitalize whitespace-nowrap">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
