import { Id } from "../../convex/_generated/dataModel";

export type Category = "originals" | "merch";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Product {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  price: number;
  category: Category;
  images: string[];
  description: string;
  isSold: boolean;
  seriesId?: string;
  merchSubcategorySlug?: string | null;
}

export interface MerchSubcategory {
  _id: Id<"merchSubcategories">;
  _creationTime: number;
  name: string;
  slug: string;
  order?: number;
  createdAt: number;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  category: Category;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Новый",
  confirmed: "Подтверждён",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-neutral-100 text-neutral-500",
};

export const DELIVERY_METHODS = [
  { id: "post", label: "Почта России" },
  { id: "cdek", label: "СДЭК" },
  { id: "ozon", label: "OZON" },
] as const;

export function getDeliveryLabel(method: string): string {
  return (
    DELIVERY_METHODS.find((m) => m.id === method)?.label ?? method
  );
}

export const SOCIAL_LINKS = [
  {
    id: "instagram",
    href: "https://instagram.com/shitsu_kira",
    label: "Instagram",
    handle: "@shitsu_kira",
  },
  {
    id: "tiktok",
    href: "https://www.tiktok.com/@_shitsu",
    label: "TikTok",
    handle: "@_shitsu",
  },
  {
    id: "telegram",
    href: "https://t.me/shitsu_art",
    label: "Telegram",
    handle: "@shitsu_art",
  },
] as const;
