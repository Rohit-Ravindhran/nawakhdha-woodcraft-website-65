
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
  const [activeTab, setActiveTab] = useState("content-review");



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
      id: "aluminium-media", 
      label: "Aluminium Media", 
      component: AluminiumMediaTab,
      description: "Manage videos and images for the Aluminium Works page"
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

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];
  const ActiveComponent = active.component;

  return (
    <div className="container-custom section-padding">
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open admin menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Admin Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "text-left rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                      tab.id === active.id && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        </div>
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

      <div className="space-y-4">
        <div className="rounded-md border p-4">
          <h2 className="text-xl font-semibold mb-2">{active.label}</h2>
          <p className="text-sm text-muted-foreground">{active.description}</p>
        </div>
        <ActiveComponent />
      </div>
    </div>
  );
};


export default AdminPage;
