import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router";
import { useAuth } from "@/lib/hooks";
import { CartProvider } from "@/contexts/CartContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Navigation } from "@/components/Navigation";
import { CartSidebar } from "@/components/CartSidebar";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { CustomPage } from "@/pages/CustomPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactsPage } from "@/pages/ContactsPage";
import { DeliveryPage } from "@/pages/DeliveryPage";
import { AdminLogin } from "@/pages/admin/Login";
import { AdminProducts } from "@/pages/admin/Products";
import { AdminOrders } from "@/pages/admin/Orders";
import { AdminSettings } from "@/pages/admin/Settings";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Button } from "@/components/ui/button";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) {
      return;
    }
    if (!token) {
      void navigate("/admin/auth");
    }
  }, [token, navigate]);

  if (token === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}

function AdminIndex() {
  const token = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      void navigate("/admin/products", { replace: true });
    } else if (token === null) {
      void navigate("/admin/auth", { replace: true });
    }
  }, [token, navigate]);

  return null;
}

function AdminNotFound() {
  const navigate = useNavigate();
  const token = useAuth();

  if (token === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/auth" replace />;
  }

  return (
    <AdminLayout>
      <div className="text-center py-20">
        <h1 className="text-4xl uppercase tracking-widest mb-4">404</h1>
        <p className="text-neutral-500 mb-8">Страница не найдена</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => void navigate("/")}>Вернуться на сайт</Button>
          <Button
            variant="outline"
            onClick={() => void navigate("/admin/products")}
          >
            Админ-панель
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AdminLogin />} />
      <Route
        path="/products"
        element={
          <AdminAuthGuard>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminAuthGuard>
        }
      />
      <Route
        path="/orders"
        element={
          <AdminAuthGuard>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminAuthGuard>
        }
      />
      <Route
        path="/settings"
        element={
          <AdminAuthGuard>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </AdminAuthGuard>
        }
      />
      <Route path="/" element={<AdminIndex />} />
      <Route path="*" element={<AdminNotFound />} />
    </Routes>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route
          element={
            <div className="min-h-screen bg-white">
              <PublicLayout>
                <Outlet />
              </PublicLayout>
              <CartSidebar />
            </div>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route
            path="/originals"
            element={<CategoryPage category="originals" title="Оригиналы" />}
          />
          <Route
            path="/merch"
            element={<CategoryPage category="merch" title="Мерч" />}
          />
          <Route
            path="/archive"
            element={<CategoryPage title="Архив" isSold={true} />}
          />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
        </Route>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </CartProvider>
  );
}
