import { Id } from "../../convex/_generated/dataModel";

export type Category = "originals" | "merch";

export interface Product {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  price: number;
  category: Category;
  subcategory?: string;
  images: string[];
  description: string;
  isSold: boolean;
  seriesId?: string;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
