import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrders, useUpdateOrderStatus, useOrderCount } from "@/lib/hooks";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { AdminTableSkeleton } from "@/components/loading-states";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Новый",
  confirmed: "Подтверждён",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-neutral-100 text-neutral-500",
};

export function AdminOrders() {
  const orders = useOrders();
  const orderCount = useOrderCount();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders?.filter(
    (order) => filter === "all" || order.status === filter,
  );

  const handleStatusChange = (orderId: Id<"orders">, status: OrderStatus) => {
    void updateStatus({ id: orderId, status });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl uppercase tracking-[0.15em]">Заказы</h1>

        {orderCount && (
          <div className="flex gap-4 text-sm">
            <span className="text-yellow-700">{orderCount.pending} новых</span>
            <span className="text-blue-700">
              {orderCount.confirmed} подтверждено
            </span>
            <span className="text-purple-700">
              {orderCount.shipped} отправлено
            </span>
            <span className="text-green-700">
              {orderCount.delivered} доставлено
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 text-sm uppercase tracking-wider transition-colors",
            filter === "all"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
          )}
        >
          Все
        </button>
        {(Object.keys(statusLabels) as OrderStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              "px-4 py-2 text-sm uppercase tracking-wider transition-colors",
              filter === status
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
            )}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {!orders ? (
        <AdminTableSkeleton rows={5} cols={4} />
      ) : !filteredOrders || filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white">
          <p className="text-neutral-500">Заказов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg uppercase tracking-wider">
                      Заказ {order._id.slice(-8)}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs",
                        order.status
                          ? statusColors[order.status]
                          : statusColors.pending,
                      )}
                    >
                      {order.status ? statusLabels[order.status] : "Новый"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>
                <p className="text-xl font-medium">
                  {order.total.toLocaleString("ru-RU")} ₽
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Покупатель
                  </h4>
                  <p className="text-sm">{order.customerName}</p>
                  <p className="text-sm">{order.phone}</p>
                  {order.email && <p className="text-sm">{order.email}</p>}
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Доставка
                  </h4>
                  <p className="text-sm">
                    {order.deliveryMethod === "post"
                      ? "Почта России"
                      : order.deliveryMethod === "cdek"
                        ? "СДЭК"
                        : "OZON"}
                  </p>
                  {order.address && <p className="text-sm">{order.address}</p>}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Товары
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder === order._id && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Изменить статус
                  </h4>
                  <div className="flex gap-2">
                    {(Object.keys(statusLabels) as OrderStatus[]).map(
                      (status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={
                            order.status === status ? "default" : "outline"
                          }
                          onClick={() => handleStatusChange(order._id, status)}
                        >
                          {statusLabels[status]}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order._id ? null : order._id,
                    )
                  }
                >
                  {selectedOrder === order._id ? "Скрыть" : "Изменить статус"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
