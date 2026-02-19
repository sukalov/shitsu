# AGENTS.md - Shitsu Project Guidelines

## Build & Development Commands

```bash
# Development (frontend + backend)
bun run dev

# Frontend only
bun run dev:frontend

# Backend only (Convex)
bun run dev:backend

# Production build
bun run build

# Linting (TypeScript + ESLint)
bun run lint

# Preview production build
bun run preview
```

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **UI**: shadcn/ui (Base UI primitives) + Phosphor Icons
- **Backend**: Convex (serverless) + Convex Auth
- **Font**: Figtree Variable

## Code Style

### TypeScript

- Strict mode enabled
- Use explicit return types for Convex functions
- Use `Id<'tableName'>` for document IDs (from `convex/_generated/dataModel`)
- Mark unused variables with `_` prefix

### Imports

```typescript
// Absolute imports via @/
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Convex
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
```

### Component Patterns

```typescript
// Always use Base UI primitives
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: { variant: { default: "" } },
  defaultVariants: { variant: "default" }
});

interface ButtonProps extends React.ComponentProps<typeof ButtonPrimitive>,
  VariantProps<typeof buttonVariants> {}

function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

### CSS

- Tailwind CSS v4 with `@theme` in `src/index.css`
- Use `cn()` for conditional class merging
- shadcn uses `rounded-4xl`, `rounded-2xl` pattern

## shadcn/ui Rules

1. **ALWAYS** use `@base-ui/react` primitives as foundation
2. Use CVA for all variant styling
3. Include `data-slot="component-name"` attribute
4. Export component + variants: `export { Component, componentVariants }`
5. Place in `src/components/ui/`

## Convex Functions

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const myFunction = query({
  args: { param: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    return null;
  },
});
```

**Rules**:

- Always include `args` and `returns` validators
- Use `internal*` for private functions
- File-based routing: `convex/users.ts` → `api.users.functionName`
- Never use `.filter()` - use indexes with `withIndex()`

## Database

```typescript
// Read
ctx.db.query("table").withIndex("by_field").order("desc").take(n);

// Write
ctx.db.insert("table", data);
ctx.db.patch("table", id, data);

// Error handling
const doc = await ctx.db.get(id);
if (!doc) throw new Error("Not found");
```

## File Organization

```
src/
  components/ui/     # shadcn components
  contexts/          # React contexts (CartContext.tsx)
  pages/            # Page components
    admin/          # Admin pages
  lib/              # utils.ts, hooks.ts, types.ts
convex/
  schema.ts         # Database schema
  *.ts              # Function files
```

## Design Principles

- Bold, intentional aesthetic - avoid generic "AI slop"
- Every UI element built on shadcn/Base UI primitives
- Follow existing patterns in codebase

## SEO Implementation

### Files Created

- `src/components/SEO.tsx` - React Helmet component for meta tags
- `src/lib/seo-config.ts` - Site config, page SEO, and `generateProductMeta()`
- `src/lib/schema.ts` - JSON-LD schema generators
- `src/lib/sitemap.ts` - Sitemap generator utility
- `public/robots.txt` - Search engine directives
- `public/sitemap.xml` - Static sitemap (update when adding products)

### SEO Post-Deployment Checklist

**Yandex Setup (Critical for Russian SEO):**

- [ ] Create account at [Yandex.Webmaster](https://webmaster.yandex.com)
- [ ] Add site and verify ownership (replace `YOUR_YANDEX_VERIFICATION_CODE` in index.html)
- [ ] Submit sitemap: `https://[your-domain]/sitemap.xml`
- [ ] Set geo-region to Moscow in Yandex.Webmaster settings

**Yandex.Metrica (Analytics):**

- [ ] Create account at [Yandex.Metrica](https://metrica.yandex.com)
- [ ] Add tracking code to `index.html` (after verification)

**Yandex.Business (Local SEO):**

- [ ] Create listing at [Yandex.Business](https://business.yandex.com)
- [ ] Add to Yandex.Maps with category "Художник" or "Арт-галерея"
- [ ] Include: address, phone, hours, photos

**Other Russian Platforms:**

- [ ] Create VKontakte page (VK is #1 social network in Russia)
- [ ] Register on 2GIS (popular Moscow directory)
- [ ] Create Google My Business (for Google.ru)

**Domain & Technical:**

- [ ] Update `SITE_CONFIG.url` in `src/lib/seo-config.ts` with production domain
- [ ] Update `robots.txt` and `sitemap.xml` with production domain
- [ ] Update `index.html` canonical URLs
- [ ] Test meta tags with [Yandex Webmaster Tools](https://webmaster.yandex.com)

**Keywords to Track (Yandex Wordstat):**

- купить картину Москва
- художник на заказ Москва
- картина маслом купить
- японский стиль живопись
- Кира SHITSU
