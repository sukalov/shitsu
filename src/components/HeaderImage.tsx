import { useState } from "react";

interface HeaderImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoadComplete?: () => void;
}

export function HeaderImage({
  src,
  alt,
  className,
  style,
  onLoadComplete,
}: HeaderImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <h1 className="text-2xl lg:text-3xl tracking-[0.15em] uppercase font-medium">
        {alt}
      </h1>
    );
  }

  return (
    <>
      {!isLoaded && (
        <div className="h-12 lg:h-16 w-48 bg-neutral-100 animate-pulse rounded-sm" />
      )}
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="sync"
        className={className}
        style={{
          ...style,
          display: isLoaded ? undefined : "none",
        }}
        onLoad={() => {
          setIsLoaded(true);
          onLoadComplete?.();
        }}
        onError={() => {
          setHasError(true);
          onLoadComplete?.();
        }}
      />
    </>
  );
}
