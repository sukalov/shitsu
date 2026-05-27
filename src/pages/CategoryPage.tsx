import { useProducts, useMerchProductsBySubcategory } from "@/lib/hooks";
import type { Category } from "@/lib/types";
import { useLocation } from "react-router";
import { ProductGridSkeleton } from "@/components/loading-states";
import { ProductCard } from "@/components/ProductCard";
import { HeaderImage } from "@/components/HeaderImage";
import { SEO } from "@/components/SEO";

interface CategoryPageProps {
  category?: string;
  title: string;
  isSold?: boolean;
}

export function CategoryPage({ category, title, isSold }: CategoryPageProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subcategorySlug =
    category === "merch" ? searchParams.get("subcategory") : null;

  const baseProducts = useProducts(category as Category, isSold ?? false);
  const merchSubcategoryProducts = useMerchProductsBySubcategory(
    subcategorySlug,
  );

  if (!baseProducts || (subcategorySlug && !merchSubcategoryProducts)) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20">
            <div className="w-full h-14 lg:h-20 object-contain mx-auto mb-6 bg-neutral-100 animate-pulse" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  const categoryProducts =
    category === "merch" && subcategorySlug && merchSubcategoryProducts
      ? merchSubcategoryProducts
      : baseProducts;

  const seoPage =
    category === "originals"
      ? "originals"
      : category === "merch"
        ? "merch"
        : "archive";

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <SEO page={seoPage} />
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src={
              category === "originals"
                ? "/headers/originals.webp"
                : category === "merch"
                  ? "/headers/merch.webp"
                  : "/headers/archive.webp"
            }
            alt={title}
            className="w-full h-14 lg:h-20 object-contain mx-auto mb-6"
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            {title}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {categoryProducts.map((product, idx) => (
            <div
              key={product._id}
              className={
                idx % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : undefined
              }
            >
              <ProductCard product={product} featured={idx % 5 === 0} />
            </div>
          ))}
        </div>

        {categoryProducts.length === 0 && (
          <div className="text-center py-32">
            <p className="text-2xl text-neutral-400">
              В этой категории пока нет работ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
