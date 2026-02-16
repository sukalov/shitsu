import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/lib/hooks";

export function AdminSettings() {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 4) {
      setError("Пароль должен быть не менее 4 символов");
      return;
    }

    setIsLoading(true);

    const doSubmit = async () => {
      try {
        await changePassword({
          currentPassword,
          newPassword,
        });
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    void doSubmit();
  };

  return (
    <div>
      <h1 className="text-2xl uppercase tracking-[0.15em] mb-8">Настройки</h1>

      <div className="max-w-md">
        <div className="bg-white shadow p-6">
          <h2 className="text-lg uppercase tracking-wider mb-6">
            Изменить пароль
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {success && (
              <p className="text-green-500 text-sm">Пароль успешно изменён</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Изменить пароль"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
