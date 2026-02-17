import { useState } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  TelegramLogo,
  Check,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { getImageUrl, cn } from "@/lib/utils";
import { createTelegramLink } from "@/lib/telegram";

export function CartSidebar() {
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
                    key={item._id}
                    className="flex gap-6 pb-6 border-b border-neutral-200 last:border-0"
                  >
                    <div className="w-24 h-24 bg-neutral-100 overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.images[0])}
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
                            updateQuantity(item._id, item.quantity - 1)
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
                            updateQuantity(item._id, item.quantity + 1)
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
                      onClick={() => removeItem(item._id)}
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
