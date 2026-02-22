import { useState } from "react";
import {
  Sparkle,
  PaintBrush,
  Heart,
  TelegramLogo,
  Check,
} from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HeaderImage } from "@/components/HeaderImage";
import { createTelegramLink } from "@/lib/telegram";
import { SEO } from "@/components/SEO";

export function CustomPage() {
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
      <SEO page="custom" />
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="./headers/custom-order.webp"
            alt="Индивидуальный заказ"
            className="h-16 lg:h-24 w-auto mx-auto mb-6 block"
            style={{ maxWidth: "100%", minWidth: "200px" }}
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            Индивидуальный заказ
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-neutral-50 p-8 text-center">
            <Sparkle
              className="w-8 h-8 text-neutral-400 mx-auto mb-4"
              weight="light"
            />
            <h3 className="text-sm mb-2 uppercase tracking-[0.15em]">
              Диджитал арт
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
              От 3 000 ₽
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
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
              От 5 000 ₽
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
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400">
              Бесплатно
            </p>
          </div>
        </div>

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
