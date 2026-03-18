import { Button } from "@/components/ui/button";
import { useCartBadge } from "@/lib/cart";
import { useMerchSubcategories } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { List, ShoppingBag, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const menuItems = [
  { label: "Оригиналы", href: "/originals" },
  { label: "Мерч", href: "/merch", id: "merch" as const },
  { label: "Индивидуальный", href: "/custom" },
  { label: "Архив", href: "/archive" },
  { label: "О себе", href: "/about" },
  { label: "Контакты", href: "/contacts" },
] as const;

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { count, setIsOpen } = useCartBadge();
  const location = useLocation();
  const merchSubcategories = useMerchSubcategories();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
                src="./logo.png"
                alt="SHITSU"
                className="h-8 lg:h-10 w-auto object-contain"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {menuItems.map((item) => {
                const isMerch = item.id === "merch";

                if (!isMerch) {
                  return (
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
                  );
                }

                const isActive =
                  location.pathname === "/merch" ||
                  (location.pathname === "/merch" &&
                    new URLSearchParams(location.search).has("subcategory"));

                return (
                  <div key={item.href} className="relative group">
                    <Link
                      to={item.href}
                      className={cn(
                        "relative text-xs tracking-[0.2em] uppercase transition-colors duration-300 elegant-underline",
                        isActive
                          ? "text-neutral-900"
                          : "text-neutral-500 hover:text-neutral-900",
                      )}
                    >
                      {item.label}
                    </Link>
                    {merchSubcategories && merchSubcategories.length > 0 && (
                      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 top-full min-w-[220px] bg-white shadow-lg border border-neutral-200 py-2 z-50">
                        <Link
                          to="/merch"
                          className="block px-4 py-2 text-[11px] tracking-[0.16em] uppercase text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
                        >
                          Весь мерч
                        </Link>
                        <div className="border-t border-neutral-100 my-1" />
                        {merchSubcategories.map((subcategory) => (
                          <Link
                            key={subcategory._id}
                            to={`/merch?subcategory=${encodeURIComponent(
                              subcategory.slug,
                            )}`}
                            className="block px-4 py-2 text-[11px] tracking-[0.16em] uppercase text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 text-[10px] text-white flex items-center justify-center">
                    {count}
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
        <div className="fixed inset-0 z-40 bg-white pt-24">
          <div className="flex flex-col items-start justify-center h-full pl-12">
            {menuItems.map((item, idx) => {
              const isMerch = item.id === "merch";

              if (!isMerch) {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
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
                );
              }

              return (
                <div key={item.href} className="py-4">
                  <Link
                    to={item.href}
                    className={cn(
                      "block text-3xl mb-2 transition-all duration-500",
                      location.pathname === item.href
                        ? "text-neutral-900"
                        : "text-neutral-400 hover:text-neutral-900",
                    )}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {item.label}
                  </Link>
                  {merchSubcategories && merchSubcategories.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        to="/merch"
                        className="block text-sm text-neutral-400 hover:text-neutral-900"
                      >
                        Весь мерч
                      </Link>
                      {merchSubcategories.map((subcategory) => (
                        <Link
                          key={subcategory._id}
                          to={`/merch?subcategory=${encodeURIComponent(
                            subcategory.slug,
                          )}`}
                          className="block text-sm text-neutral-500 hover:text-neutral-900"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
