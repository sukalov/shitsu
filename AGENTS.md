# AGENTS.md - Shitsu Project Guidelines

## Build & Development Commands

```bash
# Development (runs frontend + backend + sets up dashboard)
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
- **UI Components**: shadcn/ui (base-maia style) + Base UI primitives
- **Backend**: Convex (serverless database + functions)
- **Auth**: Convex Auth
- **Icons**: Phosphor Icons
- **Font**: Figtree Variable

## Code Style Guidelines

### TypeScript

- Strict mode enabled
- Use explicit return types for Convex functions
- Use `Id<'tableName'>` for document IDs (import from `convex/_generated/dataModel`)
- Mark unused variables with `_` prefix to suppress warnings

### Imports (Absolute via `@/`)

```typescript
// Good
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Convex imports
import { query, mutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
```

### Component Patterns

```typescript
// Use Base UI primitives as foundation
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// CVA for variants
const componentVariants = cva("base-classes", {
  variants: { variant: { default: "" } },
  defaultVariants: { variant: "default" }
});

// Function component with forwarded props
function Component({ className, variant, ...props }: Props) {
  return <div className={cn(componentVariants({ variant }), className)} {...props} />;
}
```

### CSS/Styling

- Use Tailwind CSS v4 with `@theme` in `src/index.css`
- CSS variables for theming (`--primary`, `--background`, etc.)
- Use `cn()` utility for conditional class merging
- shadcn uses `rounded-4xl`, `rounded-2xl` - follow this pattern

## shadcn/ui Best Practices

### Core Principle: ALWAYS Build on Base UI

Every component MUST use `@base-ui/react` primitives as the foundation:

```typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Select as SelectPrimitive } from "@base-ui/react/select";
```

### Creating Custom shadcn Components

1. **Base it on Base UI**: Find the appropriate primitive in `@base-ui/react`
2. **Use CVA for variants**: All configurable styling goes through `class-variance-authority`
3. **Follow naming**: `ComponentName` with `data-slot="component-name"` attribute
4. **Export pattern**: Export component and its variants: `export { Component, componentVariants }`
5. **Place in**: `src/components/ui/`

### Example Custom Component Structure

```typescript
import * as React from "react";
import { PrimitiveName } from "@base-ui/react/primitive";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const customVariants = cva("base-classes", {
  variants: { size: { default: "h-9", sm: "h-8", lg: "h-10" } },
  defaultVariants: { size: "default" }
});

interface CustomProps extends React.ComponentProps<typeof PrimitiveName>,
  VariantProps<typeof customVariants> {}

function Custom({ className, size, ...props }: CustomProps) {
  return (
    <PrimitiveName
      data-slot="custom"
      className={cn(customVariants({ size, className }))}
      {...props}
    />
  );
}

export { Custom, customVariants };
```

### Existing Components Reference

- `button.tsx`: CVA + Base UI Button
- `card.tsx`: Compound components (Card, CardHeader, CardContent, etc.)
- `input.tsx`: Base UI Field + styling
- `select.tsx`, `combobox.tsx`: Complex Base UI compositions

## Convex Best Practices

### Function Syntax (New Style)

```typescript
import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
  internalAction,
} from "./_generated/server";
import { v } from "convex/values";

export const myFunction = query({
  args: { param: v.string() },
  returns: v.null(), // Always specify returns
  handler: async (ctx, args) => {
    // Implementation
    return null;
  },
});
```

### Rules

- **Always** include `args` and `returns` validators
- Use `internal*` for private functions (not exposed to clients)
- Use `query`/`mutation`/`action` for public API
- File-based routing: `convex/users.ts` → `api.users.functionName`
- Call functions via: `ctx.runQuery(api.file.function, args)`

### Schema Design

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    name: v.string(),
    count: v.number(),
  }).index("by_name", ["name"]), // Index name includes all fields
});
```

### Database Operations

- **Read**: `ctx.db.query("table").withIndex("by_field").order("desc").take(n)`
- **Write**: `ctx.db.insert("table", data)`, `ctx.db.patch("table", id, data)`, `ctx.db.replace("table", id, data)`
- **Never use `.filter()`** - always use indexes with `withIndex()`
- Use `.unique()` for single document retrieval

### Error Handling

```typescript
const doc = await ctx.db.get(args.id);
if (!doc) {
  throw new Error("Document not found");
}
```

## File Organization

```
src/
  components/
    ui/              # shadcn components (Base UI based)
  lib/
    utils.ts         # cn() helper
  index.css          # Tailwind + theme variables
convex/
  schema.ts          # Database schema
  auth.ts            # Auth configuration
  *.ts               # Function files (file-based routing)
```

## Design Principles

- **Aesthetic**: Bold, intentional choices. Avoid generic "AI slop" aesthetics
- **Typography**: Distinctive fonts (Figtree Variable in use)
- **Components**: Every UI element must be built on shadcn/Base UI primitives
- **Never skip shadcn**: Always use shadcn components as the foundation
- **Custom components**: Follow the shadcn pattern with CVA + Base UI primitives
