import { useProducts } from "@/lib/hooks";
import { ProductGridSkeleton } from "@/components/loading-states";
import { ProductCard } from "@/components/ProductCard";

export function HomePage() {
  const products = useProducts();

  if (!products) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  const collectionProducts = products.filter(
    (p) => (p.category === "originals" || p.category === "merch") && !p.isSold,
  );

  return (
    <div className="min-h-screen">
      <section className="py-32 px-6 lg:px-12 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {collectionProducts.map((product, idx) => (
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

          {collectionProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-neutral-400">
                В коллекции пока нет работ
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
