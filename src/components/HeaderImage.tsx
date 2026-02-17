interface HeaderImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function HeaderImage({ src, alt, className, style }: HeaderImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = "none";
        target.nextElementSibling?.classList.remove("hidden");
      }}
    />
  );
}
