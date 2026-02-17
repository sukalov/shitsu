# AGENTS.md - Shitsu Project Guidelines

## Build & Development Commands

```bash
# Development (frontend + backend)
npm run dev

# Frontend only
npm run dev:frontend

# Backend only (Convex)
npm run dev:backend

# Production build
npm run build

# Linting (TypeScript + ESLint)
npm run lint

# Preview production build
npm run preview
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
