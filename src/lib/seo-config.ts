export const SITE_CONFIG = {
  name: "SHITSU",
  artistName: "Кира",
  artistNameFull: "Кира SHITSU",
  tagline: "Художница из Москвы",
  description:
    "SHITSU — художница Кира из Москвы. Оригинальные картины, мерч и картины на заказ. Японская эстетика, современная живопись.",
  url: "https://shitsukira.ru",
  locale: "ru_RU",
  language: "ru",
  region: "RU-MOW",
  city: "Москва",
  country: "Россия",
  email: "shitsu2319@gmail.com",
  social: {
    instagram: "https://instagram.com/shitsu_kira",
    tiktok: "https://www.tiktok.com/@_shitsu",
    telegram: "https://t.me/shitsu_art",
    vk: "",
  },
  images: {
    logo: "/logo.png",
    artist: "/artist.png",
    og: "/logo.png",
  },
  keywords: [
    "купить картину Москва",
    "художник Москва",
    "картина на заказ",
    "оригинальные картины",
    "современная живопись",
    "японская эстетика",
    "картина в подарок",
    "мерч художника",
    "SHITSU",
    "Кира художник",
  ],
};

export const PAGE_SEO: Record<string, PageSEOConfig> = {
  home: {
    title: "SHITSU — Кира, художница | Картины на заказ Москва",
    description:
      "Купить оригинальные картины и мерч от художницы Киры (SHITSU). Картины на заказ, японская эстетика. Доставка по Москве и России.",
    keywords:
      "купить картину Москва, художник SHITSU, Кира художница, картины на заказ, оригинальные картины",
    path: "/",
  },
  originals: {
    title: "Оригинальные картины — SHITSU | Купить картину в Москве",
    description:
      "Оригинальные картины художницы Киры (SHITSU). Масло, акрил, уникальные работы. Купить картину в Москве с доставкой.",
    keywords:
      "купить картину масло, оригинал художника, картина маслом Москва, авторская живопись",
    path: "/originals",
  },
  merch: {
    title: "Мерч — SHITSU | Принты и сувениры художника",
    description:
      "Мерч от художницы Киры (SHITSU). Принты, постеры, сувениры с авторскими работами. Доставка по России.",
    keywords:
      "мерч художника, принты картины, постеры купить, сувениры с картинами",
    path: "/merch",
  },
  archive: {
    title: "Архив — SHITSU | Проданные работы",
    description:
      "Архив проданных картин художницы Киры (SHITSU). Посмотрите предыдущие работы и закажите похожую картину на заказ.",
    keywords: "архив картин, проданные картины, портфолио художника",
    path: "/archive",
  },
  custom: {
    title: "Картина на заказ — SHITSU | Заказать картину в Москве",
    description:
      "Закажите уникальную картину на заказ у художницы Киры (SHITSU). Портреты, пейзажи, абстракция. Москва и доставка по России.",
    keywords:
      "картина на заказ Москва, заказать картину, портрет на заказ, художник на заказ",
    path: "/custom",
  },
  about: {
    title: "О художнице — SHITSU | Кира, биография",
    description:
      "Кира (SHITSU) — художница из Москвы. Японская эстетика, современная живопись. Узнайте больше о творчестве и вдохновении художника.",
    keywords:
      "Кира художник, SHITSU биография, художница Москва, японская эстетика",
    path: "/about",
  },
  contacts: {
    title: "Контакты — SHITSU | Связаться с художником",
    description:
      "Связаться с художницей Кирой (SHITSU). Instagram, Telegram, TikTok, email. Москва, Россия.",
    keywords: "контакты художника, связаться SHITSU, Кира художник контакты",
    path: "/contacts",
  },
  delivery: {
    title: "Доставка и оплата — SHITSU",
    description:
      "Доставка картин по Москве и России. Способы оплаты, условия возврата. Художница Кира (SHITSU).",
    keywords: "доставка картин Москва, оплата картины, доставка картины Россия",
    path: "/delivery",
  },
};

export interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateProductMeta(product: {
  name: string;
  description?: string;
  price: number;
  images: string[];
  isSold?: boolean;
}) {
  return {
    title: `${product.name} — SHITSU | Купить картину`,
    description:
      product.description ||
      `${product.name} от художницы Киры (SHITSU). ${product.price.toLocaleString("ru-RU")} ₽. Доставка по Москве и России.`,
    image: product.images[0],
    product: {
      name: product.name,
      description: product.description || `${product.name} — SHITSU`,
      image: product.images[0],
      price: product.price,
      isSold: product.isSold,
    },
  };
}
