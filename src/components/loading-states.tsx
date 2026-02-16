import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className="group">
      <div
        className={cn(
          "relative overflow-hidden mb-6 bg-neutral-100",
          featured ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <Skeleton className="w-full h-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} featured={idx % 5 === 0} />
      ))}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <div className="space-y-4">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="w-20 h-20" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

function AdminTableSkeleton({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 pb-4 border-b">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={idx} className="h-5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 py-4 border-b border-neutral-100"
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={cn(
                "h-5 flex-1",
                colIdx === 0 && "w-20",
                colIdx === cols - 1 && "w-24",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
        <span className="text-neutral-500 animate-pulse">Загрузка...</span>
      </div>
    </div>
  );
}

function ImageSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("w-full h-full", className)} />;
}

export {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailSkeleton,
  AdminTableSkeleton,
  PageLoader,
  ImageSkeleton,
};
