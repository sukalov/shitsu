import { Helmet } from "react-helmet-async";
import { SITE_CONFIG, PAGE_SEO, type PageSEOConfig } from "@/lib/seo-config";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generatePersonSchema,
} from "@/lib/schema";

interface SEOProps {
  page?: keyof typeof PAGE_SEO;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  product?: {
    name: string;
    description: string;
    image: string;
    price: number;
    isSold?: boolean;
  };
  breadcrumbs?: Array<{ name: string; path: string }>;
}

export function SEO({
  page,
  title,
  description,
  keywords,
  image,
  path,
  noIndex,
  product,
  breadcrumbs,
}: SEOProps) {
  const pageConfig: PageSEOConfig | undefined = page
    ? PAGE_SEO[page]
    : undefined;

  const finalTitle = title || pageConfig?.title || SITE_CONFIG.name;
  const finalDescription =
    description || pageConfig?.description || SITE_CONFIG.description;
  const finalKeywords =
    keywords || pageConfig?.keywords || SITE_CONFIG.keywords.join(", ");
  const finalPath = path || pageConfig?.path || "/";
  const finalImage = image || SITE_CONFIG.images.og;
  const finalNoIndex = noIndex || pageConfig?.noIndex;

  const fullUrl = `${SITE_CONFIG.url}${finalPath}`;
  const fullImageUrl = finalImage.startsWith("http")
    ? finalImage
    : `${SITE_CONFIG.url}${finalImage}`;

  const schemas: object[] = [
    generateOrganizationSchema(),
    generateLocalBusinessSchema(),
    generateWebsiteSchema(),
  ];

  if (product) {
    schemas.push(
      generateProductSchema({
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        url: fullUrl,
        availability: product.isSold ? "SoldOut" : "InStock",
      }),
    );
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(
      generateBreadcrumbSchema(
        breadcrumbs.map((b) => ({
          name: b.name,
          url: `${SITE_CONFIG.url}${b.path}`,
        })),
      ),
    );
  }

  if (page === "about") {
    schemas.push(generatePersonSchema());
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={SITE_CONFIG.artistNameFull} />
      <meta
        name="robots"
        content={finalNoIndex ? "noindex, nofollow" : "index, follow"}
      />

      <meta name="geo.region" content={SITE_CONFIG.region} />
      <meta name="geo.placename" content={SITE_CONFIG.city} />
      <meta name="language" content={SITE_CONFIG.language} />

      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={product ? "product" : "website"} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullImageUrl} />

      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}
