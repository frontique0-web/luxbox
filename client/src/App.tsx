import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Product from "@/pages/product";
import { useEffect } from "react";
import Lenis from "lenis";
import 'lenis/dist/lenis.css'
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminCategories from "@/pages/admin/categories";
import AdminSettings from "@/pages/admin/settings";
import AdminLayout from "@/components/admin/layout";
import { ProtectedAdminRoute } from "@/hooks/use-admin-auth";

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />

      <Route path="/admin">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>

      <Route path="/admin/products">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>

      <Route path="/admin/categories">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminCategories />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>

      <Route path="/admin/settings">
        <ProtectedAdminRoute>
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        </ProtectedAdminRoute>
      </Route>

      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={Product} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Only initialize Lenis on desktop/larger screens where smooth scroll adds value
    // On mobile, native inertial scrolling is heavily hardware optimized and smooth scroll libraries often cause jank
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CartSidebar />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
