import { useState, useRef } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ShoppingBag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductDetailSkeleton } from "@/components/loading-states";
import { useProduct, useProducts, useProductsBySeries } from "@/lib/hooks";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { getImageUrl, cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { generateProductMeta } from "@/lib/seo-config";

function VariantCard({
  product,
}: {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    isSold: boolean;
  };
}) {
  return (
    <Link to={`/product/${product._id}`} className="group flex-shrink-0">
      <div className="relative w-20 h-20 bg-neutral-100 overflow-hidden mb-2">
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.isSold && (
          <div className="absolute bottom-0 inset-x-0 bg-white/40 backdrop-blur-sm px-1 py-1">
            <img
              src="/headers/sold.webp"
              alt="Продано"
              className="h-12 w-full object-contain"
            />
          </div>
        )}
      </div>
      <p className="text-xs text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 max-w-[80px] uppercase tracking-[0.1em]">
        {product.name}
      </p>
      <p className="text-xs text-neutral-500">
        {product.price.toLocaleString("ru-RU")} ₽
      </p>
    </Link>
  );
}

export function ProductPage() {
  const { id } = useParams();
  const product = useProduct(id);

  if (product === undefined) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return <NotFoundPage />;
  }

  return <ProductPageContent product={product} />;
}

function ProductPageContent({ product }: { product: Product }) {
  const seriesProducts = useProductsBySeries(product.seriesId ?? "");
  const categoryProducts = useProducts(product.category, false);
  const { addItem } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const seriesVariants =
    product.seriesId && seriesProducts
      ? seriesProducts.filter((p) => p._id !== product._id)
      : [];

  const relatedProducts = (categoryProducts ?? []).filter(
    (p) =>
      p.category === product.category &&
      p._id !== product._id &&
      !p.isSold &&
      !(product.seriesId && p.seriesId === product.seriesId),
  );

  const relatedTitle =
    product.category === "merch" ? "Другой мерч" : "Другие оригиналы";

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

  const productMeta = generateProductMeta(product);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
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
                <div className="absolute bottom-0 inset-x-0 bg-white/40 backdrop-blur-sm px-4 py-6 shadow-lg">
                  <img
                    src="/headers/sold.webp"
                    alt="Картина продана"
                    className="h-32 w-full object-contain mx-auto"
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
                      loading="lazy"
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

              {seriesVariants.length > 0 && (
                <div className="py-6 border-y border-neutral-200">
                  <h3 className="text-xs text-neutral-500 mb-4 uppercase tracking-[0.15em]">
                    варианты
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {seriesVariants.map((variant) => (
                      <VariantCard key={variant._id} product={variant} />
                    ))}
                  </div>
                </div>
              )}

              {product.description && (
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              )}

              {!product.isSold && (
                <div className="pt-4">
                  <Button
                    onClick={() => addItem(product)}
                    className="w-full uppercase tracking-[0.1em]"
                    size="lg"
                  >
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Добавить в корзину
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-sm text-neutral-500 mb-12 uppercase tracking-[0.15em]">
              {relatedTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((p) => (
                <VariantCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
