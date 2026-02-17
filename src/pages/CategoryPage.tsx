import { useProducts, type Category } from "@/lib/hooks";
import { ProductGridSkeleton } from "@/components/loading-states";
import { ProductCard } from "@/components/ProductCard";
import { HeaderImage } from "@/components/HeaderImage";

interface CategoryPageProps {
  category?: string;
  title: string;
  isSold?: boolean;
}

export function CategoryPage({ category, title, isSold }: CategoryPageProps) {
  const products = useProducts(category as Category, isSold);

  if (!products) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20">
            <div className="h-14 lg:h-20 w-auto object-contain mx-auto mb-6 bg-neutral-100 animate-pulse w-48" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  const categoryProducts = products;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src={
              category === "originals"
                ? "./headers/originals.png"
                : category === "merch"
                  ? "./headers/merch.png"
                  : "./headers/archive.png"
            }
            alt={title}
            className="h-14 lg:h-20 w-auto object-contain mx-auto mb-6"
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
