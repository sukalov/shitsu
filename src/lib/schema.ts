import { SITE_CONFIG } from "./seo-config";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    alternateName: `SHITSU — ${SITE_CONFIG.artistNameFull}`,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.images.logo}`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.region,
      addressCountry: SITE_CONFIG.country,
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.tiktok,
      SITE_CONFIG.social.telegram,
      SITE_CONFIG.social.vk,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONFIG.email,
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: ["Russian"],
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.images.og}`,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.region,
      addressCountry: SITE_CONFIG.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 55.7558,
      longitude: 37.6173,
    },
    openingHours: "Mo-Su 10:00-20:00",
    priceRange: "₽₽",
    areaServed: {
      "@type": "City",
      name: SITE_CONFIG.city,
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.tiktok,
      SITE_CONFIG.social.telegram,
    ].filter(Boolean),
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.artistNameFull,
    alternateName: SITE_CONFIG.name,
    jobTitle: "Художник",
    description: SITE_CONFIG.tagline,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.images.artist}`,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.city,
      addressCountry: SITE_CONFIG.country,
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.tiktok,
      SITE_CONFIG.social.telegram,
    ].filter(Boolean),
  };
}

interface ProductSchemaParams {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  url: string;
  availability?: "InStock" | "SoldOut";
}

export function generateProductSchema(params: ProductSchemaParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: params.name,
    description: params.description,
    image: params.image,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      url: params.url,
      price: params.price,
      priceCurrency: params.currency || "RUB",
      availability:
        params.availability === "SoldOut"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.language,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.artistNameFull,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}${SITE_CONFIG.images.logo}`,
      },
    },
  };
}

export function generateFAQSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
