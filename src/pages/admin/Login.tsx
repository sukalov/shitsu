import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminExists, useSetupAdmin, useLogin, useSetAuth } from "@/lib/hooks";

export function AdminLogin() {
  const navigate = useNavigate();
  const adminExists = useAdminExists();
  const setupAdmin = useSetupAdmin();
  const login = useLogin();
  const setAuth = useSetAuth();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!adminExists) {
        await setupAdmin({ password });
      }
      const result = await login({ password });
      if (result.success && result.token) {
        setAuth(result.token);
        void navigate("/admin/products");
      } else {
        setError("Неверный пароль");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
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
