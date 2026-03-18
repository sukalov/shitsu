import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router";
import { useAuth } from "@/lib/hooks";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Navigation } from "@/components/Navigation";
import { CartSidebar } from "@/components/CartSidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const HomePage = lazy(() =>
  import("@/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const ProductPage = lazy(() =>
  import("@/pages/ProductPage").then((m) => ({ default: m.ProductPage })),
);
const CategoryPage = lazy(() =>
  import("@/pages/CategoryPage").then((m) => ({ default: m.CategoryPage })),
);
const CustomPage = lazy(() =>
  import("@/pages/CustomPage").then((m) => ({ default: m.CustomPage })),
);
const AboutPage = lazy(() =>
  import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ContactsPage = lazy(() =>
  import("@/pages/ContactsPage").then((m) => ({ default: m.ContactsPage })),
);
const DeliveryPage = lazy(() =>
  import("@/pages/DeliveryPage").then((m) => ({ default: m.DeliveryPage })),
);
const AdminLogin = lazy(() =>
  import("@/pages/admin/Login").then((m) => ({ default: m.AdminLogin })),
);
const AdminProducts = lazy(() =>
  import("@/pages/admin/Products").then((m) => ({ default: m.AdminProducts })),
);
const AdminMerchSubcategories = lazy(() =>
  import("@/pages/admin/MerchSubcategories").then((m) => ({
    default: m.AdminMerchSubcategories,
  })),
);
const AdminSettings = lazy(() =>
  import("@/pages/admin/Settings").then((m) => ({ default: m.AdminSettings })),
);
const AdminLayout = lazy(() =>
  import("@/pages/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="animate-pulse text-neutral-400">Загрузка...</div>
    </div>
  );
}

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) return;
    if (!token) void navigate("/admin/auth");
  }, [token, navigate]);

  if (!token) return <PageLoader />;

  return <>{children}</>;
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <Suspense fallback={<PageLoader />}>
        <AdminLayout>{children}</AdminLayout>
      </Suspense>
    </AdminAuthGuard>
  );
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

  if (!token) return <Navigate to="/admin/auth" replace />;

  return (
    <Suspense fallback={<PageLoader />}>
      <AdminLayout>
        <div className="text-center py-20">
          <h1 className="text-4xl uppercase tracking-widest mb-4">404</h1>
          <p className="text-neutral-500 mb-8">Страница не найдена</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => void navigate("/")}>
              Вернуться на сайт
            </Button>
            <Button
              variant="outline"
              onClick={() => void navigate("/admin/products")}
            >
              Админ-панель
            </Button>
          </div>
        </div>
      </AdminLayout>
    </Suspense>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedAdminRoute>
            <AdminProducts />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/merch-subcategories"
        element={
          <ProtectedAdminRoute>
            <AdminMerchSubcategories />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedAdminRoute>
            <AdminSettings />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/" element={<AdminIndex />} />
      <Route path="*" element={<AdminNotFound />} />
    </Routes>
  );
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Outlet />
      <Footer />
      <CartSidebar />
    </div>
  );
}

function SuspendedRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              <SuspendedRoute>
                <HomePage />
              </SuspendedRoute>
            }
          />
          <Route
            path="/originals"
            element={
              <SuspendedRoute>
                <CategoryPage category="originals" title="Оригиналы" />
              </SuspendedRoute>
            }
          />
          <Route
            path="/merch"
            element={
              <SuspendedRoute>
                <CategoryPage category="merch" title="Мерч" />
              </SuspendedRoute>
            }
          />
          <Route
            path="/archive"
            element={
              <SuspendedRoute>
                <CategoryPage title="Архив" isSold={true} />
              </SuspendedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <SuspendedRoute>
                <ProductPage />
              </SuspendedRoute>
            }
          />
          <Route
            path="/custom"
            element={
              <SuspendedRoute>
                <CustomPage />
              </SuspendedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <SuspendedRoute>
                <AboutPage />
              </SuspendedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <SuspendedRoute>
                <ContactsPage />
              </SuspendedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <SuspendedRoute>
                <DeliveryPage />
              </SuspendedRoute>
            }
          />
        </Route>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}
