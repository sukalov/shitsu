import { useState, useRef } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ShoppingBag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProductDetailSkeleton } from "@/components/loading-states";
import { useProducts } from "@/lib/hooks";
import { useCart } from "@/contexts/CartContext";
import { getImageUrl, cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { generateProductMeta } from "@/lib/seo-config";

export function ProductPage() {
  const { id } = useParams();
  const products = useProducts();
  const product =
    products?.find((p) => p._id === id) || (products && products[0]);
  const allProducts = useProducts();
  const { addItem } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  if (!products) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex items-center justify-center">
        <p className="text-xl text-neutral-400">Товар не найден</p>
      </div>
    );
  }

  const seriesProducts = product.seriesId
    ? (allProducts || []).filter(
        (p) => p.seriesId === product.seriesId && p._id !== product._id,
      )
    : [];

  const relatedProducts = (allProducts || []).filter(
    (p) =>
      p.category === product.category &&
      p._id !== product._id &&
      !p.isSold &&
      !(product.seriesId && p.seriesId === product.seriesId),
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const productMeta = product ? generateProductMeta(product) : null;

  const ProductCard = ({
    product: p,
  }: {
    product: {
      _id: string;
      name: string;
      price: number;
      images: string[];
      isSold: boolean;
    };
  }) => (
    <Link to={`/product/${p._id}`} className="group flex-shrink-0">
      <div className="relative w-20 h-20 bg-neutral-100 overflow-hidden mb-2">
        <img
          src={getImageUrl(p.images[0])}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {p.isSold && (
          <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5">
            <img
              src="./headers/sold.png"
              alt="Продано"
              className="h-3 w-auto object-contain"
            />
          </div>
        )}
      </div>
      <p className="text-xs text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 max-w-[80px] uppercase tracking-[0.1em]">
        {p.name}
      </p>
      <p className="text-xs text-neutral-500">
        {p.price.toLocaleString("ru-RU")} ₽
      </p>
    </Link>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      {productMeta && (
        <SEO
          title={productMeta.title}
          description={productMeta.description}
          image={productMeta.image}
          path={`/product/${product._id}`}
          product={productMeta.product}
          breadcrumbs={[
            { name: "Главная", path: "/" },
            {
              name: product.category === "originals" ? "Оригиналы" : "Мерч",
              path: product.category === "originals" ? "/originals" : "/merch",
            },
            { name: product.name, path: `/product/${product._id}` },
          ]}
        />
      )}
      <div className="max-w-[1600px] mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к коллекции
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div
              ref={imageContainerRef}
              className={cn(
                "relative aspect-[4/5] bg-neutral-100 overflow-hidden",
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={getImageUrl(product.images[currentImage])}
                alt={`Картина "${product.name}" — Кира SHITSU, Москва`}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-200",
                  isZoomed && "scale-[2.5]",
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
              />
              {product.isSold && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-lg">
                  <img
                    src="./headers/sold.png"
                    alt="Картина продана"
                    className="h-8 w-auto object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    onClick={() => setCurrentImage(idx)}
                    className={cn(
                      "w-20 h-20 p-0 overflow-hidden border-2 transition-all duration-300 rounded-none flex-shrink-0",
                      currentImage === idx
                        ? "border-neutral-900"
                        : "border-transparent hover:border-neutral-300",
                    )}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Картина "${product.name}" — фото ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-12">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl lg:text-4xl text-neutral-900 mb-4 uppercase tracking-[0.15em]">
                  {product.name}
                </h1>
                <p className="text-3xl text-neutral-900">
                  {product.price.toLocaleString("ru-RU")} ₽
                </p>
              </div>

              {seriesProducts.length > 0 && (
                <div className="py-6 border-y border-neutral-200">
                  <h3 className="text-xs text-neutral-500 mb-4 uppercase tracking-[0.15em]">
                    варианты
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {seriesProducts.map((variant) => (
                      <ProductCard key={variant._id} product={variant} />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs mb-4 uppercase tracking-[0.15em] text-neutral-500">
                  О работе
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-4">
                {product.isSold ? (
                  <Button
                    disabled
                    className="w-full uppercase tracking-[0.1em]"
                    size="lg"
                  >
                    Продано
                  </Button>
                ) : (
                  <Button
                    onClick={() => addItem(product)}
                    className="w-full uppercase tracking-[0.1em]"
                    size="lg"
                  >
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Добавить в корзину
                  </Button>
                )}
              </div>

              <div className="pt-6 text-xs text-neutral-500 leading-relaxed">
                <p>Доставка рассчитывается индивидуально.</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-sm text-neutral-500 mb-12 uppercase tracking-[0.15em]">
              Похожие работы
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
