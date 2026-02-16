import { useState } from "react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "3/4" | "4/5" | "1/1" | "auto";
  showSkeleton?: boolean;
}

function ProductImage({
  src,
  alt,
  className,
  aspectRatio = "auto",
  showSkeleton = true,
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    "3/4": "aspect-[3/4]",
    "4/5": "aspect-[4/5]",
    "1/1": "aspect-square",
    auto: "",
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const fallbackSrc = "https://placehold.co/400x400?text=No+Image";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-100",
        aspectRatioClasses[aspectRatio],
        className,
      )}
    >
      {showSkeleton && isLoading && <Skeleton className="absolute inset-0" />}
      <img
        src={hasError ? fallbackSrc : getImageUrl(src)}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoading ? "opacity-0 blur-sm" : "opacity-100 blur-0",
        )}
      />
    </div>
  );
}

export { ProductImage };
