import { useEffect, useState } from "react";
import { cn, getImageUrl, preloadImage } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "3/4" | "4/5" | "1/1" | "auto";
  showSkeleton?: boolean;
  priority?: boolean;
}

function ProductImage({
  src,
  alt,
  className,
  aspectRatio = "auto",
  showSkeleton = true,
  priority = false,
}: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const url = hasError
      ? "https://placehold.co/400x400?text=No+Image"
      : getImageUrl(src);
    preloadImage(url);
  }, [src, hasError]);

  const aspectRatioClasses = {
    "3/4": "aspect-[3/4]",
    "4/5": "aspect-[4/5]",
    "1/1": "aspect-square",
    auto: "",
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsLoaded(true);
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
      {showSkeleton && !isLoaded && <Skeleton className="absolute inset-0" />}
      <img
        src={hasError ? fallbackSrc : getImageUrl(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
        )}
      />
    </div>
  );
}

export { ProductImage };
