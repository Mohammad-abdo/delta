import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { logger } from "@/utils/logger";
import Layout from "./components/Layout";
import TopHeader from "./components/TopHeader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import Home from "./pages/Home";
import About from "./pages/About";
import VisionMission from "./pages/VisionMission";
import Strategy from "./pages/Strategy";
import Quality from "./pages/Quality";
import CEOMessage from "./pages/CEOMessage";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import SinglePost from "./pages/SinglePost";
import SingleProduct from "./pages/SingleProduct";
import Products from "./pages/Products";
import LaboratoryEquipment from "./pages/LaboratoryEquipment";
import ServiceDetails from "./pages/ServiceDetails";
import SearchPage from "./pages/Search";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminHero from "./pages/admin/Hero";
import AdminAbout from "./pages/admin/About";
import AdminVisionMission from "./pages/admin/VisionMission";
import AdminStrategy from "./pages/admin/Strategy";
import AdminQuality from "./pages/admin/Quality";
import AdminCEOMessage from "./pages/admin/CEOMessage";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";
import AdminBlog from "./pages/admin/Blog";
import AdminLaboratoryEquipment from "./pages/admin/LaboratoryEquipment";
import AdminServices from "./pages/admin/Services";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0, // Always consider data stale - disable cache
      gcTime: 0, // Don't cache - disable cache
      cacheTime: 0, // Legacy support - disable cache
    },
  },
});

/**
 * Main App Component
 * 
 * Sets up the application with routing, providers, and global components.
 * All routes are wrapped in the Layout component for consistent navigation.
 * Includes a preloader with animated logo that shows during initial page load.
 */
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading - wait for images and resources to load
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 1000);
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show preloader for at least 2 seconds

    // Also check if all resources are loaded
    if (document.readyState === "complete") {
      setTimeout(() => setIsLoading(false), 1500);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Preloader isLoading={isLoading} />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<><TopHeader /><Navbar /><Home /><Footer /></>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/vision-mission" element={<Layout><VisionMission /></Layout>} />
            <Route path="/strategy" element={<Layout><Strategy /></Layout>} />
            <Route path="/quality" element={<Layout><Quality /></Layout>} />
            <Route path="/ceo-message" element={<Layout><CEOMessage /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/services" element={<Layout><LaboratoryEquipment /></Layout>} />
            <Route path="/news" element={<Layout><Blog /></Layout>} />
            <Route path="/partners" element={<Layout><Partners /></Layout>} />
            <Route path="/blog/:id" element={<Layout><SinglePost /></Layout>} />
            <Route path="/product/:id" element={<Layout><SingleProduct /></Layout>} />
            <Route path="/service/:id" element={<Layout><ServiceDetails /></Layout>} />
            <Route path="/search" element={<Layout><SearchPage /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hero"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminHero />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/about"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminAbout />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vision-mission"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminVisionMission />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/strategy"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminStrategy />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quality"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminQuality />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ceo-message"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminCEOMessage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute roles={["ADMIN", "EDITOR"]}>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminBlog />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/laboratory-equipment"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminLaboratoryEquipment />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminServices />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
