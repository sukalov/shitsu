import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(image: string): string {
  if (!image) return "https://placehold.co/400x400?text=No+Image";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

  const baseUrl = siteUrl || convexUrl || "https://shitsu.convex.cloud";
  return `${baseUrl}/getImage?storageId=${image}`;
}
