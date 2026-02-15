import { useState, createContext, useContext, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation, useParams } from "react-router";
import {
  ShoppingBag,
  List,
  X,
  ArrowLeft,
  InstagramLogo,
  TiktokLogo,
  TelegramLogo,
  Plus,
  Minus,
  Check,
  Envelope,
  Package,
  CreditCard,
  ArrowsClockwise,
  Sparkle,
  PaintBrush,
  Heart,
  MapPin,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

function HeaderImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = "none";
        target.nextElementSibling?.classList.remove("hidden");
      }}
    />
  );
}

// Utility function to create Telegram link with form data
function createTelegramLink(
  data: Record<string, string | number | undefined>,
): string {
  const lines = Object.entries(data)
    .filter(([_, value]) => value !== undefined && value !== "")
    .map(([key, value]) => {
      const cleanValue = String(value).trim().replace(/[<>]/g, "");
      return key ? `${key}: ${cleanValue}` : cleanValue;
    });

  const text = lines.join("\n");
  const encodedText = encodeURIComponent(text);
  return `https://t.me/shitsu_zakaz?text=${encodedText}`;
}

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  category: "originals" | "merch" | "archive";
  subcategory?: string;
  images: string[];
  description: string;
  isSold: boolean;
  seriesId?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Mock Data
const products: Product[] = [
  {
    id: "1",
    name: "Эфемерность",
    price: 15000,
    category: "originals",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800",
    ],
    description:
      "Абстрактная композиция, исследующая тему времени и трансформации. Работа погружает зрителя в медитативное состояние, приглашая к созерцанию мимолётности момента. Создана в 2024 году. Акрил на холсте, 40 × 50 см.",
    isSold: false,
  },
  {
    id: "2",
    name: "Полуночный сад",
    price: 12000,
    category: "originals", // originals or merch
    images: ["https://images.unsplash.com/photo-1549887534-1541e9326642?w=800"],
    description:
      "Ночной пейзаж с элементами сюрреализма. Тайный мир, открывающийся только в темноте, полный мистики и неожиданных открытий. Создан в 2024 году. Масло на холсте, 30 × 40 см.",
    isSold: false,
  },
  {
    id: "3",
    name: "Хаос и порядок",
    price: 18000,
    category: "originals",
    images: ["https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800"],
    description:
      "Исследование противопоставления структуры и хаоса. В каждом беспорядке скрыта гармония, ожидающая своего открытия. Создан в 2023 году. Смешанная техника, 50 × 60 см.",
    isSold: false,
  },
  {
    id: "4",
    name: "Звёздная пыль",
    price: 2500,
    category: "merch",
    subcategory: "Принты",
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
    ],
    description:
      "Цифровой принт на бумаге премиум качества. Каждый принт подписан автором и имеет сертификат подлинности. Создан в 2024 году. Размер 30 × 40 см.",
    isSold: false,
    seriesId: "sticker-pack-series",
  },
  {
    id: "5",
    name: "Лунное затмение",
    price: 2500,
    category: "merch",
    subcategory: "Принты",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
      "https://images.unsplash.com/photo-1614730341194-75c607400070?w=800",
    ],
    description:
      "Лимитированная серия из 50 экземпляров. Момент величественного космического явления, застывший навсегда. Создан в 2024 году. Цифровой принт, 30 × 40 см.",
    isSold: false,
    seriesId: "cosmic-series",
  },
  {
    id: "5a",
    name: "Солнечное затмение",
    price: 2800,
    category: "merch",
    subcategory: "Принты",
    images: [
      "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800",
    ],
    description:
      "Дополнение к космической серии. Изображение солнечного затмения с уникальными деталями. Создан в 2024 году. Цифровой принт, 30 × 40 см.",
    isSold: false,
    seriesId: "cosmic-series",
  },
  {
    id: "5b",
    name: "Звездный путь",
    price: 2200,
    category: "merch",
    subcategory: "Принты",
    images: [
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
    ],
    description:
      "Абстрактное изображение звездного пути. Часть космической коллекции. Создан в 2024 году. Цифровой принт, 30 × 40 см.",
    isSold: false,
    seriesId: "cosmic-series",
  },
  {
    id: "6",
    name: "Отражение",
    price: 22000,
    category: "archive",
    images: ["https://images.unsplash.com/photo-1549490349-8643362247b5?w=800"],
    description:
      "Диптих о внутреннем и внешнем мире. Работа нашла свой дом в частной коллекции. Создан в 2023 году. Масло на холсте, 60 × 80 см.",
    isSold: true,
  },
  {
    id: "7",
    name: "Арт-футболка",
    price: 3500,
    category: "merch",
    subcategory: "Одежда",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
    ],
    description:
      "100% органический хлопок. Уникальный принт, созданный вручную. Каждая футболка — как миниатюрная галерея. Доступны размеры: S, M, L, XL.",
    isSold: false,
  },
  {
    id: "8",
    name: "Тетрадь «Мысли»",
    price: 800,
    category: "merch",
    subcategory: "Аксессуары",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800"],
    description:
      "А5, 48 листов премиум бумаги. Дизайнерская обложка с иллюстрацией. Идеальна для записей и зарисовок. Создана в 2024 году.",
    isSold: false,
  },
];

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Cart Context
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

// Navigation
function Navigation() {
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

  const menuItems = [
    { label: "Оригиналы", href: "/originals" },
    { label: "Мерч", href: "/merch" },
    { label: "Индивидуальный заказ", href: "/custom" },
    { label: "Архив", href: "/archive" },
    { label: "О себе", href: "/about" },
    { label: "Контакты", href: "/contacts" },
  ];

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
            {/* Logo */}
            <Link to="/" className="relative group">
              <img
                src="/logo.png"
                alt="SHITSU"
                className="h-8 lg:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
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

            {/* Actions */}
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

      {/* Mobile Menu Overlay */}
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

// Cart Sidebar
function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("post");
  const [address, setAddress] = useState("");

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitted(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full max-w-lg bg-white p-0"
        showCloseButton={false}
      >
        <SheetHeader className="flex flex-row items-center justify-between p-8 border-b border-neutral-200">
          <SheetTitle className="text-xs tracking-[0.15em] uppercase font-normal">
            Ваша корзина
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsOpen(false)}
            className="text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" weight="light" />
          </Button>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <ShoppingBag
                className="w-16 h-16 text-neutral-300 mb-6"
                weight="light"
              />
              <p className="text-lg text-neutral-500 mb-6">
                Ваша корзина пуста
              </p>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="uppercase tracking-widest text-xs"
              >
                Продолжить покупки
              </Button>
            </div>
          ) : orderSubmitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 border border-neutral-900 flex items-center justify-center mb-6">
                <Check className="w-8 h-8" weight="light" />
              </div>
              <h3 className="text-xs uppercase tracking-[0.15em] mb-3">
                Заявка отправлена
              </h3>
              <p className="text-neutral-500 max-w-xs">
                С вами свяжутся в ближайшее время для подтверждения заказа
              </p>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleCheckout} className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                  Способ доставки
                </h3>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={setDeliveryMethod}
                  className="space-y-3"
                >
                  {[
                    { id: "post", label: "Почта России" },
                    { id: "cdek", label: "СДЭК" },
                    { id: "ozon", label: "OZON" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      htmlFor={method.id}
                      className={cn(
                        "flex items-center gap-4 p-4 border cursor-pointer transition-all duration-300",
                        deliveryMethod === method.id
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-400",
                      )}
                    >
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="border-neutral-400 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900 pointer-events-none"
                      />
                      <span className="text-sm tracking-wide">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="address"
                  className="text-xs uppercase tracking-[0.15em] text-neutral-500"
                >
                  Адрес доставки
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом"
                  required
                  className="rounded-none border-neutral-300 focus:border-neutral-900"
                />
              </div>

              <div className="border-t border-neutral-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span className="text-xs uppercase tracking-[0.1em]">
                    Товары ({items.length})
                  </span>
                  <span className="text-xs uppercase tracking-[0.1em]">
                    {total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span className="text-xs uppercase tracking-[0.1em]">
                    Доставка
                  </span>
                  <span className="text-xs uppercase tracking-[0.1em]">
                    Рассчитается
                  </span>
                </div>
                <div className="flex justify-between text-xl pt-3 border-t border-neutral-200">
                  <span className="text-xs uppercase tracking-[0.1em]">
                    Итого
                  </span>
                  <span className="text-xs uppercase tracking-[0.1em]">
                    {total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {address.trim() ? (
                  <a
                    href={createTelegramLink({
                      "":
                        "ЗАКАЗ\n\n" +
                        items
                          .map(
                            (item) =>
                              `${item.name} (${item.quantity} шт.) - ${(item.price * item.quantity).toLocaleString("ru-RU")} ₽`,
                          )
                          .join("\n"),
                      Доставка:
                        deliveryMethod === "post"
                          ? "Почта России"
                          : deliveryMethod === "cdek"
                            ? "СДЭК"
                            : "OZON",
                      Адрес: address,
                      Итого: `${total.toLocaleString("ru-RU")} ₽`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-4 bg-primary text-primary-foreground hover:bg-primary/80 uppercase tracking-[0.1em] text-sm font-medium transition-all"
                  >
                    <TelegramLogo className="w-4 h-4" />
                    Отправить
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-4 bg-neutral-300 text-neutral-500 uppercase tracking-[0.1em] text-sm font-medium cursor-not-allowed"
                  >
                    <TelegramLogo className="w-4 h-4" />
                    Отправить
                  </button>
                )}
                <p className="text-xs text-neutral-400 text-center">
                  Для отправки вы будете перенаправлены в телеграм
                </p>
              </div>
            </form>
          ) : (
            <div className="p-8">
              <div className="space-y-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 pb-6 border-b border-neutral-200 last:border-0"
                  >
                    <div className="w-24 h-24 bg-neutral-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs uppercase tracking-[0.1em] mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-neutral-500 mb-3">
                        {item.price.toLocaleString("ru-RU")} ₽
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          variant="outline"
                          size="icon-sm"
                          className="rounded-none border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          variant="outline"
                          size="icon-sm"
                          className="rounded-none border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="ghost"
                      size="icon-xs"
                      className="text-neutral-300 hover:text-neutral-900 self-start"
                    >
                      <X className="w-4 h-4" weight="light" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !orderSubmitted && !isCheckingOut && (
          <div className="border-t border-neutral-200 p-8 space-y-4">
            <div className="flex justify-between text-2xl">
              <span className="text-xs uppercase tracking-[0.15em]">Итого</span>
              <span className="text-xs uppercase tracking-[0.15em]">
                {total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <Button
              onClick={() => setIsCheckingOut(true)}
              className="w-full uppercase tracking-[0.1em]"
              size="lg"
            >
              Оформить заказ
            </Button>
            <p className="text-xs text-neutral-400 text-center">
              Доставка рассчитывается при оформлении
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Home Page
function HomePage() {
  // Combine originals and merch, exclude sold items
  const collectionProducts = products.filter(
    (p) => (p.category === "originals" || p.category === "merch") && !p.isSold,
  );

  return (
    <div className="min-h-screen">
      {/* Collection Section */}
      <section className="py-32 px-6 lg:px-12 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {collectionProducts.map((product, idx) => (
              <div
                key={product.id}
                className={cn(idx % 5 === 0 && "lg:col-span-2 lg:row-span-2")}
              >
                <ProductCard product={product} featured={idx % 5 === 0} />
              </div>
            ))}
          </div>

          {collectionProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-neutral-400">
                В коллекции пока нет работ
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Product Card
function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { addItem } = useCart();

  return (
    <div className="group">
      <Link to={`/product/${product.id}`}>
        <div
          className={cn(
            "relative overflow-hidden mb-6 bg-neutral-100",
            featured ? "aspect-[3/4]" : "aspect-[4/5]",
          )}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          {product.isSold && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg">
              <img
                src="/headers/sold.png"
                alt="Продано"
                className="h-6 w-auto object-contain"
              />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-all duration-500" />
        </div>
      </Link>

      <div className="space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3
            className={cn(
              "text-neutral-900 group-hover:text-neutral-600 transition-colors uppercase tracking-[0.15em] text-sm",
            )}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg">{product.price.toLocaleString("ru-RU")} ₽</p>
          </div>
          {!product.isSold && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addItem(product)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 uppercase tracking-[0.1em] text-xs"
            >
              В корзину
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Detail Page
function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const { addItem } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Find other products in the same series
  const seriesProducts = product.seriesId
    ? products.filter(
        (p) => p.seriesId === product.seriesId && p.id !== product.id,
      )
    : [];

  const relatedProducts = products.filter(
    (p) =>
      p.category === product.category &&
      p.id !== product.id &&
      !p.isSold &&
      !(product.seriesId && p.seriesId === product.seriesId),
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к коллекции
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-6">
            {/* Main Image with Zoom */}
            <div
              ref={imageContainerRef}
              className={cn(
                "relative aspect-[4/5] bg-neutral-100 overflow-hidden",
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-200",
                  isZoomed && "scale-[2.5]",
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
              />
              {product.isSold && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-lg">
                  <img
                    src="/headers/sold.png"
                    alt="Продано"
                    className="h-8 w-auto object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    onClick={() => setCurrentImage(idx)}
                    className={cn(
                      "w-20 h-20 p-0 overflow-hidden border-2 transition-all duration-300 rounded-none flex-shrink-0",
                      currentImage === idx
                        ? "border-neutral-900"
                        : "border-transparent hover:border-neutral-300",
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-12">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl lg:text-4xl text-neutral-900 mb-4 uppercase tracking-[0.15em]">
                  {product.name}
                </h1>
                <p className="text-3xl text-neutral-900">
                  {product.price.toLocaleString("ru-RU")} ₽
                </p>
              </div>

              {/* Series Variants */}
              {seriesProducts.length > 0 && (
                <div className="py-6 border-y border-neutral-200">
                  <h3 className="text-xs text-neutral-500 mb-4 uppercase tracking-[0.15em]">
                    варианты
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {seriesProducts.map((variant) => (
                      <Link
                        key={variant.id}
                        to={`/product/${variant.id}`}
                        className="group flex-shrink-0"
                      >
                        <div className="relative w-20 h-20 bg-neutral-100 overflow-hidden mb-2">
                          <img
                            src={variant.images[0]}
                            alt={variant.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {variant.isSold && (
                            <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5">
                              <img
                                src="/headers/sold.png"
                                alt="Продано"
                                className="h-3 w-auto object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 max-w-[80px] uppercase tracking-[0.1em]">
                          {variant.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {variant.price.toLocaleString("ru-RU")} ₽
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs mb-4 uppercase tracking-[0.15em] text-neutral-500">
                  О работе
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-4">
                {product.isSold ? (
                  <Button
                    disabled
                    className="w-full uppercase tracking-[0.1em]"
                    size="lg"
                  >
                    Продано
                  </Button>
                ) : (
                  <Button
                    onClick={() => addItem(product)}
                    className="w-full uppercase tracking-[0.1em]"
                    size="lg"
                  >
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Добавить в корзину
                  </Button>
                )}
              </div>

              <div className="pt-6 text-xs text-neutral-500 leading-relaxed">
                <p>Доставка рассчитывается индивидуально.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-sm text-neutral-500 mb-12 uppercase tracking-[0.15em]">
              Похожие работы
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Category Page
function CategoryPage({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  const categoryProducts = products.filter(
    (p) => p.category === category || (category === "all" && !p.isSold),
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <HeaderImage
            src={
              category === "originals"
                ? "/headers/originals.png"
                : category === "merch"
                  ? "/headers/merch.png"
                  : "/headers/archive.png"
            }
            alt={title}
            className="h-14 lg:h-20 w-auto object-contain mx-auto mb-6"
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            {title}
          </h1>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {categoryProducts.map((product, idx) => (
            <div
              key={product.id}
              className={cn(idx % 5 === 0 && "lg:col-span-2 lg:row-span-2")}
            >
              <ProductCard product={product} featured={idx % 5 === 0} />
            </div>
          ))}
        </div>

        {categoryProducts.length === 0 && (
          <div className="text-center py-32">
            <p className="text-2xl text-neutral-400">
              В этой категории пока нет работ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Order Page
function CustomPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    concept: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="/headers/custom-order.png"
            alt="Индивидуальный заказ"
            className="h-16 lg:h-24 w-auto mx-auto mb-6 block"
            style={{ maxWidth: "100%", minWidth: "200px" }}
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            Индивидуальный заказ
          </h1>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-neutral-50 p-8 text-center">
            <Sparkle
              className="w-8 h-8 text-neutral-400 mx-auto mb-4"
              weight="light"
            />
            <h3 className="text-sm mb-2 uppercase tracking-[0.15em]">
              Диджитал арт
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">
              От 3 000 ₽
            </p>
            <p className="text-sm text-neutral-600">
              Цифровые иллюстрации, принты, графика
            </p>
          </div>
          <div className="bg-neutral-50 p-8 text-center">
            <PaintBrush
              className="w-8 h-8 text-neutral-400 mx-auto mb-4"
              weight="light"
            />
            <h3 className="text-sm mb-2 uppercase tracking-[0.15em]">
              Рисунок на холсте
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">
              От 5 000 ₽
            </p>
            <p className="text-sm text-neutral-600">
              Акрил, масло, смешанная техника
            </p>
          </div>
          <div className="bg-neutral-900 p-8 text-center text-white">
            <Heart
              className="w-8 h-8 text-neutral-400 mx-auto mb-4"
              weight="light"
            />
            <h3 className="text-sm mb-2 uppercase tracking-[0.15em]">
              Консультация
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Бесплатно
            </p>
            <p className="text-sm text-neutral-400">
              Подбор техники, цветов, размера
            </p>
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="max-w-lg mx-auto text-center py-20 bg-neutral-50">
            <div className="w-16 h-16 border border-neutral-900 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8" weight="light" />
            </div>
            <h2 className="text-sm mb-4 uppercase tracking-[0.15em]">
              Заявка отправлена
            </h2>
            <p className="text-neutral-600">
              Спасибо за ваше доверие. Я свяжусь с вами в ближайшее время.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="concept"
                className="text-xs uppercase tracking-[0.15em] text-neutral-500"
              >
                Расскажите о своей идее
              </Label>
              <Textarea
                id="concept"
                value={formData.concept}
                onChange={(e) =>
                  setFormData({ ...formData, concept: e.target.value })
                }
                placeholder="Что бы вы хотели видеть? Опишите цвета, настроение, размер..."
                rows={6}
                required
                className="rounded-none border-neutral-300 focus:border-neutral-900 resize-none"
              />
            </div>

            <div className="space-y-2">
              {formData.concept.trim() ? (
                <a
                  href={createTelegramLink({
                    "": `ИНДИВИДУАЛЬНЫЙ ЗАКАЗ\n\n${formData.concept}`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-4 bg-primary text-primary-foreground hover:bg-primary/80 uppercase tracking-[0.1em] text-sm font-medium transition-all"
                >
                  <TelegramLogo className="w-4 h-4" />
                  Отправить
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-4 bg-neutral-300 text-neutral-500 uppercase tracking-[0.1em] text-sm font-medium cursor-not-allowed"
                >
                  <TelegramLogo className="w-4 h-4" />
                  Отправить
                </button>
              )}
              <p className="text-xs text-neutral-400 text-center">
                Для отправки вы будете перенаправлены в телеграм
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// About Page
function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const windowHeight = window.innerHeight;
        // Calculate progress from 0 to 1 as section scrolls through viewport
        const progress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - sectionTop) / (windowHeight + rect.height),
          ),
        );
        setScrollY(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate sticker transform based on scroll
  const stickerProgress = Math.min(1, Math.max(0, (scrollY - 0.2) * 1.5));
  const stickerY = 100 - stickerProgress * 100; // Start at 100% (below), end at 0%
  const stickerRotate = -15 + stickerProgress * 15; // Start at -15deg, end at 0deg
  const stickerScale = 0.8 + stickerProgress * 0.2; // Start smaller, grow to full

  return (
    <div
      ref={sectionRef}
      className="min-h-screen pt-32 pb-20 relative overflow-hidden"
    >
      {/* Header Image - Sticker Effect */}
      <div
        className="fixed right-[5%] bottom-0 z-10 pointer-events-none"
        style={{
          transform: `translateY(${stickerY}%) rotate(${stickerRotate}deg) scale(${stickerScale})`,
          transition: "none",
          width: "clamp(380px, 50vw, 600px)",
          opacity: stickerProgress > 0 ? 1 : 0,
        }}
      >
        <img
          src="/artist.png"
          alt="Кира"
          className="w-full h-auto drop-shadow-2xl"
          style={{
            filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.25))",
          }}
        />
      </div>

      <div className="max-w-[900px] mx-auto px-6 lg:px-12 relative z-0">
        {/* Title */}
        <HeaderImage
          src="/headers/about.png"
          alt="Обо мне"
          className="h-14 lg:h-20 w-auto object-contain mb-12 mx-auto"
        />
        <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase mb-12">
          Обо мне
        </h1>

        {/* Full-width Text Content */}
        <div className="space-y-8 text-neutral-600 leading-relaxed text-lg">
          <p className="text-xl text-neutral-900 font-medium">
            Еще с детства мне было проще передавать свои чувства через холст,
            нежели простыми словами.
          </p>

          <p>
            Я впервые взяла в руки кисть будучи еще маленьким и ничего не
            понимающим в этом мире человеком. Сейчас я уже совсем не ребенок, а
            в жизни так до конца и не разобралась. Но мое творчество помогает
            мне каждый день понимать что-то большее и показывать это окружающим
            меня людям.
          </p>

          <div className="py-8 border-y border-neutral-200 my-8">
            <p className="text-neutral-900 italic text-xl">
              "В этом, отчасти, и есть моя цель — создавать картины, которые
              помогают людям видеть эту жизнь и наслаждаться ей."
            </p>
          </div>

          <p>
            Я не гонюсь за модой, за свежими видениями и инновациями. Просто
            хочу чтобы мои работы передавали красоту, глазами смотрящего.
            Изображая те вещи, которые хочу отразить в своей памяти и подарить
            наблюдателям те же чувства.
          </p>

          <p>
            Так же, как в подростковом возрасте, загораются глаза при виде своей
            первой любви, мои глаза загорелись при изучении Японии. Я вижу
            невероятные краски в этой стране и ее культуре, что очень часто
            отражается в моих работах.
          </p>

          <p className="text-neutral-900">
            Я приглашаю своих сторонников, видящих яркими цветами эту жизнь,
            даже в ее темные моменты, присоединиться к моему творчеству. Ведь я
            влюблена в него и хочу разделить его с вами.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="flex justify-center gap-4">
            {[
              {
                icon: InstagramLogo,
                href: "https://instagram.com/shitsu_kira",
                label: "Instagram",
              },
              {
                icon: TiktokLogo,
                href: "https://www.tiktok.com/@_shitsu",
                label: "TikTok",
              },
              {
                icon: TelegramLogo,
                href: "https://t.me/shitsu_art",
                label: "Telegram",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 border border-neutral-300 flex items-center justify-center group-hover:border-neutral-900 transition-colors">
                  <Icon className="w-6 h-6" weight="light" />
                </div>
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-500">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Contacts Page
function ContactsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="/headers/contacts.png"
            alt="Контакты"
            className="h-14 lg:h-20 w-auto object-contain mx-auto mb-6"
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            Контакты
          </h1>
          <p className="inline-flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="w-4 h-4" weight="light" />
            Москва, Россия
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a
            href="mailto:shitsu2319@gmail.com"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <Envelope
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Email
            </p>
            <p className="text-xl">shitsu2319@gmail.com</p>
          </a>

          <a
            href="https://instagram.com/shitsu_kira"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <InstagramLogo
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Instagram
            </p>
            <p className="text-xl">@shitsu_kira</p>
          </a>

          <a
            href="https://www.tiktok.com/@_shitsu"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <TiktokLogo
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              TikTok
            </p>
            <p className="text-xl">@_shitsu</p>
          </a>

          <a
            href="https://t.me/kira_kirschtein"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <TelegramLogo
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Telegram
            </p>
            <p className="text-xl">@kira_kirschtein</p>
          </a>
        </div>
      </div>
    </div>
  );
}

// Delivery Page
function DeliveryPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="/headers/delivery.png"
            alt="Доставка и оплата"
            className="h-14 lg:h-20 w-auto object-contain mx-auto mb-6"
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            Доставка и оплата
          </h1>
        </div>

        <div className="space-y-12">
          <div className="bg-neutral-50 p-10">
            <div className="flex items-center gap-4 mb-6">
              <Package className="w-8 h-8 text-neutral-400" weight="light" />
              <h2 className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                Доставка
              </h2>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                Доставка осуществляется по 100% предоплате после заполнения
                заявки.
              </p>
              <p className="font-medium text-neutral-900">Доступные способы:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-neutral-900" />
                  Почта России
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-neutral-900" />
                  СДЭК
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-neutral-900" />
                  OZON
                </li>
              </ul>
              <p>
                Срок доставки: от 3 до 7 рабочих дней. Точная стоимость
                рассчитывается индивидуально при оформлении заказа.
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 p-10">
            <div className="flex items-center gap-4 mb-6">
              <CreditCard className="w-8 h-8 text-neutral-400" weight="light" />
              <h2 className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                Оплата
              </h2>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              После оформления заказа я свяжусь с вами для подтверждения деталей
              и предоставления реквизитов для оплаты. Принимаю переводы на карту
              или электронные кошельки.
            </p>
          </div>

          <div className="bg-neutral-50 p-10">
            <div className="flex items-center gap-4 mb-6">
              <ArrowsClockwise
                className="w-8 h-8 text-neutral-400"
                weight="light"
              />
              <h2 className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                Возврат
              </h2>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Возврат возможен в течение 14 дней с момента получения заказа.
              Товар должен быть в оригинальном состоянии. Стоимость обратной
              доставки оплачивается покупателем.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-12 flex flex-col md:flex-row md:items-start justify-between gap-10">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="group">
              <img
                src="/logo.png"
                alt="SHITSU"
                className="h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <img
              src="/headers/name.png"
              alt=""
              className="h-5 w-auto object-contain opacity-70 mx-auto"
            />
          </div>

          {/* Navigation Grid */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-300 font-medium">
                Коллекция
              </span>
              <div className="flex flex-col gap-2">
                <Link
                  to="/originals"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Оригиналы
                </Link>
                <Link
                  to="/merch"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Мерч
                </Link>
                <Link
                  to="/archive"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Архив
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-300 font-medium">
                Информация
              </span>
              <div className="flex flex-col gap-2">
                <Link
                  to="/about"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  О себе
                </Link>
                <Link
                  to="/contacts"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Контакты
                </Link>
                <Link
                  to="/delivery"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Доставка
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[
              {
                icon: InstagramLogo,
                href: "https://instagram.com/shitsu_kira",
                label: "Instagram",
              },
              {
                icon: TiktokLogo,
                href: "https://www.tiktok.com/@_shitsu",
                label: "TikTok",
              },
              {
                icon: TelegramLogo,
                href: "https://t.me/kira_kirschtein",
                label: "Telegram",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-300"
              >
                <Icon className="w-4 h-4" weight="light" />
              </a>
            ))}
          </div>

          {/* Credits */}
          <a
            href="https://mkeverything.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors tracking-wide"
          >
            разработка сайта mkeverything
          </a>
        </div>
      </div>
    </footer>
  );
}

// Main App
export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <ScrollToTop />
        <Navigation />
        <main>
          <Routes>
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
              element={<CategoryPage category="archive" title="Архив" />}
            />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/custom" element={<CustomPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
