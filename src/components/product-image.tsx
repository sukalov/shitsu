import { useState } from "react";
import { cn, getImageUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "3/4" | "4/5" | "1/1" | "auto";
  showSkeleton?: boolean;
  priority?: boolean;
}

const ASPECT_CLASSES = {
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  auto: "",
} as const;

const FALLBACK_SRC = "https://placehold.co/400x400?text=No+Image";

export function ProductImage({
  src,
  alt,
  className,
  aspectRatio = "auto",
  showSkeleton = true,
  priority = false,
}: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imgSrc = hasError ? FALLBACK_SRC : getImageUrl(src);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-100",
        ASPECT_CLASSES[aspectRatio],
        className,
      )}
    >
      {showSkeleton && !isLoaded && <Skeleton className="absolute inset-0" />}
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
        )}
      />
    </div>
  );
}
