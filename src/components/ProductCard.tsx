import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group">
      <Link to={`/product/${product._id}`}>
        <div
          className={cn(
            "relative overflow-hidden mb-6 bg-neutral-100",
            featured ? "aspect-[3/4]" : "aspect-[4/5]",
          )}
        >
          <ProductImage
            src={product.images[0]}
            alt={`Картина "${product.name}" — Кира SHITSU, Москва`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            aspectRatio={featured ? "3/4" : "4/5"}
          />
          {product.isSold && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg">
              <img
                src="./headers/sold.webp"
                alt="Картина продана"
                className="h-6 w-auto object-contain"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-all duration-500" />
        </div>
      </Link>

      <div className="space-y-2">
        <Link to={`/product/${product._id}`}>
          <h3
            className={cn(
              "text-neutral-900 group-hover:text-neutral-600 transition-colors uppercase tracking-[0.15em] text-sm",
            )}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg">{product.price.toLocaleString("ru-RU")} ₽</p>
          </div>
          {!product.isSold && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addItem(product)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 uppercase tracking-[0.1em] text-xs"
            >
              В корзину
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
