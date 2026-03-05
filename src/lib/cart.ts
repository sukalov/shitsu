import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import type { CartItem, Product } from "./types";

const cartItemsAtom = atomWithStorage<CartItem[]>("shitsu-cart", []);
const cartOpenAtom = atom(false);
const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ),
);

export function useCart() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [isOpen, setIsOpen] = useAtom(cartOpenAtom);
  const total = useAtomValue(cartTotalAtom);

  const addItem = useCallback(
    (product: Product) => {
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
    },
    [setItems, setIsOpen],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((current) => current.filter((item) => item._id !== productId));
    },
    [setItems],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((current) =>
          current.filter((item) => item._id !== productId),
        );
        return;
      }
      setItems((current) =>
        current.map((item) => {
          if (item._id !== productId) return item;
          const clampedQty =
            item.category === "originals" ? 1 : quantity;
          return { ...item, quantity: clampedQty };
        }),
      );
    },
    [setItems],
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  return {
    items,
    total,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}

export function useCartBadge() {
  const items = useAtomValue(cartItemsAtom);
  const setIsOpen = useSetAtom(cartOpenAtom);
  return { count: items.length, setIsOpen };
}
