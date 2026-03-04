import { createContext, useContext } from "react";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { CartItem, CartContextType, Product } from "@/lib/types";

const cartItemsAtom = atomWithStorage<CartItem[]>("shitsu-cart", []);

const isOpenAtom = atom(false);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const addItem = (product: Product) => {
    const productId = product._id.toString();
    const isOriginal = product.category === "originals";

    setItems((current) => {
      const existing = current.find((item) => item._id === productId);
      if (existing) {
        if (isOriginal) return current;
        return current.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          _id: productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          images: product.images,
          category: product.category,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.find((i) => i._id === productId);
    const isOriginal = item?.category === "originals";

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    if (isOriginal && quantity > 1) {
      quantity = 1;
    }
    setItems((current) =>
      current.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
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

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
