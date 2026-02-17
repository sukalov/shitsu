import { Package, CreditCard, ArrowsClockwise } from "@phosphor-icons/react";
import { HeaderImage } from "@/components/HeaderImage";

export function DeliveryPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="./headers/delivery.png"
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
