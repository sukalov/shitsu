import { useNavigate, NavLink } from "react-router";
import { useSetAuth } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Товары", to: "/admin/products" },
  { label: "Подкатегории мерча", to: "/admin/merch-subcategories" },
  { label: "Настройки", to: "/admin/settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const setAuth = useSetAuth();

  const handleLogout = () => {
    setAuth(null);
    void navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xl uppercase tracking-[0.15em]">
              SHITSU
            </a>
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "text-sm uppercase tracking-[0.1em] transition-colors",
                      isActive
                        ? "text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">{children}</main>

      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <a
            href="/"
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Вернуться на сайт
          </a>
        </div>
      </footer>
    </div>
  );
}
