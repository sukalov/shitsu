import { SITE_CONFIG, PAGE_SEO } from "./seo-config";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export function generateSitemap(productIds?: string[]): string {
  const today = new Date().toISOString().split("T")[0];

  const staticUrls: SitemapUrl[] = Object.values(PAGE_SEO).map(
    (page, index) => ({
      loc: `${SITE_CONFIG.url}${page.path}`,
      lastmod: today,
      changefreq: index === 0 ? "weekly" : "monthly",
      priority:
        page.path === "/"
          ? 1.0
          : page.path === "/originals" || page.path === "/merch"
            ? 0.9
            : 0.7,
    }),
  );

  const productUrls: SitemapUrl[] = (productIds || []).map((id) => ({
    loc: `${SITE_CONFIG.url}/product/${id}`,
    lastmod: today,
    changefreq: "weekly" as const,
    priority: 0.8,
  }));

  const allUrls = [...staticUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return xml;
}
