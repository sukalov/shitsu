import { Button } from "@/components/ui/button";
import { useCartBadge } from "@/lib/cart";
import { useMerchSubcategories } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { List, ShoppingBag, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

const menuItems = [
  { label: "Оригиналы", href: "/originals" },
  { label: "Мерч", href: "/merch" },
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
  const isFirstLocationEffect = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock page scroll while mobile menu is open (menu panel keeps its own scroll).
  useEffect(() => {
    if (!isMenuOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    const prevBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [isMenuOpen]);

  // Close mobile menu when the URL changes (pathname or query — e.g. /merch?subcategory=).
  // Defer setState (eslint) and skip the first run so toggling open does not close immediately.
  useEffect(() => {
    if (isFirstLocationEffect.current) {
      isFirstLocationEffect.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      setIsMenuOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

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
                const isMerch = item.href === "/merch";

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
        <div
          className="fixed inset-0 z-40 flex flex-col bg-white/98 backdrop-blur-md lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Навигация"
        >
          {/* Spacer for fixed header (logo + actions stay above at z-50) */}
          <div
            className="shrink-0"
            style={{
              height: "max(5.5rem, calc(3.5rem + env(safe-area-inset-top, 0px)))",
            }}
          />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
            <nav className="mx-auto flex w-full max-w-md flex-col gap-0.5">
              {menuItems.map((item, idx) => {
                const isMerch = item.href === "/merch";

                if (!isMerch) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "block rounded-2xl px-3 py-3 text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-300 sm:py-2.5",
                        location.pathname === item.href
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100",
                      )}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.href} className="py-0.5">
                    <Link
                      to={item.href}
                      className={cn(
                        "block rounded-2xl px-3 py-3 text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-300 sm:py-2.5",
                        location.pathname === item.href
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100",
                      )}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {item.label}
                    </Link>
                    {merchSubcategories && merchSubcategories.length > 0 && (
                      <div className="mt-1.5 ml-1 space-y-0.5 border-l border-neutral-200 pl-4">
                        <Link
                          to="/merch"
                          className="block rounded-lg py-2 pr-2 text-[11px] uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-neutral-900"
                        >
                          Весь мерч
                        </Link>
                        {merchSubcategories.map((subcategory) => (
                          <Link
                            key={subcategory._id}
                            to={`/merch?subcategory=${encodeURIComponent(
                              subcategory.slug,
                            )}`}
                            className="block rounded-lg py-2 pr-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-neutral-900"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
