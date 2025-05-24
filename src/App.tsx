
import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";

// Import pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ProductsPage from "@/pages/ProductsPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";

// Import admin pages
import AdminPage from "@/pages/AdminPage";
import AdminLogin from "@/pages/AdminLogin";

// Import components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Import the ProductDetailPage
import ProductDetailPage from "@/pages/ProductDetailPage";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <Routes>
          {/* Public routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Admin routes without Layout */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
