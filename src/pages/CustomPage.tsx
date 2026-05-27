import { useState } from "react";
import {
  Sparkle,
  PaintBrush,
  Heart,
  TelegramLogo,
} from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HeaderImage } from "@/components/HeaderImage";
import { createTelegramLink } from "@/lib/telegram";
import { SEO } from "@/components/SEO";

const SERVICES = [
  { icon: Sparkle, title: "Диджитал арт", price: "От 3 000 ₽", dark: false },
  { icon: PaintBrush, title: "Рисунок на холсте", price: "От 5 000 ₽", dark: false },
  { icon: Heart, title: "Консультация", price: "Бесплатно", dark: true },
] as const;

export function CustomPage() {
  const [concept, setConcept] = useState("");

  const canSubmit = concept.trim().length > 0;
  const telegramLink = canSubmit
    ? createTelegramLink({ "": `ИНДИВИДУАЛЬНЫЙ ЗАКАЗ\n\n${concept}` })
    : undefined;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <SEO page="custom" />
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="/headers/custom-order.webp"
            alt="Индивидуальный заказ"
            className="w-full h-16 lg:h-24 object-contain mx-auto mb-6 block"
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            Индивидуальный заказ
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {SERVICES.map(({ icon: Icon, title, price, dark }) => (
            <div
              key={title}
              className={`p-8 text-center ${dark ? "bg-neutral-900 text-white" : "bg-neutral-50"}`}
            >
              <Icon
                className={`w-8 h-8 mx-auto mb-4 ${dark ? "text-neutral-400" : "text-neutral-400"}`}
                weight="light"
              />
              <h3 className="text-sm mb-2 uppercase tracking-[0.15em]">
                {title}
              </h3>
              <p
                className={`text-xs tracking-[0.2em] uppercase ${dark ? "text-neutral-400" : "text-neutral-500"}`}
              >
                {price}
              </p>
            </div>
          ))}
        </div>

        <form className="max-w-lg mx-auto space-y-8">
          <div className="space-y-3">
            <Label
              htmlFor="concept"
              className="text-xs uppercase tracking-[0.15em] text-neutral-500"
            >
              Расскажите о своей идее
            </Label>
            <Textarea
              id="concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Что бы вы хотели видеть? Опишите цвета, настроение, размер..."
              rows={6}
              required
              className="rounded-none border-neutral-300 focus:border-neutral-900 resize-none"
            />
          </div>

          <div className="space-y-2">
            {canSubmit ? (
              <a
                href={telegramLink}
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
      </div>
    </div>
  );
}
