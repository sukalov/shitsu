import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminExists, useSetupAdmin, useLogin } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function AdminLogin() {
  const navigate = useNavigate();
  const adminExists = useAdminExists();
  const setupAdmin = useSetupAdmin();
  const login = useLogin();

  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const doSubmit = async () => {
      try {
        if (!adminExists) {
          await setupAdmin({ password });
          const result = await login({ password });
          if (result.success) {
            localStorage.setItem("adminToken", result.token || "");
            void navigate("/admin/products");
          }
        } else {
          const result = await login({ password });
          if (result.success) {
            localStorage.setItem("adminToken", result.token || "");
            void navigate("/admin/products");
          } else {
            setError("Неверный пароль");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    void doSubmit();
  };

  if (adminExists === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl uppercase tracking-[0.15em] mb-2">
            {adminExists ? "Вход в админку" : "Настройка пароля"}
          </h1>
          <p className="text-neutral-500 text-sm">
            {adminExists
              ? "Введите пароль для входа"
              : "Создайте пароль для администрирования"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!adminExists && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Оставьте пустым при первой настройке"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">
              {adminExists ? "Пароль" : "Новый пароль"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Загрузка..."
              : adminExists
                ? "Войти"
                : "Создать пароль"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Вернуться на сайт
          </a>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({
  children,
  currentPage,
  onNavigate,
}: {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
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
              <button
                onClick={() => onNavigate("products")}
                className={cn(
                  "text-sm uppercase tracking-[0.1em] transition-colors",
                  currentPage === "products"
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900",
                )}
              >
                Товары
              </button>
              <button
                onClick={() => onNavigate("orders")}
                className={cn(
                  "text-sm uppercase tracking-[0.1em] transition-colors",
                  currentPage === "orders"
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900",
                )}
              >
                Заказы
              </button>
              <button
                onClick={() => onNavigate("settings")}
                className={cn(
                  "text-sm uppercase tracking-[0.1em] transition-colors",
                  currentPage === "settings"
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900",
                )}
              >
                Настройки
              </button>
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

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>

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
