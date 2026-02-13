import { useState, createContext, useContext, useEffect } from "react";
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
  ArrowRight,
  Check,
  Envelope,
  Package,
  CreditCard,
  ArrowsClockwise,
  Sparkle,
  PaintBrush,
  Heart,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  series?: string;
  year?: string;
  medium?: string;
  size?: string;
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
    ],
    description:
      "Абстрактная композиция, исследующая тему времени и трансформации. Работа погружает зрителя в медитативное состояние, приглашая к созерцанию мимолётности момента.",
    isSold: false,
    year: "2024",
    medium: "Акрил на холсте",
    size: "40 × 50 см",
  },
  {
    id: "2",
    name: "Полуночный сад",
    price: 12000,
    category: "originals", // originals or merch
    images: ["https://images.unsplash.com/photo-1549887534-1541e9326642?w=800"],
    description:
      "Ночной пейзаж с элементами сюрреализма. Тайный мир, открывающийся только в темноте, полный мистики и неожиданных открытий.",
    isSold: false, // true or false
    year: "2024", // delete
    medium: "Масло на холсте", // delete
    size: "30 × 40 см", // delete
  },
  {
    id: "3",
    name: "Хаос и порядок",
    price: 18000,
    category: "originals",
    images: ["https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800"],
    description:
      "Исследование противопоставления структуры и хаоса. В каждом беспорядке скрыта гармония, ожидающая своего открытия.",
    isSold: false,
    year: "2023",
    medium: "Смешанная техника",
    size: "50 × 60 см",
  },
  {
    id: "4",
    name: "Звёздная пыль",
    price: 2500,
    category: "merch",
    subcategory: "Принты",
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    ],
    description:
      "Цифровой принт на бумаге премиум качества. Каждый принт подписан автором и имеет сертификат подлинности.",
    isSold: false,
    series: "Космическая серия",
    year: "2024",
    medium: "Цифровой принт",
    size: "30 × 40 см",
  },
  {
    id: "5",
    name: "Лунное затмение",
    price: 2500,
    category: "merch",
    subcategory: "Принты",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800",
    ],
    description:
      "Лимитированная серия из 50 экземпляров. Момент величественного космического явления, застывший навсегда.",
    isSold: false,
    series: "Космическая серия",
    year: "2024",
    medium: "Цифровой принт",
    size: "30 × 40 см",
  },
  {
    id: "6",
    name: "Отражение",
    price: 22000,
    category: "archive",
    images: ["https://images.unsplash.com/photo-1549490349-8643362247b5?w=800"],
    description:
      "Диптих о внутреннем и внешнем мире. Работа нашла свой дом в частной коллекции.",
    isSold: true,
    year: "2023",
    medium: "Масло на холсте",
    size: "60 × 80 см",
  },
  {
    id: "7",
    name: "Арт-футболка",
    price: 3500,
    category: "merch",
    subcategory: "Одежда",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    ],
    description:
      "100% органический хлопок. Уникальный принт, созданный вручную. Каждая футболка — как миниатюрная галерея.",
    isSold: false,
    year: "2024",
    medium: "Органический хлопок",
    size: "S, M, L, XL",
  },
  {
    id: "8",
    name: "Тетрадь «Мысли»",
    price: 800,
    category: "merch",
    subcategory: "Аксессуары",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800"],
    description:
      "А5, 48 листов премиум бумаги. Дизайнерская обложка с иллюстрацией. Идеальна для записей и зарисовок.",
    isSold: false,
    year: "2024",
    medium: "Бумага премиум класса",
    size: "А5",
  },
];

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
    window.addEventListener("scroll", handleScroll);
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
              <span className="text-2xl lg:text-3xl tracking-[0.15em] font-bold text-neutral-900">
                SHITSU
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neutral-900 transition-all duration-500 group-hover:w-full" />
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
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" weight="light" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 text-[10px] text-white flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-neutral-900"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" weight="light" />
                ) : (
                  <List className="w-6 h-6" weight="light" />
                )}
              </button>
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
  const [phone, setPhone] = useState("");

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitted(true);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-neutral-200">
          <h2 className="text-xl tracking-wide">Ваша корзина</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" weight="light" />
          </button>
        </div>

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
              <h3 className="text-2xl mb-3">Заявка отправлена</h3>
              <p className="text-neutral-500 max-w-xs">
                С вами свяжутся в ближайшее время для подтверждения заказа
              </p>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleCheckout} className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg">Способ доставки</h3>
                <div className="space-y-3">
                  {[
                    { id: "post", label: "Почта России" },
                    { id: "cdek", label: "СДЭК" },
                    { id: "ozon", label: "OZON" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-4 p-4 border cursor-pointer transition-all duration-300",
                        deliveryMethod === method.id
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-400",
                      )}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={method.id}
                        checked={deliveryMethod === method.id}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-4 h-4 accent-neutral-900"
                      />
                      <span className="text-sm tracking-wide">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="address">Адрес доставки</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом"
                  required
                  className="rounded-none border-neutral-300 focus:border-neutral-900"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone">Контактный телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  required
                  className="rounded-none border-neutral-300 focus:border-neutral-900"
                />
              </div>

              <div className="border-t border-neutral-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Товары ({items.length})</span>
                  <span>{total.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Доставка</span>
                  <span>Рассчитается</span>
                </div>
                <div className="flex justify-between text-xl pt-3 border-t border-neutral-200">
                  <span>Итого</span>
                  <span>{total.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Отправить заявку
              </Button>
              <p className="text-xs text-neutral-400 text-center">
                Заявка будет отправлена в Telegram @shitsu_zakaz
              </p>
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
                      <h4 className="text-lg mb-1">{item.name}</h4>
                      <p className="text-sm text-neutral-500 mb-3">
                        {item.price.toLocaleString("ru-RU")} ₽
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          variant="square"
                          size="icon-sm"
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
                          variant="square"
                          size="icon-sm"
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
          <div className="border-t border-neutral-200 p-8 space-y-6">
            <div className="flex justify-between text-2xl">
              <span>Итого</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
            <Button
              onClick={() => setIsCheckingOut(true)}
              className="w-full"
              size="lg"
            >
              Оформить заказ
            </Button>
            <p className="text-xs text-neutral-400 text-center">
              Доставка рассчитывается при оформлении
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Home Page
function HomePage() {
  const featuredProducts = products.filter((p) => !p.isSold).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1549887534-1541e9326642?w=1600"
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6 animate-fade-in-up">
              Кира — художница
            </p>
            <h1 className="text-6xl lg:text-8xl text-neutral-900 mb-8 leading-[0.9] tracking-tight animate-fade-in-up delay-100">
              SHITSU
            </h1>
            <p className="text-lg text-neutral-600 mb-10 max-w-md leading-relaxed animate-fade-in-up delay-200">
              Оригинальные работы и принты, созданные с любовью к деталям.
              Каждое произведение — это история, ожидающая своего места в вашем
              пространстве.
            </p>
            <div className="flex gap-4 animate-fade-in-up delay-300">
              <Link to="/originals">
                <Button size="lg" className="rounded-full px-8">
                  Смотреть коллекцию
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                >
                  Обо мне
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400">
          <span className="text-[10px] tracking-[0.3em] uppercase">
            Листайте
          </span>
          <div className="w-[1px] h-12 bg-neutral-300 animate-pulse" />
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-32 px-6 lg:px-12 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
            <div className="lg:col-span-8">
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
                Избранное
              </p>
              <h2 className="text-4xl lg:text-5xl text-neutral-900">
                Новые работы
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                to="/originals"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors elegant-underline"
              >
                Смотреть все работы
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                className={cn(
                  "group",
                  idx === 0 && "lg:col-span-2 lg:row-span-2",
                )}
              >
                <ProductCard product={product} featured={idx === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-3xl lg:text-5xl text-neutral-900 leading-relaxed mb-8">
            «Искусство — это не то, что вы видите,
            <br />
            <span className="text-neutral-400">
              а то, что вы заставляете других увидеть»
            </span>
          </p>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500">
            — Эдгар Дега
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 px-6 lg:px-12 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4 text-center">
            Коллекции
          </p>
          <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-20 text-center">
            Исследуйте мир SHITSU
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CategoryCard
              title="Оригиналы"
              subtitle="Уникальные произведения"
              description="Каждая работа создана вручную и существует в единственном экземпляре. Оригиналы для ценителей настоящего искусства."
              image="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800"
              href="/originals"
            />
            <CategoryCard
              title="Мерч"
              subtitle="Принты и аксессуары"
              description="Лимитированные принты, одежда и предметы с авторским дизайном. Искусство, которое можно взять с собой."
              image="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"
              href="/merch"
            />
            <CategoryCard
              title="Индивидуальный заказ"
              subtitle="Создадим вместе"
              description="Ваша идея, мои кисти. Расскажите о своём видении, и я воплощу его в уникальном произведении искусства."
              image="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800"
              href="/custom"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 px-6 lg:px-12 bg-neutral-900 text-white">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4">
            Будьте в курсе
          </p>
          <h2 className="text-3xl lg:text-4xl mb-6">
            Подпишитесь на обновления
          </h2>
          <p className="text-neutral-400 mb-10 max-w-md mx-auto">
            Получайте уведомления о новых работах, эксклюзивных предложениях и
            вдохновении прямо на почту.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Ваш email"
              className="flex-1 rounded-full bg-white/10 border-white/20 text-white placeholder:text-neutral-500 focus:border-white"
            />
            <Button className="whitespace-nowrap rounded-full bg-white text-neutral-900 hover:bg-neutral-200">
              Подписаться
            </Button>
          </form>
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
            <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
              <Badge variant="sold" className="text-sm">
                Продано
              </Badge>
            </div>
          )}
          {product.series && !product.isSold && (
            <div className="absolute top-4 left-4">
              <Badge variant="series">{product.series}</Badge>
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
              "text-neutral-900 group-hover:text-neutral-600 transition-colors",
              featured ? "text-2xl" : "text-lg",
            )}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-neutral-500">{product.medium}</p>
            <p className="text-lg">{product.price.toLocaleString("ru-RU")} ₽</p>
          </div>
          {!product.isSold && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addItem(product)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              В корзину
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Category Card
function CategoryCard({
  title,
  subtitle,
  description,
  image,
  href,
}: {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
}) {
  return (
    <Link to={href} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-neutral-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-300 mb-2">
            {subtitle}
          </p>
          <h3 className="text-3xl text-white mb-2">{title}</h3>
        </div>
      </div>
      <p className="text-neutral-600 leading-relaxed text-sm">{description}</p>
    </Link>
  );
}

// Product Detail Page
function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const { addItem } = useCart();
  const [currentImage, setCurrentImage] = useState(0);

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id && !p.isSold,
  );

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
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isSold && (
                <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
                  <Badge variant="sold" className="text-lg">
                    Продано
                  </Badge>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={cn(
                      "w-20 h-20 overflow-hidden border-2 transition-all duration-300",
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
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-12">
            <div className="space-y-8">
              <div>
                {product.series && (
                  <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
                    {product.series}
                  </p>
                )}
                <h1 className="text-4xl lg:text-5xl text-neutral-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-3xl text-neutral-900">
                  {product.price.toLocaleString("ru-RU")} ₽
                </p>
              </div>

              <div className="space-y-4 py-8 border-y border-neutral-200">
                {product.year && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Год создания</span>
                    <span>{product.year}</span>
                  </div>
                )}
                {product.medium && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Техника</span>
                    <span>{product.medium}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Размер</span>
                    <span>{product.size}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl mb-4">О работе</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-4">
                {product.isSold ? (
                  <Button disabled className="w-full" size="lg">
                    Продано
                  </Button>
                ) : (
                  <Button
                    onClick={() => addItem(product)}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Добавить в корзину
                  </Button>
                )}
              </div>

              <div className="pt-6 text-xs text-neutral-500 leading-relaxed">
                <p>
                  Доставка рассчитывается индивидуально. После оформления заказа
                  мы свяжемся с вами для уточнения деталей.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="text-3xl text-neutral-900 mb-12">Похожие работы</h2>
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
  description,
}: {
  category: string;
  title: string;
  description: string;
}) {
  const categoryProducts = products.filter(
    (p) => p.category === category || (category === "all" && !p.isSold),
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Коллекция
          </p>
          <h1 className="text-5xl lg:text-7xl text-neutral-900 mb-6">
            {title}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            {description}
          </p>
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
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Услуги
          </p>
          <h1 className="text-5xl lg:text-6xl text-neutral-900 mb-6">
            Индивидуальный заказ
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Ваша идея достойна воплощения. Расскажите мне о своём видении, и мы
            создадим что-то уникальное вместе.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-neutral-50 p-8 text-center">
            <Sparkle
              className="w-8 h-8 text-neutral-400 mx-auto mb-4"
              weight="light"
            />
            <h3 className="text-xl mb-2">Диджитал арт</h3>
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
            <h3 className="text-xl mb-2">Рисунок на холсте</h3>
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
            <h3 className="text-xl mb-2">Консультация</h3>
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
            <h2 className="text-3xl mb-4">Заявка отправлена</h2>
            <p className="text-neutral-600">
              Спасибо за ваше доверие. Я свяжусь с вами в ближайшее время.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-8">
            <div className="space-y-3">
              <Label htmlFor="concept" className="text-lg">
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

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-lg">
                Номер для связи
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+7 (___) ___-__-__"
                required
                className="rounded-none border-neutral-300 focus:border-neutral-900"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Отправить заявку
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// About Page
function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 lg:order-1">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">
              Обо мне
            </p>
            <h1 className="text-5xl lg:text-6xl text-neutral-900 mb-8">
              Привет!
              <br />Я художница SHITSU
            </h1>
            <div className="space-y-6 text-neutral-600 leading-relaxed">
              <p>
                Еще с детства мне было проще передавать свои чувства через
                холст, нежели простыми словами. Я впервые взяла в руки кисть
                будучи еще маленьким и ничего не понимающим в этом мире
                человеком. Сейчас я уже совсем не ребенок, а в жизни так до
                конца и не разобралась. Но мое творчество помогает мне каждый
                день понимать что-то большее и показывать это окружающим меня
                людям.
              </p>
              <p>
                В этом, отчасти, и есть моя цель. Создавать картины, которые
                помогают людям видеть эту жизнь и наслаждаться ей. Я не гонюсь
                за модой, за свежими видениями и инновациями. Просто хочу чтобы
                мои работы передавали красоту, глазами смотрящего. Изображая те
                вещи, которые хочу отразить в своей памяти и подарить
                наблюдателям те же чувства.
              </p>
              <p>
                Так же, как в подростковом возрасте, загораются глаза при виде
                своей первой любви, мои глаза загорелись при изучении Японии. Я
                вижу невероятные краски в этой стране и ее культуре, что очень
                часто отражается в моих работах, как дополнение к передачи
                ощущений.
              </p>
              <p>
                Я приглашаю своих сторонников, видящих яркими цветами эту жизнь,
                даже в ее темные моменты, присоединиться к моему творчеству.
                Ведь я влюблена в него и хочу разделить его с вами. Я никогда не
                останавливаюсь в развитии своего мастерства, так что скучно
                точно не будет. Но будут чувства, эмоции, которые нам всем
                иногда бывает так тяжело выразить словами.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
                alt="Кира"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8">
            Следите за мной
          </p>
          <div className="flex justify-center gap-6">
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
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Связь
          </p>
          <h1 className="text-5xl lg:text-6xl text-neutral-900 mb-6">
            Контакты
          </h1>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">
            Всегда открыта для общения, сотрудничества и новых проектов
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
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Информация
          </p>
          <h1 className="text-5xl lg:text-6xl text-neutral-900 mb-6">
            Доставка и оплата
          </h1>
        </div>

        <div className="space-y-12">
          <div className="bg-neutral-50 p-10">
            <div className="flex items-center gap-4 mb-6">
              <Package className="w-8 h-8 text-neutral-400" weight="light" />
              <h2 className="text-2xl">Доставка</h2>
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
              <h2 className="text-2xl">Оплата</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              После оформления заказа я свяжусь с вами для подтверждения деталей
              и предоставления реквизитов для оплаты. Принимаю переводы на карту
              или электронные кошельки.
            </p>
          </div>

          <div className="bg-neutral-900 text-white p-10">
            <div className="flex items-center gap-4 mb-6">
              <ArrowsClockwise
                className="w-8 h-8 text-neutral-400"
                weight="light"
              />
              <h2 className="text-2xl">Возврат</h2>
            </div>
            <p className="text-neutral-400 leading-relaxed">
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
    <footer className="border-t border-neutral-200 py-16 px-6 lg:px-12 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl tracking-[0.1em] font-bold text-neutral-900">
                SHITSU
              </span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
              Кира — художница. Оригинальные работы, принты и мерч, созданные с
              любовью к искусству.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Навигация
            </p>
            <div className="space-y-3">
              {[
                { label: "Оригиналы", href: "/originals" },
                { label: "Мерч", href: "/merch" },
                { label: "Индивидуальный заказ", href: "/custom" },
                { label: "Архив", href: "/archive" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Информация
            </p>
            <div className="space-y-3">
              {[
                { label: "О себе", href: "/about" },
                { label: "Контакты", href: "/contacts" },
                { label: "Доставка", href: "/delivery" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-neutral-200">
          <p className="text-xs text-neutral-400">
            © 2025 SHITSU. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            {[
              {
                icon: InstagramLogo,
                href: "https://instagram.com/shitsu_kira",
              },
              { icon: TiktokLogo, href: "https://www.tiktok.com/@_shitsu" },
              { icon: TelegramLogo, href: "https://t.me/kira_kirschtein" },
            ].map(({ icon: Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <Icon className="w-5 h-5" weight="light" />
              </a>
            ))}
          </div>
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
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/originals"
              element={
                <CategoryPage
                  category="originals"
                  title="Оригиналы"
                  description="Уникальные авторские работы в единственном экземпляре. Каждое произведение — это частичка души художника, готовая найти своё место в вашем пространстве."
                />
              }
            />
            <Route
              path="/merch"
              element={
                <CategoryPage
                  category="merch"
                  title="Мерч"
                  description="Принты, одежда и аксессуары с авторским дизайном. Искусство, которое можно взять с собой или подарить близкому человеку."
                />
              }
            />
            <Route
              path="/archive"
              element={
                <CategoryPage
                  category="archive"
                  title="Архив"
                  description="Проданные работы из прошлых коллекций. Арт-история SHITSU — от первых шагов до настоящего времени."
                />
              }
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
