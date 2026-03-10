import { Package, CreditCard, ArrowsClockwise } from "@phosphor-icons/react";
import { HeaderImage } from "@/components/HeaderImage";
import { SEO } from "@/components/SEO";

export function DeliveryPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-6 lg:px-12">
      <SEO page="delivery" />
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 mb-4 md:mb-6">
            <HeaderImage
              src="./headers/delivery.webp"
              alt="Доставка и оплата"
              className="h-[min(3.5rem,10vw)] lg:h-[min(5rem,6vw)] w-auto object-contain"
            />
            <HeaderImage
              src="./headers/returns.webp"
              alt="Возврат"
              className="h-[min(3.5rem,10vw)] lg:h-[min(5rem,6vw)] w-auto object-contain"
            />
          </div>
          <h1 className="sr-only">Доставка и оплата</h1>
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
              После оформления заказа с вами свяжутся для подтверждения деталей
              и предоставления реквизитов для оплаты.
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
