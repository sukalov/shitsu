import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Оригиналы", href: "/originals" },
  { label: "Мерч", href: "/merch" },
  { label: "Индивидуальный заказ", href: "/custom" },
  { label: "Архив", href: "/archive" },
  { label: "О себе", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items, setIsOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-4 shadow-sm"
            : "bg-transparent py-6",
        )}
      >
        <nav className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="relative group">
              <img
                src="/logo.png"
                alt="SHITSU"
                className="h-8 lg:h-10 w-auto object-contain"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "relative text-xs tracking-[0.2em] uppercase transition-colors duration-300 elegant-underline",
                    location.pathname === item.href
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                aria-label="Открыть корзину"
                className="relative p-2 text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" weight="light" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 text-[10px] text-white flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
                className="lg:hidden p-2 text-neutral-900"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" weight="light" />
                ) : (
                  <List className="w-6 h-6" weight="light" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="flex flex-col items-center justify-center h-full">
            {menuItems.map((item, idx) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-3xl py-4 transition-all duration-500",
                  location.pathname === item.href
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-900",
                )}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
