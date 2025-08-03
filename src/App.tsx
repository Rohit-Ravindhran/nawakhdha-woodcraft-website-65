import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MaintenanceServicesPage from "./pages/MaintenanceServicesPage";
import MaintenanceServiceDetailPage from "./pages/MaintenanceServiceDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPostPage from "./pages/BlogPostPage";
import FireRatedDoorsPage from "./pages/FireRatedDoorsPage";
import InteriorFitoutsPage from "./pages/InteriorFitoutsPage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Standard Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/building-maintenance-services" element={<MaintenanceServicesPage />} />
              <Route path="/building-maintenance-services/:slug" element={<MaintenanceServiceDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/fire-rated-doors-bahrain" element={<FireRatedDoorsPage />} />
              <Route path="/interior-fitouts-bahrain" element={<InteriorFitoutsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<AdminLogin />} />

              {/* Redirects from old URLs */}
              <Route path="/fire-rated-doors" element={<Navigate to="/fire-rated-doors-bahrain" replace />} />
              
              {/* Redirects from old UUID URLs */}
              <Route path="/product/079e2b15-efe3-4dc5-a4df-4160fbd55198" element={<Navigate to="/product/wardrobes-bahrain" replace />} />
              <Route path="/product/08a91417-2172-415f-9753-9c53ef049e46" element={<Navigate to="/product/middle-eastern-design-doors-bahrain" replace />} />
              <Route path="/product/0b766e5d-728b-41a1-b283-e69248756905" element={<Navigate to="/product/outdoor-swings-bahrain" replace />} />
              <Route path="/product/15862272-117c-4435-b77f-eee00981411b" element={<Navigate to="/product/walk-in-closets-bahrain" replace />} />
              <Route path="/product/16e0bf67-f85a-4c6f-8733-c1a781296293" element={<Navigate to="/product/office-furniture-bahrain" replace />} />
              <Route path="/product/2444a5bc-7c40-4ad5-8864-bd6b858ab1be" element={<Navigate to="/product/parquet-flooring-bahrain" replace />} />
              <Route path="/product/27fa4820-f0ef-4869-a387-b821fe1f06b3" element={<Navigate to="/product/wall-partitions-bahrain" replace />} />
              <Route path="/product/30b64da2-03af-4af5-86cd-f84ed3c9d663" element={<Navigate to="/product/tv-cabinets-bahrain" replace />} />
              <Route path="/product/3b0774c9-605a-497a-bff6-f602573e1591" element={<Navigate to="/product/western-design-doors-bahrain" replace />} />
              <Route path="/product/52a9b2a6-54ad-4fb1-b295-73721a1f49c1" element={<Navigate to="/product/wall-cladding-bahrain" replace />} />
              <Route path="/product/68ae2de3-747c-4bea-afd9-b3e7fa122276" element={<Navigate to="/product/modern-design-doors-bahrain" replace />} />
              <Route path="/product/6c9754dc-781c-4161-a075-62157d85c6a5" element={<Navigate to="/product/dining-tables-chairs-bahrain" replace />} />
              <Route path="/product/9e59a8b5-7087-4aa7-b40e-43635d9322bd" element={<Navigate to="/product/dressing-tables-bahrain" replace />} />
              <Route path="/product/a257f393-9ad2-4fc7-805c-e47afa022698" element={<Navigate to="/product/patio-furniture-bahrain" replace />} />
              <Route path="/product/a8a6fec2-0b7a-4777-aa68-56343d4503c9" element={<Navigate to="/product/showcases-bahrain" replace />} />
              <Route path="/product/b48d151b-7c1e-44f5-b0af-d0187c4f9305" element={<Navigate to="/product/teapoy-bahrain" replace />} />
              <Route path="/product/b50fc39f-ad50-49b8-b282-d3c0519b984f" element={<Navigate to="/product/study-tables-bahrain" replace />} />
              <Route path="/product/c558e225-2fb7-4766-8442-8c105d5a2d10" element={<Navigate to="/product/book-shelves-bahrain" replace />} />
              <Route path="/product/c8bf588b-b263-4802-9888-f309cc14530f" element={<Navigate to="/product/kitchen-cabinets-bahrain" replace />} />
              <Route path="/product/cda7157c-db12-4e58-bbe2-a5b317a27f11" element={<Navigate to="/product/bedroom-furniture-bahrain" replace />} />
            </Routes>
          </Layout>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
